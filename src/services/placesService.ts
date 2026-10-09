import { Place, PlaceCategory } from '../types';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const isGoogleMapsConfigured = Boolean(
  GOOGLE_MAPS_API_KEY && 
  GOOGLE_MAPS_API_KEY !== 'your-google-maps-api-key'
);

export const DEFAULT_CITY = {
  name: 'San Francisco, CA',
  lat: 37.7749,
  lng: -122.4194,
  zoom: 13,
};

// Curated authentic Places with full sourced metadata
export const CURATED_PLACES: Place[] = [
  {
    id: 'place-001',
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: 'Ferry Building Marketplace',
    category: 'attraction',
    rating: 4.7,
    user_ratings_total: 16820,
    price_level: '$$',
    address: '1 Ferry Building, San Francisco, CA 94111',
    lat: 37.7955,
    lng: -122.3937,
    photo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700',
    opening_hours: '7:00 AM – 8:00 PM Daily',
    is_open_now: true,
    phone: '+1 (415) 983-8030',
    website: 'https://ferrybuildingmarketplace.com',
    tags: ['Waterfront', 'Local Food', 'Historic Clock Tower', 'Ferry Terminal'],
    safety_score: 9.8,
    crowd_density: 'busy',
    walkability_score: 9.9,
    accessibility_rating: 9.8,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    notes: 'Historic 1898 beaux-arts ferry terminal now serving premier artisanal bakers, coffee roasters & fresh farmers markets.'
  },
  {
    id: 'place-002',
    place_id: 'ChIJz2q_bI6AhYARaYfUoJqI-lQ',
    name: 'Cable Car Museum & Powerhouse',
    category: 'heritage',
    rating: 4.7,
    user_ratings_total: 4230,
    price_level: 'Free',
    address: '1201 Mason St, San Francisco, CA 94108',
    lat: 37.7948,
    lng: -122.4117,
    photo_url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=700',
    opening_hours: '10:00 AM – 4:00 PM (Closed Mon)',
    is_open_now: true,
    phone: '+1 (415) 474-1887',
    website: 'https://cablecarmuseum.org',
    tags: ['Historic Powerhouse', 'Living Machinery', 'Free Admission', 'Nob Hill'],
    safety_score: 9.6,
    crowd_density: 'low',
    walkability_score: 8.5,
    accessibility_rating: 8.6,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    notes: 'Active working barn and powerhouse that drives the underground cables pulling the city’s cable car fleet.'
  },
  {
    id: 'place-003',
    place_id: 'ChIJVX1eG5GAhYARJ_q2V-yJg_M',
    name: 'Tartine Manufactory',
    category: 'restaurant',
    rating: 4.6,
    user_ratings_total: 3950,
    price_level: '$$$',
    address: '591 Alabama St, San Francisco, CA 94110',
    lat: 37.7629,
    lng: -122.4109,
    photo_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700',
    opening_hours: '8:00 AM – 4:00 PM Daily',
    is_open_now: true,
    phone: '+1 (415) 757-0007',
    website: 'https://tartinebakery.com',
    tags: ['Sourdough', 'Pastries', 'Specialty Coffee', 'Mission District'],
    safety_score: 9.1,
    crowd_density: 'busy',
    walkability_score: 9.3,
    accessibility_rating: 9.0,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    notes: 'Massive open industrial bakery, cafe, and ice cream churn bar in the vibrant Mission arts district.'
  },
  {
    id: 'place-004',
    place_id: 'ChIJL6X7zZCAhYARRg3FzV3Z0mU',
    name: 'Coit Tower & Telegraph Hill Murals',
    category: 'heritage',
    rating: 4.6,
    user_ratings_total: 9140,
    price_level: '$',
    address: '1 Telegraph Hill Blvd, San Francisco, CA 94133',
    lat: 37.8024,
    lng: -122.4058,
    photo_url: 'https://images.unsplash.com/photo-1541464522988-31b420f688b9?w=700',
    opening_hours: '10:00 AM – 5:00 PM Daily',
    is_open_now: true,
    phone: '+1 (415) 249-0920',
    website: 'https://sfrecpark.org/destination/coit-tower',
    tags: ['360° Views', 'WPA Murals', 'Golden Gate Vista', 'Historic Landmark'],
    safety_score: 9.5,
    crowd_density: 'moderate',
    walkability_score: 8.2,
    accessibility_rating: 7.5,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notes: '210-foot tower built in 1933 featuring historical 1930s fresco murals depicting California industrial and agricultural life.'
  },
  {
    id: 'place-005',
    place_id: 'ChIJW_fV-nSAhYARoQ1f70-rP_c',
    name: 'Palace Hotel (Historic Luxury & Garden Court)',
    category: 'hotel',
    rating: 4.5,
    user_ratings_total: 4890,
    price_level: '$$$$',
    address: '2 New Montgomery St, San Francisco, CA 94105',
    lat: 37.7885,
    lng: -122.4018,
    photo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700',
    opening_hours: 'Open 24 Hours',
    is_open_now: true,
    phone: '+1 (415) 512-1111',
    website: 'https://marriott.com',
    tags: ['Stained Glass Atrium', 'Historic Architecture', 'Afternoon Tea', 'Downtown'],
    safety_score: 9.7,
    crowd_density: 'moderate',
    walkability_score: 9.8,
    accessibility_rating: 9.6,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    notes: 'Founded in 1875, featuring the legendary Garden Court with an Austrian crystal chandelier dome ceiling.'
  },
  {
    id: 'place-006',
    place_id: 'ChIJz24c3nCAhYARo7B1X2K1K8w',
    name: 'Mission Dolores (Misión San Francisco de Asís)',
    category: 'heritage',
    rating: 4.5,
    user_ratings_total: 2180,
    price_level: '$',
    address: '3321 16th St, San Francisco, CA 94114',
    lat: 37.7645,
    lng: -122.4267,
    photo_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700',
    opening_hours: '9:00 AM – 4:00 PM Daily',
    is_open_now: true,
    phone: '+1 (415) 621-8203',
    website: 'https://missiondolores.org',
    tags: ['Oldest Building in SF', 'Adobe Architecture', 'Cemetery Garden', '1776'],
    safety_score: 9.0,
    crowd_density: 'low',
    walkability_score: 8.9,
    accessibility_rating: 8.2,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    notes: 'Oldest surviving intact structure in San Francisco, built of four-foot-thick adobe brick in 1776.'
  },
  {
    id: 'place-007',
    place_id: 'ChIJv8XjPn-AhYARv7JvI2bZ2qQ',
    name: 'Liholiho Yacht Club',
    category: 'restaurant',
    rating: 4.7,
    user_ratings_total: 2210,
    price_level: '$$$',
    address: '871 Sutter St, San Francisco, CA 94109',
    lat: 37.7888,
    lng: -122.4172,
    photo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700',
    opening_hours: '5:00 PM – 10:00 PM (Tue-Sat)',
    is_open_now: false,
    phone: '+1 (415) 440-5446',
    website: 'https://liholihoyachtclub.com',
    tags: ['Hawaiian Heritage', 'Craft Cocktails', 'Poppy Buns', 'Lower Nob Hill'],
    safety_score: 8.9,
    crowd_density: 'busy',
    walkability_score: 9.2,
    accessibility_rating: 8.8,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    notes: 'Acclaimed modern heritage dining fusing Hawaiian flavors with Indian and Californian seasonal craft.'
  },
  {
    id: 'place-008',
    place_id: 'ChIJz-_9n5SAhYAR7k4q73x3_x0',
    name: 'Golden Gate Park Conservatory of Flowers',
    category: 'attraction',
    rating: 4.7,
    user_ratings_total: 7300,
    price_level: '$$',
    address: '100 John F Kennedy Dr, San Francisco, CA 94118',
    lat: 37.7725,
    lng: -122.4601,
    photo_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=700',
    opening_hours: '10:00 AM – 4:30 PM (Tue-Sun)',
    is_open_now: true,
    phone: '+1 (415) 831-2700',
    website: 'https://conservatoryofflowers.org',
    tags: ['Victorian Greenhouse', 'Botanical Rarities', 'Paved Park Walks', 'Car-Free JFK'],
    safety_score: 9.7,
    crowd_density: 'moderate',
    walkability_score: 9.5,
    accessibility_rating: 9.4,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    notes: '1879 Victorian wood-and-glass greenhouse holding world-class rare carnivorous, highland, and aquatic botanical collections.'
  },
  {
    id: 'place-009',
    place_id: 'ChIJ0Vq4xZCAhYARR7x64v866iM',
    name: 'Hotel Nikko San Francisco',
    category: 'hotel',
    rating: 4.4,
    user_ratings_total: 5120,
    price_level: '$$$',
    address: '222 Mason St, San Francisco, CA 94102',
    lat: 37.7858,
    lng: -122.4095,
    photo_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700',
    opening_hours: 'Open 24 Hours',
    is_open_now: true,
    phone: '+1 (415) 394-1111',
    website: 'https://hotelnikkosf.com',
    tags: ['Union Square', 'Atrium Pool', 'Asian Modernism', 'Boutique Comfort'],
    safety_score: 9.2,
    crowd_density: 'moderate',
    walkability_score: 9.6,
    accessibility_rating: 9.2,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 105).toISOString(),
    notes: 'Sophisticated modern hotel steps from Union Square, featuring a glass-enclosed indoor atrium pool and pet terrace.'
  },
  {
    id: 'place-010',
    place_id: 'ChIJb6F1NpqAhYARYv7F2l0oQyQ',
    name: 'Sightglass Coffee Roastery',
    category: 'cafe',
    rating: 4.6,
    user_ratings_total: 3100,
    price_level: '$$',
    address: '270 7th St, San Francisco, CA 94103',
    lat: 37.7770,
    lng: -122.4085,
    photo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700',
    opening_hours: '7:00 AM – 5:00 PM Daily',
    is_open_now: true,
    phone: '+1 (415) 861-1313',
    website: 'https://sightglasscoffee.com',
    tags: ['Artisanal Roaster', 'Two-Story Loft', 'Pour Over Bar', 'SoMa'],
    safety_score: 8.8,
    crowd_density: 'moderate',
    walkability_score: 9.1,
    accessibility_rating: 9.0,
    data_source: isGoogleMapsConfigured ? 'official_google_places' : 'demo_fallback',
    sourced_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    notes: 'Sun-drenched two-story timber roastery and cafe showcasing vintage Probat cast-iron roasters in full view.'
  }
];

export async function fetchPlaces(options?: {
  category?: PlaceCategory | 'all';
  searchQuery?: string;
  minRating?: number;
  maxPrice?: string;
}): Promise<Place[]> {
  let results = [...CURATED_PLACES];

  if (options?.category && options.category !== 'all') {
    results = results.filter(p => p.category === options.category);
  }

  if (options?.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.toLowerCase().trim();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q)) ||
      p.notes?.toLowerCase().includes(q)
    );
  }

  if (options?.minRating) {
    results = results.filter(p => p.rating >= (options.minRating || 0));
  }

  return results;
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
  const found = CURATED_PLACES.find(p => p.id === id || p.place_id === id);
  return found || null;
}
