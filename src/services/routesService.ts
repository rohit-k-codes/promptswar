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
  // Try backend route calculation first
  try {
    const res = await fetch('/api/routes/compute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.distance_km != null) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[Route API calculation error, using local Pune transit model]:', err);
  }

  // Realistic Pune urban transit fallback
  const distanceKm = getDistanceKm(
    req.origin.lat,
    req.origin.lng,
    req.destination.lat,
    req.destination.lng
  );
  const roadDistanceKm = Math.round(distanceKm * 1.35 * 10) / 10;

  const originName = req.origin.name || 'Current Location';
  const destName = req.destination.name || 'Destination';

  if (req.mode === 'WALK') {
    const speedKmH = 4.2;
    const minutes = Math.max(3, Math.round((roadDistanceKm / speedKmH) * 60));
    return {
      mode: 'WALK',
      origin: req.origin,
      destination: req.destination,
      distance_km: roadDistanceKm,
      duration_minutes: minutes,
      traffic_condition: 'light',
      summary: `Pedestrian route via Pune sidewalks and zebra crossings (${roadDistanceKm} km)`,
      steps: [
        `Depart ${originName} via shaded pedestrian path`,
        `Cross signalized intersections with care (FC Road / JM Road corridor)`,
        `Arrive safely at ${destName}`
      ],
      data_source: 'pune_urban_transit_model',
    };
  }

  if (req.mode === 'BICYCLE') {
    const speedKmH = 12;
    const minutes = Math.max(4, Math.round((roadDistanceKm / speedKmH) * 60));
    return {
      mode: 'BICYCLE',
      origin: req.origin,
      destination: req.destination,
      distance_km: roadDistanceKm,
      duration_minutes: minutes,
      traffic_condition: 'moderate',
      summary: `Cycling route through secondary university / camp lanes (${roadDistanceKm} km)`,
      steps: [
        `Depart ${originName} heading toward quieter arterial bypasses`,
        `Caution at busy roundabouts like Alka Talkies and Goodluck Chowk`,
        `Arrive at ${destName}`
      ],
      data_source: 'pune_urban_transit_model',
    };
  }

  if (req.mode === 'TRANSIT') {
    const speedKmH = 18;
    const minutes = Math.max(6, Math.round((roadDistanceKm / speedKmH) * 60) + 4);
    return {
      mode: 'TRANSIT',
      origin: req.origin,
      destination: req.destination,
      distance_km: roadDistanceKm,
      duration_minutes: minutes,
      traffic_condition: 'moderate',
      summary: `Pune Metro or PMPML electric bus connection (${roadDistanceKm} km)`,
      steps: [
        `Walk to nearest PMPML bus stop or Pune Metro Aqua/Purple line station`,
        `Board transit toward central interchange (Shivajinagar / Deccan)`,
        `Alight and take short stroll to ${destName}`
      ],
      data_source: 'pune_urban_transit_model',
    };
  }

  // DRIVE
  const speedKmH = 22;
  const currentHour = new Date().getHours();
  const isRushHour = (currentHour >= 9 && currentHour <= 11) || (currentHour >= 18 && currentHour <= 21);
  const baseMinutes = Math.max(4, Math.round((roadDistanceKm / speedKmH) * 60));
  const trafficMinutes = isRushHour ? Math.round(baseMinutes * 1.4) : baseMinutes;

  return {
    mode: 'DRIVE',
    origin: req.origin,
    destination: req.destination,
    distance_km: roadDistanceKm,
    duration_minutes: baseMinutes,
    duration_in_traffic_minutes: trafficMinutes,
    traffic_condition: isRushHour ? 'heavy' : 'moderate',
    summary: `Drive via primary Pune avenues with signal navigation (${roadDistanceKm} km)`,
    steps: [
      `Head onto primary roadway from ${originName}`,
      `Navigate across Mutha river bridges or ring flyovers`,
      isRushHour ? 'Congestion observed near major chowks' : 'Traffic moving smoothly',
      `Arrive at ${destName}`
    ],
    data_source: 'pune_urban_transit_model',
  };
}
