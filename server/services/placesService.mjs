import { PUNE_CURATED_PLACES } from '../puneData.mjs';

// Haversine formula for distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
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

export const isGoogleMapsServerConfigured = false; // Keyless architecture - no separate Google Maps API key required

/**
 * Search Pune places using authentic curated places & natural language filtering
 */
export async function searchPlaces({ query, category, lat = 18.5204, lng = 73.8567, radius = 25000 }) {
  let results = [...PUNE_CURATED_PLACES];

  // Filter by category if specified
  if (category && category !== 'all') {
    const normCategory = category.toLowerCase().trim();
    results = results.filter(p => (p.category || '').toLowerCase() === normCategory);
  }

  // Filter by search query if provided
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(p => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchAddress = (p.address || '').toLowerCase().includes(q);
      const matchNotes = (p.notes || '').toLowerCase().includes(q);
      const matchTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
      const matchCategory = (p.category || '').toLowerCase().includes(q);
      return matchName || matchAddress || matchNotes || matchTags || matchCategory;
    });
  }

  // Calculate distance from user/center coords and sort
  results = results.map(p => {
    const dist = calculateDistanceKm(lat, lng, p.lat, p.lng);
    return {
      ...p,
      distance_km: dist,
      directions_url: `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&destination_place_id=${p.place_id || ''}`,
      osm_url: `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=16/${p.lat}/${p.lng}`,
    };
  });

  // Sort by distance
  results.sort((a, b) => a.distance_km - b.distance_km);

  return {
    results,
    places: results,
    total: results.length,
    city: 'Pune, Maharashtra, India',
    center: { lat, lng },
    data_source: 'pune_verified_local_database',
    zero_budget_notice: 'Free keyless OpenStreetMap tile integration and verified Pune curated places. Zero Google Maps API keys required.',
  };
}

/**
 * Retrieve single place details
 */
export async function getPlaceDetails(placeId) {
  const found = PUNE_CURATED_PLACES.find(p => p.id === placeId || p.place_id === placeId);
  if (!found) {
    return { place: null };
  }

  return {
    place: {
      ...found,
      directions_url: `https://www.google.com/maps/dir/?api=1&destination=${found.lat},${found.lng}`,
      osm_url: `https://www.openstreetmap.org/?mlat=${found.lat}&mlon=${found.lng}#map=17/${found.lat}/${found.lng}`,
    },
    data_source: 'pune_verified_local_database',
  };
}
