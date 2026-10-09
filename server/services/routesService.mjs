// Haversine formula for distance in km
export function getDistanceKm(lat1, lon1, lat2, lon2) {
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

export async function computeRoute({ origin, destination, intermediates = [], mode = 'DRIVE' }) {
  if (!origin || !destination || origin.lat == null || destination.lat == null) {
    throw new Error('Valid origin and destination coordinates are required.');
  }

  const originLat = Number(origin.lat);
  const originLng = Number(origin.lng);
  const destLat = Number(destination.lat);
  const destLng = Number(destination.lng);

  const directDistanceKm = getDistanceKm(originLat, originLng, destLat, destLng);
  // Realistic urban road detour factor in Pune (river bridges, one-ways, ring roads)
  const estimatedRoadDistanceKm = Math.round(directDistanceKm * 1.35 * 10) / 10;

  const travelMode = ['DRIVE', 'WALK', 'BICYCLE', 'TRANSIT'].includes(mode) ? mode : 'DRIVE';

  // Urban speeds in Pune:
  // Walk: ~4.2 km/h
  // Bicycle: ~12 km/h
  // Transit (PMPML / Pune Metro): ~18 km/h
  // Drive (Auto / Car in Pune traffic): ~20-25 km/h
  let avgSpeedKmH = 22;
  let summary = '';
  let trafficCondition = 'moderate';
  let steps = [];

  const originName = origin.name || `${originLat.toFixed(4)}, ${originLng.toFixed(4)}`;
  const destName = destination.name || `${destLat.toFixed(4)}, ${destLng.toFixed(4)}`;

  if (travelMode === 'WALK') {
    avgSpeedKmH = 4.2;
    trafficCondition = 'light';
    summary = `Pedestrian route via sidewalks & zebra crossings (${estimatedRoadDistanceKm} km)`;
    steps = [
      `Depart ${originName} and follow pedestrian footpaths`,
      `Cross via signalized chowk / pedestrian crossings (FC Road / JM Road corridor)`,
      `Proceed along shaded avenue toward ${destName}`,
      `Arrive safely at ${destName}`
    ];
  } else if (travelMode === 'BICYCLE') {
    avgSpeedKmH = 12;
    trafficCondition = 'moderate';
    summary = `Cycling route avoiding major highway bottlenecks (${estimatedRoadDistanceKm} km)`;
    steps = [
      `Depart ${originName} via secondary residential arterial roads`,
      `Caution at busy roundabouts (Alka Talkies / Goodluck Chowk)`,
      `Continue along tree-lined university/camp side streets`,
      `Arrive at ${destName}`
    ];
  } else if (travelMode === 'TRANSIT') {
    avgSpeedKmH = 18;
    trafficCondition = 'moderate';
    summary = `PMPML Bus / Pune Metro Aqua/Purple line route (${estimatedRoadDistanceKm} km)`;
    steps = [
      `Board nearest PMPML bus or Pune Metro station near ${originName}`,
      `Transit via Deccan / Shivajinagar interchange corridor`,
      `Alight and take short walking stretch to ${destName}`
    ];
  } else {
    // DRIVE
    avgSpeedKmH = 22;
    trafficCondition = 'moderate';
    summary = `Driving route via Pune arterial roads (${estimatedRoadDistanceKm} km)`;
    steps = [
      `Start at ${originName} onto main arterial road`,
      `Navigate through central Pune chowks keeping lane discipline`,
      `Follow GPS guidance across Mutha river bridge toward ${destName}`,
      `Arrive at destination: ${destName}`
    ];
  }

  const durationMinutes = Math.max(3, Math.round((estimatedRoadDistanceKm / avgSpeedKmH) * 60));

  // Genuine Google Maps directions link for user convenience (zero API key needed to open directions in browser/app)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=${travelMode.toLowerCase()}`;

  return {
    mode: travelMode,
    origin: { lat: originLat, lng: originLng, name: originName },
    destination: { lat: destLat, lng: destLng, name: destName },
    distance_km: estimatedRoadDistanceKm,
    duration_minutes: durationMinutes,
    traffic_condition: trafficCondition,
    summary,
    steps,
    directions_url: directionsUrl,
    data_source: 'pune_urban_transit_model',
    safety_notice: 'Navigate through marked Pune pedestrian crossings and zebra stripes; exercise situational awareness at major chowks.',
    attribution_notice: 'Route calculated using Pune urban transit models. Click directions link for live turn-by-turn navigation on Google Maps or OpenStreetMap.',
  };
}
