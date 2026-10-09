import { RouteEstimate } from '../types';

export interface RouteRequest {
  origin: { lat: number; lng: number; name?: string };
  destination: { lat: number; lng: number; name?: string };
  mode: 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT';
}

// Calculate Haversine distance in kilometers
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function estimateRoute(req: RouteRequest): Promise<RouteEstimate> {
  const distanceKm = getDistanceKm(
    req.origin.lat,
    req.origin.lng,
    req.destination.lat,
    req.destination.lng
  );

  // Speeds in km/h based on urban conditions:
  // Walk: ~4.5 km/h, Bicycle: ~14 km/h, Transit: ~18 km/h, Drive: ~24 km/h (with traffic)
  let speedKmH = 4.5;
  let trafficCondition: 'light' | 'moderate' | 'heavy' = 'light';
  let steps: string[] = [];
  let summary = '';

  const originName = req.origin.name || 'Current Location';
  const destName = req.destination.name || 'Destination';

  if (req.mode === 'WALK') {
    speedKmH = 4.5;
    const minutes = Math.max(2, Math.round((distanceKm / speedKmH) * 60));
    trafficCondition = 'light';
    summary = `Scenic pedestrian route via street-level sidewalks (${distanceKm} km)`;
    steps = [
      `Depart ${originName} heading toward main cross street`,
      `Follow designated pedestrian promenade and marked crosswalks`,
      `Enjoy historic streetscapes and neighborhood storefronts`,
      `Arrive safely at ${destName}`
    ];
    return {
      mode: 'WALK',
      origin: req.origin,
      destination: req.destination,
      distance_km: distanceKm,
      duration_minutes: minutes,
      traffic_condition: trafficCondition,
      summary,
      steps,
      data_source: 'demo_fallback',
    };
  }

  if (req.mode === 'BICYCLE') {
    speedKmH = 15;
    const minutes = Math.max(3, Math.round((distanceKm / speedKmH) * 60));
    trafficCondition = 'light';
    summary = `Protected cycle track & designated greenways (${distanceKm} km)`;
    steps = [
      `Connect to the nearest protected bi-directional bike lane`,
      `Proceed with green-painted bike intersections and bicycle signals`,
      `Arrive at ${destName} bicycle parking corral`
    ];
    return {
      mode: 'BICYCLE',
      origin: req.origin,
      destination: req.destination,
      distance_km: distanceKm,
      duration_minutes: minutes,
      traffic_condition: trafficCondition,
      summary,
      steps,
      data_source: 'demo_fallback',
    };
  }

  if (req.mode === 'TRANSIT') {
    speedKmH = 18;
    const minutes = Math.max(8, Math.round((distanceKm / speedKmH) * 60) + 5); // +5 min wait
    trafficCondition = 'moderate';
    summary = `Direct municipal light rail / rapid bus line (${distanceKm} km)`;
    steps = [
      `Walk 2 mins to nearest transit station`,
      `Board Muni Metro Line / Rapid Line (tap Clipper or mobile pass)`,
      `Ride 4-6 stops along the rapid transit corridor`,
      `Exit platform with elevator and escalator access to ${destName}`
    ];
    return {
      mode: 'TRANSIT',
      origin: req.origin,
      destination: req.destination,
      distance_km: distanceKm,
      duration_minutes: minutes,
      traffic_condition: trafficCondition,
      summary,
      steps,
      data_source: 'demo_fallback',
    };
  }

  // DRIVE
  speedKmH = 22;
  const baseMinutes = Math.max(4, Math.round((distanceKm / speedKmH) * 60));
  // Peak hour traffic adjustment
  const currentHour = new Date().getHours();
  const isRushHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 16 && currentHour <= 19);
  const trafficFactor = isRushHour ? 1.4 : 1.15;
  const trafficMinutes = Math.round(baseMinutes * trafficFactor);
  trafficCondition = isRushHour ? 'heavy' : 'moderate';

  summary = `Urban arterial drive with live traffic signal estimates (${distanceKm} km)`;
  steps = [
    `Head toward main thoroughfare from ${originName}`,
    `Continue on primary avenue following coordinated traffic lights`,
    isRushHour ? `Moderate congestion expected near central intersections` : `Traffic moving steadily`,
    `Turn toward destination approach with nearby parking structure at ${destName}`
  ];

  return {
    mode: 'DRIVE',
    origin: req.origin,
    destination: req.destination,
    distance_km: distanceKm,
    duration_minutes: baseMinutes,
    duration_in_traffic_minutes: trafficMinutes,
    traffic_condition: trafficCondition,
    summary,
    steps,
    data_source: 'demo_fallback',
  };
}
