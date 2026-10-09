import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { title, description, category, lat, lng } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          suggestedSeverity: 'medium',
          confidenceBoost: 10,
          safetySummary: 'Community report logged for situational awareness.',
          isPotentialDuplicate: false,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
Analyze this citizen report for urban safety and municipal awareness:
Title: ${title}
Description: ${description}
Category: ${category}
Coordinates: ${lat}, ${lng}

Respond ONLY with valid JSON:
{
  "suggestedSeverity": "low" | "medium" | "high" | "critical",
  "confidenceBoost": 10,
  "safetySummary": "One crisp sentence explaining safety impact for pedestrians and explorers",
  "isPotentialDuplicate": false
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
            temperature: 0.2,
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
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
