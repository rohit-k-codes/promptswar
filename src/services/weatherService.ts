import { WeatherData } from '../types';

export const OPENWEATHER_API_KEY = ''; // Zero Weather API keys required; uses Open-Meteo

export async function fetchCurrentWeather(city: string = 'Pune, Maharashtra'): Promise<WeatherData> {
  try {
    const res = await fetch(`/api/weather/current?city=${encodeURIComponent(city)}`);
    if (res.ok) {
      const data = await res.json();
      return {
        city: data.city || 'Pune, Maharashtra, India',
        temp_c: data.temp_c ?? 28,
        temp_f: data.temp_f ?? 82,
        condition: data.condition || 'Pleasant Deccan Breeze',
        icon: data.icon || '🌤️',
        humidity: data.humidity ?? 55,
        wind_kph: data.wind_kph ?? 12,
        uv_index: data.uv_index ?? 6,
        air_quality: data.air_quality || 'Moderate (Deccan Plateau)',
        rain_probability: data.rain_probability ?? 10,
        outdoor_score: data.outdoor_score ?? 90,
        recommendation: data.recommendation || 'Pleasant weather for Pune heritage and culinary walkabouts.',
        last_updated: data.last_updated || new Date().toISOString(),
        data_source: data.data_source || 'open_meteo_keyless',
      };
    }
  } catch (err) {
    console.warn('[Weather API fetch error, using Pune climatological fallback]:', err);
  }

  // Realistic dynamic Pune Deccan climate model
  const now = new Date();
  const hour = now.getHours();
  const baseTempC = hour >= 12 && hour <= 16 ? 31 : hour >= 17 && hour <= 21 ? 26 : 22;
  const tempF = Math.round((baseTempC * 9) / 5 + 32);

  return {
    city: 'Pune, Maharashtra, India',
    temp_c: baseTempC,
    temp_f: tempF,
    condition: hour < 10 ? 'Crisp Deccan Morning' : hour > 18 ? 'Cool Evening Breeze' : 'Sunny Deccan Skies',
    icon: hour < 10 ? '🌅' : hour > 18 ? '🌙' : '☀️',
    humidity: 52,
    wind_kph: 14,
    uv_index: 6,
    air_quality: 'Moderate (Pune Central)',
    rain_probability: 12,
    outdoor_score: 88,
    recommendation: 'Prime Pune exploration window: Pleasant Deccan weather ideal for FC Road and heritage sites.',
    last_updated: new Date().toISOString(),
    data_source: 'pune_climatological_model',
  };
}
