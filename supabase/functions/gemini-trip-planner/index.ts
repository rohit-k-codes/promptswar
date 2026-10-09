// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { destination, durationHours, budgetTier, interests, accessibilityOptions, weather } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Supabase secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
You are the adventure intelligence engine for Explore City (Tagline: Less Survival Mode. More Adventure).
Create a personalized, exciting, and accessible city exploration itinerary.

Destination: ${destination || 'San Francisco, CA'}
Duration: ${durationHours || 6} hours
Budget Tier: ${budgetTier || 'moderate'}
Interests: ${(interests || []).join(', ') || 'Culture, Food, Hidden Gems'}
Accessibility Needs: ${(accessibilityOptions || []).join(', ') || 'Standard'}
Weather: ${weather?.temp_c || 19}°C, ${weather?.condition || 'Clear'}

Respond ONLY with valid JSON (no markdown backticks):
{
  "title": "Creative adventure title",
  "estimated_cost": 45,
  "schedule": [
    {
      "step": 1,
      "time": "09:30 AM",
      "title": "Stop title",
      "location": "Place name & address",
      "category": "Culinary / Heritage / Vista / etc",
      "duration": "1 hr",
      "cost_estimate": "$15",
      "notes": "Practical local tip & what makes this special",
      "safety_tip": "Specific transparent safety advice for this time/neighborhood"
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          }
        }),
      }
    );

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = rawText ? rawText.replace(/```json/g, '').replace(/```/g, '').trim() : '{}';
    const parsed = JSON.parse(cleanJson);

    return new Response(
      JSON.stringify({ success: true, itinerary: parsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
