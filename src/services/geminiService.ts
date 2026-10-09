import { BudgetTier, Itinerary, ItineraryStep, WeatherData } from '../types';
import { CreateReportInput } from './citizenReportService';
import { CURATED_PLACES } from './placesService';

export interface PlanTripParams {
  destination: string;
  durationHours: number;
  budgetInr?: number;
  budgetTier: BudgetTier;
  interests: string[];
  foodPreferences?: string[];
  travelStyle?: string;
  accessibilityOptions: string[];
  weather: WeatherData;
}

export interface AssistantChatParams {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; text: string }>;
  language?: 'en-IN' | 'hi-IN' | 'mr-IN';
  currentTab?: string;
}

export interface AssistantChatResponse {
  reply: string;
  suggestedPrompts: string[];
  action: {
    type: 'none' | 'navigate' | 'filter_category' | 'search_places' | 'open_planner' | 'draft_report' | 'compare_places';
    targetTab?: string;
    payload?: any;
  };
  sources: Array<{ name: string; url: string }>;
  language: string;
  ai_model_used?: string;
}

/**
 * Generate AI Adventure Plan via secure backend Gemini proxy
 */
export async function generateAITripPlan(params: PlanTripParams): Promise<Itinerary> {
  const budgetInr = params.budgetInr || (params.budgetTier === 'budget' ? 500 : params.budgetTier === 'luxury' ? 4500 : 1500);

  try {
    const res = await fetch('/api/ai/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: params.destination || 'Pune, Maharashtra',
        durationHours: params.durationHours,
        budgetInr,
        budgetTier: params.budgetTier,
        interests: params.interests,
        foodPreferences: params.foodPreferences,
        travelStyle: params.travelStyle,
        accessibilityOptions: params.accessibilityOptions,
        weather: params.weather,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.schedule)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[Backend AI Itinerary Proxy failed, generating locally]:', err);
  }

  // Local synthesis fallback
  return generateLocalPuneItinerary(params, budgetInr);
}

/**
 * Local Pune Itinerary Generator (Offline Fallback)
 */
function generateLocalPuneItinerary(params: PlanTripParams, budgetInr: number): Itinerary {
  const hours = params.durationHours || 4;
  const isBudget = params.budgetTier === 'budget';
  const hasStepFree = params.accessibilityOptions.includes('step_free');

  const steps: ItineraryStep[] = [];

  // Stop 1
  steps.push({
    step: 1,
    time: '08:30 AM',
    title: 'Goodluck Cafe — Legendary Bun Maska & Special Irani Chai',
    location: 'Goodluck Chowk, FC Road, Deccan Gymkhana, Pune',
    category: 'Heritage Breakfast',
    duration: '1 hr',
    cost_estimate: isBudget ? '₹90' : '₹160',
    notes: hasStepFree 
      ? 'Ground level seating available. Dip buttered bun maska into hot Irani chai.'
      : 'Legendary 1935 cafe. Sit near the window to watch morning FC Road bustle.',
    safety_tip: 'Busy morning traffic at Goodluck Chowk; use marked zebra crossings.'
  });

  // Stop 2
  if (hours >= 3) {
    steps.push({
      step: 2,
      time: '10:00 AM',
      title: 'Shaniwar Wada — Historic Peshwa Citadel & Delhi Darwaza',
      location: 'Bajirao Rd, Shaniwar Peth, Pune',
      category: 'Living Maratha Heritage',
      duration: '1.5 hrs',
      cost_estimate: '₹25 Entry',
      notes: 'Epic 1732 palace fortress with fortified spiked gates and gardens.',
      safety_tip: 'Historic stone courtyards have uneven steps; tread carefully.'
    });
  }

  // Stop 3
  if (hours >= 5) {
    steps.push({
      step: 3,
      time: '12:30 PM',
      title: 'Vaishali Restaurant — Iconic SPDP & Filter Coffee',
      location: 'FC Road, Deccan Gymkhana, Pune',
      category: 'Puneri Street Food & Lunch',
      duration: '1.25 hrs',
      cost_estimate: isBudget ? '₹180' : '₹320',
      notes: 'Crisp Mysore Masala Dosa and unmatched Sev Potato Dahi Puri (SPDP).',
      safety_tip: 'High afternoon student crowd on FC Road; keep belongings close.'
    });
  }

  // Stop 4
  if (hours >= 7) {
    steps.push({
      step: 4,
      time: '02:30 PM',
      title: 'Aga Khan Palace & Gandhi Memorial',
      location: 'Pune-Ahmednagar Rd, Kalyani Nagar, Pune',
      category: 'Memorial & Serene Grounds',
      duration: '1.75 hrs',
      cost_estimate: '₹25 Entry',
      notes: 'Italian arches and peaceful garden museum honoring freedom struggle leaders.',
      safety_tip: 'Paved walkways with step-free accessibility across main museum corridors.'
    });
  }

  return {
    id: `itin-${Date.now()}`,
    title: `Pune Explorer: ${params.interests.join(' & ') || 'Heritage & Food Trail'}`,
    destination: 'Pune, Maharashtra',
    budget_tier: params.budgetTier,
    duration_hours: hours,
    interests: params.interests,
    food_preferences: params.foodPreferences || [],
    travel_style: params.travelStyle || 'Balanced Explorer',
    accessibility_options: params.accessibilityOptions || [],
    weather_context: {
      summary: `${params.weather.temp_c}°C, ${params.weather.condition}`,
      temp_c: params.weather.temp_c,
      condition: params.weather.condition,
      recommendation: params.weather.recommendation,
    },
    weather_considerations: 'Structured around pleasant morning and afternoon exploration intervals.',
    schedule: steps,
    estimated_cost: isBudget ? 300 : 850,
    currency: 'INR',
    data_source: 'pune_verified_local_database',
    created_at: new Date().toISOString(),
  };
}

/**
 * Analyze citizen report via backend Gemini proxy
 */
export async function analyzeCitizenReportAI(input: CreateReportInput): Promise<{
  suggestedSeverity: 'low' | 'medium' | 'high' | 'critical';
  confidenceBoost: number;
  safetySummary: string;
  isPotentialDuplicate?: boolean;
  verificationNotice: string;
}> {
  try {
    const res = await fetch('/api/ai/analyze-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('[Backend Report AI Analysis failed, using local rule engine]:', err);
  }

  // Fallback rule engine
  const text = `${input.title} ${input.description}`.toLowerCase();
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (text.includes('urgent') || text.includes('waterlogging') || text.includes('flood') || text.includes('wire')) {
    severity = 'high';
  } else if (text.includes('pothole') || text.includes('light') || text.includes('traffic')) {
    severity = 'medium';
  }

  return {
    suggestedSeverity: severity,
    confidenceBoost: 10,
    safetySummary: 'Community observation for Pune neighbor awareness.',
    verificationNotice: 'Local observation only. Stored locally in your browser and not verified by municipal authorities.',
  };
}

/**
 * Multilingual AI Chat Assistant (English, Hindi, Marathi)
 */
export async function sendAssistantChatMessage(params: AssistantChatParams): Promise<AssistantChatResponse> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: params.message,
        history: params.history || [],
        language: params.language || 'en-IN',
        currentTab: params.currentTab || 'home',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('[Assistant Chat API Error, using client fallback]:', err);
  }

  const isMarathi = params.language === 'mr-IN';
  const isHindi = params.language === 'hi-IN';

  return {
    reply: isMarathi 
      ? 'नमस्कार! मी एक्सप्लोर सिटी असिस्टंट आहे. शनिवार वाडा, एफसी रोडची खाद्यसंस्कृती किंवा पुण्यातील अनुभवांसाठी मी तुम्हाला मदत करू शकेन.'
      : isHindi
      ? 'नमस्ते! मैं एक्सप्लोर सिटी पुणे असिस्टेंट हूँ। शनिवार वाडा, एफसी रोड, मिसळ किंवा बजट ट्रिप के बारे में पूछिए!'
      : 'Namaskar! I am your Explore City Pune Assistant. Ask me about heritage trails, iconic misal spots, or budget adventures under ₹500!',
    suggestedPrompts: isMarathi
      ? ['पुण्यातील खाद्यपदार्थ सुचवा', '₹५०० मध्ये १ दिवसाचा प्लॅन', 'शनिवार वाडा माहिती']
      : isHindi
      ? ['₹500 में हेरिटेज ट्रिप', 'पुणे में क्या खाएं?', 'शनिवार वाडा का इतिहास']
      : ['Plan a heritage & food tour under ₹500', 'Best places on FC Road', 'Tell me about Aga Khan Palace'],
    action: { type: 'none' },
    sources: [{ name: 'Explore City Pune Knowledge Base', url: 'https://www.google.com/maps/place/Pune,+Maharashtra' }],
    language: params.language || 'en-IN',
  };
}
