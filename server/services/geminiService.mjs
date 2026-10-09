import { GoogleGenAI } from '@google/genai';
import { PUNE_CURATED_PLACES } from '../puneData.mjs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export const isGeminiConfigured = Boolean(
  GEMINI_API_KEY &&
  GEMINI_API_KEY !== 'your-gemini-api-key' &&
  !GEMINI_API_KEY.includes('your-')
);

function getGeminiClient() {
  if (!isGeminiConfigured) return null;
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

export async function generateItineraryAI({
  destination = 'Pune, Maharashtra',
  durationHours = 4,
  budgetInr = 1500,
  budgetTier = 'moderate',
  interests = ['heritage', 'food'],
  foodPreferences = ['Local Puneri Specialties', 'Street Food'],
  travelStyle = 'Balanced Explorer',
  accessibilityOptions = [],
  weather = {},
  availablePlaces = [],
  routeEstimates = [],
}) {
  // Use supplied places or default to Pune curated places so Gemini does not invent places
  const candidatePlaces = (availablePlaces && availablePlaces.length > 0)
    ? availablePlaces
    : PUNE_CURATED_PLACES;

  const candidatePlacesSummary = candidatePlaces.slice(0, 10).map(p => ({
    place_id: p.place_id || p.id,
    name: p.name,
    category: p.category,
    address: p.address,
    rating: p.rating,
    price_level: p.price_level,
    notes: p.notes,
    lat: p.lat,
    lng: p.lng,
  }));

  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `
You are the AI Adventure Intelligence Engine for Explore City — Pune Edition.
Tagline: "Less Survival Mode. More Adventure."
City: Pune, Maharashtra, India.

CRITICAL INSTRUCTION: You MUST construct the itinerary ONLY using the following real, supplied Pune places. Do NOT invent or hallucinate any fictional establishments.

Real candidate places in Pune:
${JSON.stringify(candidatePlacesSummary, null, 2)}

User Parameters:
- Destination: ${destination}
- Available Duration: ${durationHours} hours
- Target Budget: ₹${budgetInr} INR (${budgetTier} tier)
- Interests: ${interests.join(', ') || 'Culture, Food, Heritage'}
- Food Preferences: ${foodPreferences.join(', ') || 'Local Maharashtrian & Pune Staples'}
- Travel Style: ${travelStyle}
- Accessibility Needs: ${accessibilityOptions.join(', ') || 'Standard pedestrian access'}
- Live Weather: ${weather.temp_c || 28}°C, ${weather.condition || 'Pleasant'}, Rain Prob: ${weather.rain_probability || 15}%, Advice: ${weather.recommendation || 'Ideal exploration weather'}

Respond ONLY with valid, raw JSON (no markdown formatting, no code backticks) matching this exact schema:
{
  "title": "Creative evocative adventure title for Pune",
  "estimated_cost_inr": 1200,
  "weather_considerations": "Specific note on how current weather impacts this itinerary",
  "data_notice": "Live AI generation backed by Google Places data",
  "schedule": [
    {
      "step": 1,
      "time": "09:30 AM",
      "place_id": "Exact place_id from supplied places",
      "title": "Stop title",
      "location": "Exact address & landmark",
      "category": "Culinary / Heritage / Vista / etc",
      "duration": "1.5 hrs",
      "cost_estimate_inr": "₹150",
      "reason_for_recommendation": "Why this stop matches user interests and food preferences",
      "notes": "Authentic local Pune tip",
      "safety_tip": "Specific transparent safety and navigation advice (e.g. traffic chowk crossing, hydration, footwear)",
      "lat": 18.5204,
      "lng": 73.8567
    }
  ]
}
`;

      const response = await client.interactions.create({
        model: GEMINI_MODEL,
        input: prompt,
      });

      const raw = response.output_text || '';
      const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        id: `itin-ai-${Date.now()}`,
        title: parsed.title || `Pune Discovery: ${interests.join(' & ')}`,
        destination: 'Pune, Maharashtra',
        budget_tier: budgetTier,
        budget_inr: budgetInr,
        duration_hours: Number(durationHours),
        interests,
        food_preferences: foodPreferences,
        travel_style: travelStyle,
        accessibility_options: accessibilityOptions,
        weather_context: {
          summary: `${weather.temp_c || 28}°C, ${weather.condition || 'Pleasant'}`,
          temp_c: weather.temp_c || 28,
          condition: weather.condition || 'Pleasant',
          recommendation: weather.recommendation || parsed.weather_considerations || 'Pleasant exploration window',
        },
        weather_considerations: parsed.weather_considerations,
        schedule: parsed.schedule || [],
        estimated_cost: parsed.estimated_cost_inr || budgetInr,
        currency: 'INR',
        data_source: 'official_feed',
        ai_model_used: GEMINI_MODEL,
        created_at: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('[Gemini Live Error, falling back to Pune local synthesizer]', err.message);
    }
  }

  // Pune Local Synthesis Engine (deterministic, authentic Pune routing based on user parameters)
  return synthesizePuneTripPlan({
    destination,
    durationHours: Number(durationHours),
    budgetInr,
    budgetTier,
    interests,
    foodPreferences,
    travelStyle,
    accessibilityOptions,
    weather,
    candidatePlaces,
  });
}

function synthesizePuneTripPlan(params) {
  const steps = [];
  const hours = params.durationHours || 4;
  const isBudget = params.budgetTier === 'budget';
  const isLuxury = params.budgetTier === 'luxury';
  const hasStepFree = params.accessibilityOptions?.includes('step_free');

  // Step 1: Morning starter in Pune
  steps.push({
    step: 1,
    time: '08:30 AM',
    place_id: 'pune-place-003',
    title: 'Goodluck Cafe — Legendary Bun Maska & Special Irani Chai',
    location: 'Fergusson College Rd, Deccan Gymkhana, Pune 411004',
    category: 'Heritage Culinary',
    duration: '1 hr',
    cost_estimate_inr: isBudget ? '₹90' : isLuxury ? '₹350' : '₹160',
    reason_for_recommendation: 'A 90-year-old culinary institution that encapsulates the soul of old Pune college and literary culture.',
    notes: hasStepFree 
      ? 'Street-level entrance with ground-floor booth seating.'
      : 'Dip warm buttery bun maska directly into steaming spiced Irani chai.',
    safety_tip: 'Busy morning pedestrian crossing at Goodluck Chowk; use the zebra markings.',
    lat: 18.5173,
    lng: 73.8418,
  });

  // Step 2: Cultural / Heritage Exploration
  if (hours >= 3) {
    if (params.interests?.includes('heritage') || params.interests?.includes('culture')) {
      steps.push({
        step: 2,
        time: '10:00 AM',
        place_id: 'pune-place-001',
        title: 'Shaniwar Wada — Historic Peshwa Citadel & Delhi Darwaza',
        location: 'Bajirao Rd, Shaniwar Peth, Pune 411030',
        category: 'Living Heritage',
        duration: '1.5 hrs',
        cost_estimate_inr: '₹25 Entry',
        reason_for_recommendation: 'The epic 1732 palace fortress that stood as the capital of the Maratha Empire under the Peshwas.',
        notes: 'Walk through the massive spiked teak Delhi Darwaza gate and inspect the stone fountain foundations.',
        safety_tip: 'Uneven historic stone courtyards; wear supportive flat walking shoes.',
        lat: 18.5196,
        lng: 73.8553,
      });
    } else {
      steps.push({
        step: 2,
        time: '10:00 AM',
        place_id: 'pune-place-005',
        title: 'Pataleshwar Cave Temple — 8th-Century Monolithic Rock Cut Shrine',
        location: 'JM Road, Shivajinagar, Pune 411005',
        category: 'Ancient Architecture',
        duration: '1.25 hrs',
        cost_estimate_inr: 'Free Entry',
        reason_for_recommendation: 'Ancient Rashtrakuta-era monolithic rock shrine providing tranquil subterranean coolness right off bustling JM Road.',
        notes: 'Examine the circular Nandi mandapa carved out of a single basalt formation.',
        safety_tip: 'Smooth stone surfaces inside cave floor; tread mindfully.',
        lat: 18.5278,
        lng: 73.8507,
      });
    }
  }

  // Step 3: Lunch & Iconic Food Corridor
  if (hours >= 5) {
    steps.push({
      step: 3,
      time: '12:30 PM',
      place_id: 'pune-place-004',
      title: 'Vaishali Restaurant — Celebrated SPDP & Filter Coffee',
      location: 'FC Road, Deccan Gymkhana, Pune 411004',
      category: 'Iconic Street Food & Lunch',
      duration: '1.25 hrs',
      cost_estimate_inr: isBudget ? '₹180' : isLuxury ? '₹650' : '₹320',
      reason_for_recommendation: 'Pune’s most famous community dining garden. Crisp Mysore Masala Dosa and unmatched Sev Potato Dahi Puri.',
      notes: 'Garden courtyard seating under the overarching ficus trees offers great ambient vibes.',
      safety_tip: 'High afternoon crowd density on FC Road; keep personal belongings secure.',
      lat: 18.5222,
      lng: 73.8415,
    });
  }

  // Step 4: Afternoon Greenery / Freedom History
  if (hours >= 7) {
    steps.push({
      step: 4,
      time: '02:30 PM',
      place_id: 'pune-place-002',
      title: 'Aga Khan Palace & Gandhi Memorial',
      location: 'Pune-Ahmednagar Rd, Kalyani Nagar, Pune 411006',
      category: 'Memorial & Serene Grounds',
      duration: '1.75 hrs',
      cost_estimate_inr: '₹25 Entry',
      reason_for_recommendation: 'Sprawling Italian arches and tranquil green gardens honoring freedom struggle leaders with museum archives.',
      notes: 'Shaded walkways and wide manicured lawns offer peaceful afternoon relaxation.',
      safety_tip: 'Wide paved pathways with accessible step-free ramps on all primary museum wings.',
      lat: 18.5524,
      lng: 73.9015,
    });
  }

  // Step 5: Evening Zen or Parsi Bakery
  if (hours >= 8) {
    steps.push({
      step: 5,
      time: '05:00 PM',
      place_id: 'pune-place-008',
      title: 'Osho Teerth Park — Bamboo Zen Stream Meander',
      location: 'Lane 6, Koregaon Park, Pune 411001',
      category: 'Nature & Zen Garden',
      duration: '1.5 hrs',
      cost_estimate_inr: 'Free Entry',
      reason_for_recommendation: 'Tranquil Japanese-style stream garden with wooden footbridges, fish ponds, and bamboo canopies in leafy Koregaon Park.',
      notes: 'Quiet meditation corridor with morning and late afternoon visiting windows.',
      safety_tip: 'Stay on marked wooden bridges and stone trails.',
      lat: 18.5376,
      lng: 73.8942,
    });
  }

  const estimatedTotalCost = isBudget ? 350 : isLuxury ? 3500 : 950;

  return {
    id: `itin-synth-${Date.now()}`,
    title: `Pune Explorer: ${params.interests?.join(' & ') || 'Heritage & Street Flavors'}`,
    destination: 'Pune, Maharashtra',
    budget_tier: params.budgetTier || 'moderate',
    budget_inr: params.budgetInr || 1500,
    duration_hours: hours,
    interests: params.interests || [],
    food_preferences: params.foodPreferences || [],
    travel_style: params.travelStyle || 'Balanced Explorer',
    accessibility_options: params.accessibilityOptions || [],
    weather_context: {
      summary: `${params.weather?.temp_c || 28}°C, ${params.weather?.condition || 'Pleasant'}`,
      temp_c: params.weather?.temp_c || 28,
      condition: params.weather?.condition || 'Pleasant',
      recommendation: params.weather?.recommendation || 'Excellent day for Pune heritage and culinary walkabouts.',
    },
    weather_considerations: 'Itinerary takes advantage of cooler morning and late afternoon hours for heritage sites and open-air walking.',
    schedule: steps,
    estimated_cost: estimatedTotalCost,
    currency: 'INR',
    data_source: 'demo_fallback',
    notice: isGeminiConfigured 
      ? undefined 
      : 'Generated by Pune local synthesis intelligence. Configure GEMINI_API_KEY for live Gemini 3.8 Flash generation.',
    created_at: new Date().toISOString(),
  };
}

export async function analyzeCitizenReportAI({ title, description, category, lat, lng, address }) {
  if (!title || !description) {
    throw new Error('Title and description are required for report analysis.');
  }

  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `
You are the AI Citizen Observation Assistant for Explore City — Pune Edition.
Analyze this localized municipal observation in Pune:
Title: ${title}
Description: ${description}
Category: ${category}
Location: ${address || `${lat}, ${lng}`}

Instructions:
1. Categorize severity: 'low', 'medium', 'high', or 'critical' (e.g. active deep waterlogging on flyovers or live wire is high/critical; broken streetlight or litter is medium/low).
2. Compute a confidence boost (integer from 5 to 20).
3. Provide a crisp one-sentence summary for local travelers explaining the physical street impact.
4. Note that reports are strictly unverified local observations and are not official emergency dispatches.

Respond ONLY with valid, raw JSON (no markdown formatting, no code backticks):
{
  "suggestedSeverity": "low" | "medium" | "high" | "critical",
  "confidenceBoost": 10,
  "safetySummary": "One crisp factual sentence",
  "isPotentialDuplicate": false,
  "verificationNotice": "Local observation only. Not verified by municipal authorities."
}
`;

      const response = await client.interactions.create({
        model: GEMINI_MODEL,
        input: prompt,
      });

      const raw = response.output_text || '';
      const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        suggestedSeverity: parsed.suggestedSeverity || 'low',
        confidenceBoost: Number(parsed.confidenceBoost) || 10,
        safetySummary: parsed.safetySummary || 'Observation describes physical neighborhood conditions for situational awareness.',
        isPotentialDuplicate: Boolean(parsed.isPotentialDuplicate),
        verificationNotice: 'Local observation only. Not shared with authorities or verified by municipal services.',
        ai_model_used: GEMINI_MODEL,
      };
    } catch (err) {
      console.warn('[Gemini Report Analysis Error, falling back to local heuristic]', err.message);
    }
  }

  // Local rule-based heuristic for Pune citizen reports
  const combinedText = `${title} ${description}`.toLowerCase();
  let severity = 'low';
  if (
    combinedText.includes('urgent') ||
    combinedText.includes('waterlogging') ||
    combinedText.includes('flood') ||
    combinedText.includes('deep pothole') ||
    combinedText.includes('accident hazard') ||
    combinedText.includes('live wire')
  ) {
    severity = 'high';
  } else if (
    combinedText.includes('streetlight') ||
    combinedText.includes('traffic jam') ||
    combinedText.includes('gravel') ||
    combinedText.includes('diversion') ||
    combinedText.includes('dark')
  ) {
    severity = 'medium';
  }

  return {
    suggestedSeverity: severity,
    confidenceBoost: 10,
    safetySummary: 'Observation provides localized situational awareness for Pune commuters and pedestrians.',
    isPotentialDuplicate: false,
    verificationNotice: 'Local observation only. Stored locally in your browser and not verified by municipal authorities.',
  };
}

/**
 * Multilingual AI Chat Assistant for Explore City — Pune Edition
 * Supports English (en-IN), Hindi (hi-IN), Marathi (mr-IN)
 */
export async function chatAssistantAI({
  message,
  history = [],
  language = 'en-IN',
  currentTab = 'home',
}) {
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required for chat assistant.');
  }

  const client = getGeminiClient();

  const langInstruction =
    language === 'mr-IN'
      ? 'उत्तर अस्खलित मराठीत द्या (मराठी लिपी वापरा). स्थानिक पुणेरी शब्द आणि संस्कृतीचे संदर्भ योग्य ठेवा (उदा. मिसळ, शनिवार वाडा, चितळे, कट्टा).'
      : language === 'hi-IN'
      ? 'उत्तर स्वाभाविक हिंदी में दें (देवनागरी लिपि में)। पुणे की संस्कृति, ऐतिहासिक स्थलों और खान-पान के सही संदर्भ बनाए रखें।'
      : 'Respond in clear, engaging Indian English. Maintain authentic local Pune cultural nuances (e.g. Puneri misal, Peshwa heritage, FC Road college life).';

  if (client) {
    try {
      const placesMini = PUNE_CURATED_PLACES.slice(0, 10).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        address: p.address,
        rating: p.rating,
        price_level: p.price_level,
        lat: p.lat,
        lng: p.lng,
      }));

      const systemPrompt = `
You are the "Explore City Assistant" for Explore City — Pune Edition.
Tagline: "Less Survival Mode. More Adventure."
City: Pune, Maharashtra, India.

Your mission is to help people stop merely surviving city life and start enjoying it through local Pune discoveries, culture, food, personalized adventures, and practical urban insights.

CRITICAL INSTRUCTIONS:
1. Language requirement: ${langInstruction}
2. Preserve local place names accurately (e.g., Shaniwar Wada, FC Road, Goodluck Cafe, Pataleshwar, Koregaon Park).
3. Be friendly, knowledgeable, and culturally authentic.
4. Ground your recommendations ONLY in real Pune places. Available verified places:
${JSON.stringify(placesMini, null, 2)}
5. If the user asks for actions (like navigating, filtering, planning an itinerary, or submitting a report), return an application action object.
6. Never fabricate official crime statistics, municipal enforcement actions, or live traffic conditions.

Respond ONLY with valid raw JSON (no markdown fences, no code blocks):
{
  "reply": "Your conversational answer in the requested language",
  "suggestedPrompts": ["Next question 1", "Next question 2", "Next question 3"],
  "action": {
    "type": "none" | "navigate" | "filter_category" | "search_places" | "open_planner" | "draft_report" | "compare_places",
    "targetTab": "home" | "map" | "places" | "planner" | "reports" | "compare" | "insights",
    "payload": {
      "category": "heritage" | "food" | "cafe" | "park" | "attraction",
      "searchQuery": "text",
      "budgetInr": 500,
      "reportDraft": { "title": "...", "description": "...", "category": "..." }
    }
  },
  "sources": [
    { "name": "Verified Pune Database / Curated Feed", "url": "https://www.google.com/maps/place/Pune,+Maharashtra" }
  ]
}
`;

      const promptWithHistory = `
System Prompt:
${systemPrompt}

Current Conversation Context:
${history.slice(-4).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')}

User message: ${message}
`;

      const response = await client.interactions.create({
        model: GEMINI_MODEL,
        input: promptWithHistory,
      });

      const raw = response.output_text || '';
      const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        reply: parsed.reply || 'Namaskar! How can I assist your Pune adventure today?',
        suggestedPrompts: Array.isArray(parsed.suggestedPrompts) ? parsed.suggestedPrompts : [],
        action: parsed.action || { type: 'none' },
        sources: Array.isArray(parsed.sources) ? parsed.sources : [],
        language,
        ai_model_used: GEMINI_MODEL,
      };
    } catch (err) {
      console.warn('[Gemini Chat Assistant Error, falling back to local multilingual synthesizer]', err.message);
    }
  }

  // Local Multilingual Fallback Synthesizer for Pune
  return synthesizePuneLocalChat(message, language);
}

function synthesizePuneLocalChat(message, language = 'en-IN') {
  const lower = message.toLowerCase();

  // Action detection
  let action = { type: 'none' };
  let reply = '';
  let suggestedPrompts = [];

  const isMarathi = language === 'mr-IN';
  const isHindi = language === 'hi-IN';

  if (lower.includes('misal') || lower.includes('food') || lower.includes('खाद्य') || lower.includes('खाना') || lower.includes('street food')) {
    action = {
      type: 'filter_category',
      targetTab: 'places',
      payload: { category: 'food', searchQuery: 'misal' },
    };
    if (isMarathi) {
      reply = 'पुण्यातील खाद्यसंस्कृती अप्रतिम आहे! नारायण पेठेतील बेडेकर मिसळ, एफसी रोडवरील वैशाली आणि डेक्कनचे गुडलक कॅफे (बन मस्का व इराणी चहा) नक्की अनुभवा. मी तुम्हाला ठिकाणांची यादी दाखवतो.';
      suggestedPrompts = ['पुण्यात ५०० रुपयात काय खावे?', 'शनिवार वाडा इतिहास सांगा', '१ दिवसाचा प्लॅन द्या'];
    } else if (isHindi) {
      reply = 'पुणे का खाना बहुत ही लाजवाब है! डेक्कन का ऐतिहासिक गुडलक कैफ़े (बन मस्का और ईरानी चाय), एफसी रोड का वैशाली रेस्टोरेंट और बेडेकर मिसळ बेहद मशहूर हैं। मैं आपके लिए फूड स्पॉट्स फ़िल्टर कर रहा हूँ।';
      suggestedPrompts = ['₹500 में पुणे हेरिटेज ट्रिप', 'शनिवार वाडा के बारे में बताओ', 'शाम को कहाँ घूमें?'];
    } else {
      reply = "Pune's culinary trail is legendary! Start your morning at Goodluck Cafe for warm bun maska & Irani chai, relish Katakirrr or Bedekar Misal, and enjoy evening filter coffee at Vaishali on FC Road. Filtering authentic food spots for you now!";
      suggestedPrompts = ['Plan a heritage & food tour under ₹500', 'Tell me about Shaniwar Wada', 'Best evening sunset spots'];
    }
  } else if (lower.includes('heritage') || lower.includes('history') || lower.includes('ऐतिहासिक') || lower.includes('इतिहास') || lower.includes('wada') || lower.includes('वाडा')) {
    action = {
      type: 'filter_category',
      targetTab: 'places',
      payload: { category: 'heritage', searchQuery: 'heritage' },
    };
    if (isMarathi) {
      reply = 'पुण्याला पेशवेकालीन आणि स्वातंत्र्यलढ्याचा मोठा वारसा आहे. १७३२ चा शनिवार वाडा (दिल्ली दरवाजा), कल्याणी नगरचा आगा खान पॅलेस आणि जंगली महाराज रोडवरील ८ व्या शतकातील पाताळेश्वर लेणी ही आवर्जून पाहण्यासारखी ठिकाणे आहेत.';
      suggestedPrompts = ['शनिवार वाड्याचे तिकीट किती आहे?', 'पुण्यात शांत बाग कोणती?', 'राजा दिनकर केळकर म्युझियम'];
    } else if (isHindi) {
      reply = 'पुणे का इतिहास मराठा साम्राज्य और पेशवाओं से जुड़ा हुआ है। 1732 में निर्मित शनिवार वाडा, कल्याणी नगर का आगा खान पैलेस और जेएम रोड का 8वीं सदी का पातालेश्वर गुफा मंदिर पुणे के प्रमुख ऐतिहासिक धरोहर हैं।';
      suggestedPrompts = ['शनिवार वाडा का इतिहास बताओ', 'पुणे में बजट ट्रिप कैसे प्लान करें?', 'कोरेगाव पार्क के बारे में बताओ'];
    } else {
      reply = 'Pune boasts deep Peshwa and freedom movement heritage. Shaniwar Wada (built in 1732 with its fortified Delhi Darwaza), Aga Khan Palace (Gandhi Memorial & Italian arches), and the 8th-century monolithic Pataleshwar Cave Temple are must-visits.';
      suggestedPrompts = ['Plan an itinerary under ₹500', 'Compare Shaniwar Wada vs Aga Khan Palace', 'Where can I walk peacefully?'];
    }
  } else if (lower.includes('plan') || lower.includes('itinerary') || lower.includes('प्लॅन') || lower.includes('बजेट') || lower.includes('budget') || lower.includes('500') || lower.includes('५००')) {
    action = {
      type: 'open_planner',
      targetTab: 'planner',
      payload: { budgetInr: 500 },
    };
    if (isMarathi) {
      reply = 'नक्कीच! ₹५०० च्या बजेटमध्ये तुम्ही गुडलक कॅफे (नाश्ता ~₹९०), शनिवार वाडा (तिकीट ₹२५), पाताळेश्वर लेणी (मोफत) आणि वैशाली कॅफे सहज एक्सप्लोर करू शकता. मी तुम्हाला अ‍ॅडव्हेंचर प्लॅनरवर घेऊन जातो!';
      suggestedPrompts = ['४ तासांचा प्लॅन तयार करा', 'फॅमिलीसाठी काय चांगले आहे?', 'पुण्यातील हवामान कसे आहे?'];
    } else if (isHindi) {
      reply = 'बिल्कुल! ₹500 के बजट में आप गुडलक कैफ़े पर नाश्ता (~₹90), शनिवार वाडा दर्शन (टिकट ₹25), पातालेश्वर गुफा (मुफ़्त) और एफसी रोड का अनुभव ले सकते हैं। आइए एडवेंचर प्लानर में पूरा शेड्यूल बनाते हैं!';
      suggestedPrompts = ['4 घंटे का शेड्यूल बनाओ', 'पुणे में मिसळ कहाँ खाएं?', 'लोकल रिपोर्ट कैसे दर्ज करें?'];
    } else {
      reply = 'Great choice! Under ₹500 INR, you can savor Goodluck Cafe bun maska & tea (~₹90), tour historic Shaniwar Wada (₹25 ticket), explore ancient Pataleshwar Cave (Free), and stroll FC Road. Opening the Adventure Planner now!';
      suggestedPrompts = ['Create a 4-hour morning walk', 'Best spots for step-free access', 'What is the weather today?'];
    }
  } else if (lower.includes('report') || lower.includes('complaint') || lower.includes('पॉथोल') || lower.includes('खड्डा') || lower.includes('समस्या') || lower.includes('problem')) {
    action = {
      type: 'draft_report',
      targetTab: 'reports',
      payload: {
        reportDraft: {
          title: 'Road condition observation',
          description: message,
          category: 'road_hazard',
        },
      },
    };
    if (isMarathi) {
      reply = 'नागरी निरीक्षण नोंदवण्यासाठी मी सिटीझन रिपोर्ट हब उघडत आहे. कृपया लक्षात ठेवा: हे निरीक्षण केवळ तुमच्या ब्राउझरमध्ये सुरक्षित राहते आणि महापालिकेकडे परस्पर जात नाही.';
      suggestedPrompts = ['माझे रिपोर्ट कुठे सेव्ह होतात?', 'पुण्यातील रस्ते कसे आहेत?', 'हवामान अपडेट द्या'];
    } else if (isHindi) {
      reply = 'स्थानीय नागरिक अवलोकन दर्ज करने के लिए मैं सिटिज़न रिपोर्ट हब खोल रहा हूँ। ध्यान दें: यह डेटा केवल आपके ब्राउज़र में सुरक्षित रहता है और किसी सरकारी पोर्टल पर नहीं भेजा जाता।';
      suggestedPrompts = ['मेरी रिपोर्ट्स कहाँ हैं?', 'पुणे का मौसम कैसा है?', 'हेरिटेज वॉक प्लान करो'];
    } else {
      reply = 'Opening the Citizen Reports Hub to log this localized street observation. Note: reports are stored locally in your browser for neighbor situational awareness and are not submitted to PMC municipal authorities.';
      suggestedPrompts = ['Are citizen reports private?', 'Check local weather in Pune', 'Explore Pune places'];
    }
  } else {
    if (isMarathi) {
      reply = 'नमस्कार! मी एक्सप्लोर सिटी पुणे असिस्टंट आहे. शनिवार वाडा, एफसी रोडची खाद्यसंस्कृती, पाताळेश्वर लेणी, बजेट प्लॅनिंग किंवा नागरी निरीक्षणाबद्दल मला काहीही विचारा!';
      suggestedPrompts = ['पुण्यातील खाद्यपदार्थ सुचवा', '₹५०० मध्ये १ दिवसाचा प्लॅन', 'शनिवार वाडा माहिती'];
    } else if (isHindi) {
      reply = 'नमस्ते! मैं एक्सप्लोर सिटी पुणे असिस्टेंट हूँ। शनिवार वाडा, एफसी रोड का खान-पान, बजट यात्रा योजना या स्थानीय नागरिक रिपोर्ट के बारे में आप मुझसे कभी भी पूछ सकते हैं!';
      suggestedPrompts = ['पुणे में क्या खाएं?', '₹500 में हेरिटेज ट्रिप', 'पुणे का इतिहास'];
    } else {
      reply = 'Namaskar! I am your Explore City Pune Assistant. How can I help you stop merely surviving Pune traffic and start discovering its rich Peshwa heritage, iconic food corridors, and green gardens?';
      suggestedPrompts = ['Plan a heritage & food tour under ₹500', 'Best places on FC Road', 'Tell me about Aga Khan Palace'];
    }
  }

  return {
    reply,
    suggestedPrompts,
    action,
    sources: [
      { name: 'Explore City Pune Knowledge Base', url: 'https://www.google.com/maps/place/Pune,+Maharashtra' },
    ],
    language,
    data_source: 'pune_local_synthesizer',
  };
}
