import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, CitizenReport, SavedPlace, Itinerary } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback keys for local-first & demo resilience
const LOCAL_STORAGE_KEYS = {
  USER: 'explore_city_current_user',
  REPORTS: 'explore_city_reports',
  SAVED_PLACES: 'explore_city_saved_places',
  ITINERARIES: 'explore_city_itineraries',
  VOTES: 'explore_city_votes',
};

// Default Demo User Accounts
export const DEMO_USERS: Record<string, UserProfile> = {
  explorer: {
    id: 'user-explorer-001',
    email: 'explorer@explorecity.app',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'explorer',
    reputation_score: 35,
    badge: 'Pathfinder',
    created_at: '2026-03-12T10:00:00Z',
  },
  moderator: {
    id: 'user-moderator-002',
    email: 'moderator@explorecity.app',
    full_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'moderator',
    reputation_score: 120,
    badge: 'Urban Legend',
    created_at: '2026-01-05T08:00:00Z',
  },
  admin: {
    id: 'user-admin-003',
    email: 'admin@explorecity.app',
    full_name: 'Aria Chen (City Lead)',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    role: 'admin',
    reputation_score: 250,
    badge: 'Civic Architect',
    created_at: '2025-11-20T00:00:00Z',
  }
};

// Initial Seed Reports for Offline / Demo
export const INITIAL_SEED_REPORTS: CitizenReport[] = [
  {
    id: 'rep-001',
    user_id: 'user-explorer-001',
    user_name: 'Elena Rostova',
    title: 'Chinatown Lantern Night Walkway Clear & Open',
    description: 'Grant Ave has festive pedestrian-only lanterns active tonight. Street is safe, vibrant, and well-lit with ambient street musicians.',
    category: 'festival_event',
    severity: 'low',
    status: 'approved',
    lat: 37.7941,
    lng: -122.4078,
    address: '720 Grant Ave, San Francisco, CA',
    confidence_score: 94,
    upvotes: 28,
    user_has_voted: false,
    image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600',
    voice_transcript: 'Grant avenue is open for pedestrians only, lanterns are gorgeous and very safe tonight.',
    data_source: 'citizen_community',
    created_at: '2026-10-09T08:30:00Z',
  },
  {
    id: 'rep-002',
    user_id: 'user-explorer-001',
    user_name: 'Samir Patel',
    title: 'Broken Streetlight near Valencia Alleyway',
    description: 'Corner street lamp flickering out, creating a dark corner for cyclists and night walkers. Recommend using Mission St until municipal repairs finish.',
    category: 'street_light',
    severity: 'medium',
    status: 'approved',
    lat: 37.7599,
    lng: -122.4215,
    address: 'Valencia St & 19th St, San Francisco, CA',
    confidence_score: 82,
    upvotes: 14,
    user_has_voted: true,
    voice_transcript: 'Streetlight on the corner of Valencia and 19th is completely dead. Very dark right now.',
    data_source: 'citizen_community',
    created_at: '2026-10-09T07:15:00Z',
  },
  {
    id: 'rep-003',
    user_id: 'user-admin-003',
    user_name: 'SFMTA Advisory Feed',
    title: 'Muni 38 Geary Bus Track Asphalt Maintenance',
    description: 'Outbound rapid transit running with minor 10 min diversion between Powell & Stockton. Bus stop shifted 50m west.',
    category: 'transit_delay',
    severity: 'medium',
    status: 'approved',
    lat: 37.7874,
    lng: -122.4082,
    address: 'Geary St & Powell St, San Francisco, CA',
    confidence_score: 95,
    upvotes: 19,
    data_source: 'official_feed',
    created_at: '2026-10-09T06:00:00Z',
  },
  {
    id: 'rep-004',
    user_id: 'user-explorer-001',
    user_name: 'David Kim',
    title: 'Cable Car Barn Rooftop Hidden Viewing Open',
    description: 'Heritage gem alert: The historic cable car powerhouse observation deck is open with step-free elevator access and historical guide talks.',
    category: 'heritage_tip',
    severity: 'low',
    status: 'approved',
    lat: 37.7948,
    lng: -122.4117,
    address: '1201 Mason St, San Francisco, CA',
    confidence_score: 96,
    upvotes: 42,
    image_url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=600',
    data_source: 'citizen_community',
    created_at: '2026-10-08T19:40:00Z',
  },
  {
    id: 'rep-005',
    user_id: 'user-explorer-001',
    user_name: 'Chloe Laurent',
    title: 'Large Pothole on Embarcadero Waterfront Bike Track',
    description: '10-inch pothole right in the two-way cycle track near Ferry Building south pier. Significant hazard for road bikes & scooters.',
    category: 'pothole',
    severity: 'high',
    status: 'approved',
    lat: 37.7946,
    lng: -122.3929,
    address: 'The Embarcadero & Market St, San Francisco, CA',
    confidence_score: 79,
    upvotes: 11,
    data_source: 'citizen_community',
    created_at: '2026-10-08T16:20:00Z',
  },
  {
    id: 'rep-006',
    user_id: 'user-explorer-001',
    user_name: 'Leo Thorne',
    title: 'High Crowd Density at Pier 39 Boardwalk',
    description: 'Very dense foot traffic around sea lion docks. For stroller and wheelchair accessibility, use upper-level promenade.',
    category: 'crowd_surge',
    severity: 'low',
    status: 'approved',
    lat: 37.8087,
    lng: -122.4098,
    address: 'Pier 39, Beach St, San Francisco, CA',
    confidence_score: 88,
    upvotes: 16,
    data_source: 'citizen_community',
    created_at: '2026-10-08T14:10:00Z',
  },
  {
    id: 'rep-007',
    user_id: 'user-explorer-001',
    user_name: 'Anonymous Citizen',
    title: 'Shattered Glass along Playground Pathway',
    description: 'Broken bottle pile on the south edge of Civic Center plaza. Dangerous for pets and kids.',
    category: 'safety_concern',
    severity: 'medium',
    status: 'pending',
    lat: 37.7793,
    lng: -122.4172,
    address: 'Civic Center Plaza, San Francisco, CA',
    confidence_score: 52,
    upvotes: 2,
    data_source: 'citizen_community',
    created_at: '2026-10-09T09:10:00Z',
  },
  {
    id: 'rep-008',
    user_id: 'user-explorer-001',
    user_name: 'Bike Commuter',
    title: 'Embarcadero Cycle Lane Pothole Near Market',
    description: 'There is a deep hole on the bike lane pavement near Ferry Building.',
    category: 'pothole',
    severity: 'high',
    status: 'pending',
    duplicate_of: 'rep-005',
    lat: 37.7947,
    lng: -122.3930,
    address: 'The Embarcadero, San Francisco, CA',
    confidence_score: 64,
    upvotes: 3,
    data_source: 'citizen_community',
    created_at: '2026-10-09T09:45:00Z',
  }
];

// Helper methods for Local Data Persistence
export const localDb = {
  getUser(): UserProfile {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEMO_USERS.explorer;
  },

  setUser(user: UserProfile) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getReports(): CitizenReport[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.REPORTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_SEED_REPORTS));
    return INITIAL_SEED_REPORTS;
  },

  saveReports(reports: CitizenReport[]) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },

  getSavedPlaces(): SavedPlace[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_PLACES);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  },

  saveSavedPlaces(places: SavedPlace[]) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SAVED_PLACES, JSON.stringify(places));
  },

  getItineraries(): Itinerary[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.ITINERARIES);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  },

  saveItineraries(itineraries: Itinerary[]) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ITINERARIES, JSON.stringify(itineraries));
  }
};
