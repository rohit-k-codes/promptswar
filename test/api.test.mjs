import test from 'node:test';
import assert from 'node:assert/strict';
import { app, server } from '../server/index.mjs';

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to make fetch requests to the test server
async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json();
  return { status: res.status, data: json };
}

async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { status: res.status, data: json };
}

test('1. GET /api/health returns valid status and Pune branding', async () => {
  const { status, data } = await apiGet('/api/health');
  assert.equal(status, 200);
  assert.equal(data.status, 'ok');
  assert.equal(data.app, 'Explore City');
  assert.equal(data.tagline, 'Less Survival Mode. More Adventure.');
  assert.equal(data.city, 'Pune, Maharashtra, India');
  assert.ok(data.timestamp);
});

test('2. GET /api/config-status returns configuration flags without leaking secrets', async () => {
  const { status, data } = await apiGet('/api/config-status');
  assert.equal(status, 200);
  assert.equal(typeof data.googleMapsServerConfigured, 'boolean');
  assert.equal(typeof data.geminiConfigured, 'boolean');
  assert.equal(typeof data.weatherConfigured, 'boolean');
  assert.equal(data.launchCity, 'Pune, Maharashtra, India');
  assert.equal(data.coordinatesCenter.lat, 18.5204);
  assert.equal(data.coordinatesCenter.lng, 73.8567);
  // Ensure no secret key fields are exposed in response
  assert.equal(data.GEMINI_API_KEY, undefined);
  assert.equal(data.GOOGLE_MAPS_SERVER_API_KEY, undefined);
  assert.equal(data.WEATHER_API_KEY, undefined);
});

test('3. GET /api/places/search returns Pune authentic places with coordinates', async () => {
  const { status, data } = await apiGet('/api/places/search?category=all');
  assert.equal(status, 200);
  assert.ok(Array.isArray(data.results));
  assert.ok(data.results.length >= 8);
  
  // Verify Shaniwar Wada or Goodluck Cafe is included
  const hasPunePlace = data.results.some(p => p.name.includes('Shaniwar') || p.name.includes('Goodluck') || p.name.includes('Vaishali'));
  assert.ok(hasPunePlace, 'Should include authentic Pune landmarks');

  // Verify coordinates are in Pune region (~18.3 to 18.7 N, 73.7 to 74.0 E)
  const first = data.results[0];
  assert.ok(first.lat >= 18.2 && first.lat <= 18.8, `Lat should be Pune latitude, got ${first.lat}`);
  assert.ok(first.lng >= 73.6 && first.lng <= 74.1, `Lng should be Pune longitude, got ${first.lng}`);
});

test('4. GET /api/places/search filters by category correctly', async () => {
  const { status, data } = await apiGet('/api/places/search?category=heritage');
  assert.equal(status, 200);
  assert.ok(data.results.length > 0);
  data.results.forEach(p => {
    assert.equal(p.category, 'heritage');
  });
});

test('5. GET /api/places/details returns single Pune place details', async () => {
  const { status, data } = await apiGet('/api/places/details?placeId=pune-place-001');
  assert.equal(status, 200);
  assert.equal(data.place.name, 'Shaniwar Wada');
  assert.equal(data.place.lat, 18.5196);
  assert.equal(data.place.lng, 73.8553);
});

test('6. POST /api/routes/compute calculates route between Pune points', async () => {
  // From Deccan Gymkhana (Goodluck Cafe) to Shaniwar Wada
  const body = {
    origin: { lat: 18.5173, lng: 73.8418, name: 'Goodluck Cafe, FC Road' },
    destination: { lat: 18.5196, lng: 73.8553, name: 'Shaniwar Wada' },
    mode: 'WALK',
  };
  const { status, data } = await apiPost('/api/routes/compute', body);
  assert.equal(status, 200);
  assert.equal(data.mode, 'WALK');
  assert.ok(data.distance_km > 0 && data.distance_km < 5);
  assert.ok(data.duration_minutes > 0);
  assert.ok(data.safety_notice);
});

test('7. POST /api/routes/compute validates missing input', async () => {
  const { status, data } = await apiPost('/api/routes/compute', {});
  assert.equal(status, 400);
  assert.ok(data.error);
});

test('8. GET /api/weather/current returns Pune weather data', async () => {
  const { status, data } = await apiGet('/api/weather/current');
  assert.equal(status, 200);
  assert.ok(data.city.includes('Pune'));
  assert.ok(typeof data.temp_c === 'number');
  assert.ok(data.condition);
  assert.ok(data.recommendation);
  assert.ok(data.last_updated);
});

test('9. GET /api/weather/forecast returns multi-day forecast for Pune', async () => {
  const { status, data } = await apiGet('/api/weather/forecast');
  assert.equal(status, 200);
  assert.ok(Array.isArray(data.forecast));
  assert.ok(data.forecast.length >= 3);
  assert.ok(data.forecast[0].date);
  assert.ok(typeof data.forecast[0].max_temp_c === 'number');
});

test('10. POST /api/ai/plan generates structured Pune adventure itinerary with INR budget', async () => {
  const body = {
    destination: 'Pune, Maharashtra',
    durationHours: 6,
    budgetInr: 1500,
    budgetTier: 'moderate',
    interests: ['heritage', 'food'],
    foodPreferences: ['Irani Chai', 'Misal Pav'],
  };
  const { status, data } = await apiPost('/api/ai/plan', body);
  assert.equal(status, 200);
  assert.ok(data.title);
  assert.equal(data.destination, 'Pune, Maharashtra');
  assert.ok(Array.isArray(data.schedule));
  assert.ok(data.schedule.length >= 2);
  assert.equal(data.currency, 'INR');
  
  // Verify schedule steps have Pune places
  const firstStep = data.schedule[0];
  assert.ok(firstStep.title);
  assert.ok(firstStep.cost_estimate_inr || firstStep.cost_estimate);
  assert.ok(firstStep.lat != null && firstStep.lng != null);
});

test('11. POST /api/ai/analyze-report analyzes citizen report locally without external submission claims', async () => {
  const body = {
    title: 'Waterlogging near Alka Talkies Bridge',
    description: 'Deep standing water along the left curve of Alka Talkies underpass. Slow down two-wheelers.',
    category: 'pothole',
    lat: 18.5135,
    lng: 73.8488,
    address: 'Alka Talkies Chowk, Pune',
  };
  const { status, data } = await apiPost('/api/ai/analyze-report', body);
  assert.equal(status, 200);
  assert.ok(['low', 'medium', 'high', 'critical'].includes(data.suggestedSeverity));
  assert.ok(typeof data.confidenceBoost === 'number');
  assert.ok(data.safetySummary);
  assert.ok(data.verificationNotice.includes('Not') || data.verificationNotice.includes('Local'));
});

test('12. POST /api/ai/chat responds in English with suggested prompts and structured action', async () => {
  const body = {
    message: 'Plan a Pune heritage and food walk under 500 rupees',
    language: 'en-IN',
  };
  const { status, data } = await apiPost('/api/ai/chat', body);
  assert.equal(status, 200);
  assert.ok(data.reply);
  assert.equal(data.language, 'en-IN');
  assert.ok(Array.isArray(data.suggestedPrompts));
  assert.ok(data.action);
});

test('13. POST /api/ai/chat responds in Marathi (mr-IN)', async () => {
  const body = {
    message: 'पुण्यात ५०० रुपयांच्या बजेटमध्ये काय पाहता येईल?',
    language: 'mr-IN',
  };
  const { status, data } = await apiPost('/api/ai/chat', body);
  assert.equal(status, 200);
  assert.ok(data.reply);
  assert.equal(data.language, 'mr-IN');
});

test('14. POST /api/ai/chat responds in Hindi (hi-IN)', async () => {
  const body = {
    message: 'पुणे में शनिवार वाडा और अच्छा खाना कहाँ मिलेगा?',
    language: 'hi-IN',
  };
  const { status, data } = await apiPost('/api/ai/chat', body);
  assert.equal(status, 200);
  assert.ok(data.reply);
  assert.equal(data.language, 'hi-IN');
});

// Teardown server after tests
test('Teardown test server', () => {
  server.close();
});
