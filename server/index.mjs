import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { searchPlaces, getPlaceDetails, isGoogleMapsServerConfigured } from './services/placesService.mjs';
import { computeRoute } from './services/routesService.mjs';
import { getCurrentWeather, getWeatherForecast, isWeatherKeyConfigured } from './services/weatherService.mjs';
import { generateItineraryAI, analyzeCitizenReportAI, chatAssistantAI, isGeminiConfigured } from './services/geminiService.mjs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: '*', // Allow local frontend during development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request timeout middleware (15 seconds)
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    if (!res.headersSent) {
      res.status(504).json({
        error: 'Gateway Timeout',
        message: 'The requested upstream service or operation timed out.',
      });
    }
  });
  next();
});

// Simple sliding window rate limiter
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120;
const requestCounts = new Map();

app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    entry.count += 1;
  }
  requestCounts.set(ip, entry);

  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a moment before trying again.',
    });
  }
  next();
});

// Periodic cleanup of rate limiter map (unref so tests exit cleanly)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestCounts.entries()) {
    if (now > entry.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

// ==========================================
// API Endpoints
// ==========================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Explore City',
    tagline: 'Less Survival Mode. More Adventure.',
    city: 'Pune, Maharashtra, India',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. Configuration status (SAFE - does NOT expose secret keys)
app.get('/api/config-status', (req, res) => {
  res.json({
    googleMapsServerConfigured: isGoogleMapsServerConfigured,
    geminiConfigured: isGeminiConfigured,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    weatherConfigured: isWeatherKeyConfigured,
    launchCity: 'Pune, Maharashtra, India',
    coordinatesCenter: {
      lat: 18.5204,
      lng: 73.8567,
    },
    databaseStatus: 'None (Local-first browser persistence)',
  });
});

// 3. Search Places (Google Places API New or Pune Curated Fallback)
app.get('/api/places/search', async (req, res) => {
  try {
    const { query, category, lat, lng, radius } = req.query;

    const parsedLat = lat != null ? parseFloat(lat) : 18.5204;
    const parsedLng = lng != null ? parseFloat(lng) : 73.8567;
    const parsedRadius = radius != null ? Math.min(50000, Math.max(500, parseInt(radius, 10))) : 20000;

    if (isNaN(parsedLat) || isNaN(parsedLng) || parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      return res.status(400).json({ error: 'Invalid coordinates provided.' });
    }

    const data = await searchPlaces({
      query: typeof query === 'string' ? query : undefined,
      category: typeof category === 'string' ? category : undefined,
      lat: parsedLat,
      lng: parsedLng,
      radius: parsedRadius,
    });

    res.json(data);
  } catch (err) {
    console.error('[Error in /api/places/search]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to search places.' });
  }
});

// 4. Place Details
app.get('/api/places/details', async (req, res) => {
  try {
    const { placeId } = req.query;
    if (!placeId || typeof placeId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid placeId query parameter.' });
    }

    const data = await getPlaceDetails(placeId);
    if (!data || !data.place) {
      return res.status(404).json({ error: 'Place not found.' });
    }

    res.json(data);
  } catch (err) {
    console.error('[Error in /api/places/details]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch place details.' });
  }
});

// 5. Routes Compute (Google Routes API or Pune Model)
app.post('/api/routes/compute', async (req, res) => {
  try {
    const { origin, destination, intermediates, mode } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination objects with lat and lng are required.' });
    }

    const originLat = parseFloat(origin.lat);
    const originLng = parseFloat(origin.lng);
    const destLat = parseFloat(destination.lat);
    const destLng = parseFloat(destination.lng);

    if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
      return res.status(400).json({ error: 'Coordinates must be valid numeric values.' });
    }

    const estimate = await computeRoute({
      origin: { ...origin, lat: originLat, lng: originLng },
      destination: { ...destination, lat: destLat, lng: destLng },
      intermediates,
      mode: typeof mode === 'string' ? mode.toUpperCase() : 'DRIVE',
    });

    res.json(estimate);
  } catch (err) {
    console.error('[Error in /api/routes/compute]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to compute route.' });
  }
});

// 6. Current Weather
app.get('/api/weather/current', async (req, res) => {
  try {
    const { lat, lng, city } = req.query;
    const parsedLat = lat != null ? parseFloat(lat) : 18.5204;
    const parsedLng = lng != null ? parseFloat(lng) : 73.8567;

    const weather = await getCurrentWeather(parsedLat, parsedLng, typeof city === 'string' ? city : 'Pune, Maharashtra');
    res.json(weather);
  } catch (err) {
    console.error('[Error in /api/weather/current]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to retrieve weather data.' });
  }
});

// 7. Weather Forecast
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const parsedLat = lat != null ? parseFloat(lat) : 18.5204;
    const parsedLng = lng != null ? parseFloat(lng) : 73.8567;

    const forecast = await getWeatherForecast(parsedLat, parsedLng);
    res.json(forecast);
  } catch (err) {
    console.error('[Error in /api/weather/forecast]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to retrieve weather forecast.' });
  }
});

// 8. AI Adventure Planner (Gemini)
app.post('/api/ai/plan', async (req, res) => {
  try {
    const {
      destination,
      durationHours,
      budgetInr,
      budgetTier,
      interests,
      foodPreferences,
      travelStyle,
      accessibilityOptions,
      weather,
      availablePlaces,
      routeEstimates,
    } = req.body;

    const parsedHours = Math.min(24, Math.max(1, Number(durationHours) || 4));
    const parsedBudget = Math.max(100, Number(budgetInr) || 1500);

    const itinerary = await generateItineraryAI({
      destination: destination || 'Pune, Maharashtra',
      durationHours: parsedHours,
      budgetInr: parsedBudget,
      budgetTier: budgetTier || 'moderate',
      interests: Array.isArray(interests) ? interests : ['heritage', 'food'],
      foodPreferences: Array.isArray(foodPreferences) ? foodPreferences : ['Local Pune Specialties'],
      travelStyle: travelStyle || 'Balanced Explorer',
      accessibilityOptions: Array.isArray(accessibilityOptions) ? accessibilityOptions : [],
      weather: weather || {},
      availablePlaces: Array.isArray(availablePlaces) ? availablePlaces : [],
      routeEstimates: Array.isArray(routeEstimates) ? routeEstimates : [],
    });

    res.json(itinerary);
  } catch (err) {
    console.error('[Error in /api/ai/plan]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate adventure plan.' });
  }
});

// 9. AI Citizen Report Assistant (Gemini)
app.post('/api/ai/analyze-report', async (req, res) => {
  try {
    const { title, description, category, lat, lng, address } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Report title and description are required for analysis.' });
    }

    const analysis = await analyzeCitizenReportAI({
      title,
      description,
      category: category || 'other',
      lat: lat != null ? Number(lat) : 18.5204,
      lng: lng != null ? Number(lng) : 73.8567,
      address,
    });

    res.json(analysis);
  } catch (err) {
    console.error('[Error in /api/ai/analyze-report]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to analyze citizen report.' });
  }
});

// 10. AI Multilingual Chat Assistant (Explore City Assistant — English, Hindi, Marathi)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, language, currentTab } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const response = await chatAssistantAI({
      message,
      history: Array.isArray(history) ? history : [],
      language: ['en-IN', 'hi-IN', 'mr-IN'].includes(language) ? language : 'en-IN',
      currentTab: typeof currentTab === 'string' ? currentTab : 'home',
    });

    res.json(response);
  } catch (err) {
    console.error('[Error in /api/ai/chat]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to process chat assistant request.' });
  }
});

// Catch-all 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.url} does not exist.` });
});

// Global error handler (Never leak stack traces or secrets)
app.use((err, req, res, next) => {
  console.error('[Unhandled Global Error]:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while processing the request.',
  });
});

// Start listening if executed directly
const server = app.listen(PORT, () => {
  console.log(`Explore City API server running on http://localhost:${PORT}`);
  console.log(`Launch City: Pune, Maharashtra (18.5204° N, 73.8567° E)`);
  console.log(`Database Status: Supabase removed. Local browser persistence only.`);
});

export { app, server };
