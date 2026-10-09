import { UserProfile, CitizenReport, SavedPlace, Itinerary } from '../types';

// Storage schema version for future-proof migrations
const STORAGE_VERSION = 'v1';

export const STORAGE_KEYS = {
  USER: `explore_city_${STORAGE_VERSION}_user`,
  REPORTS: `explore_city_${STORAGE_VERSION}_reports`,
  REPORT_DRAFTS: `explore_city_${STORAGE_VERSION}_report_drafts`,
  SAVED_PLACES: `explore_city_${STORAGE_VERSION}_saved_places`,
  ITINERARIES: `explore_city_${STORAGE_VERSION}_itineraries`,
  VOTES: `explore_city_${STORAGE_VERSION}_votes`,
  PREFERENCES: `explore_city_${STORAGE_VERSION}_preferences`,
};

// Default Demo User Accounts for Explore City (Pune Edition)
export const DEMO_USERS: Record<string, UserProfile> = {
  explorer: {
    id: 'user-pune-explorer-001',
    email: 'aaditya.joshi@explorecity.in',
    full_name: 'Aaditya Joshi',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'explorer',
    reputation_score: 45,
    badge: 'Pathfinder',
    created_at: '2026-02-15T10:00:00Z',
  },
  moderator: {
    id: 'user-pune-moderator-002',
    email: 'tanvi.deshmukh@explorecity.in',
    full_name: 'Tanvi Deshmukh',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    role: 'moderator',
    reputation_score: 140,
    badge: 'Urban Legend',
    created_at: '2026-01-10T08:00:00Z',
  },
  admin: {
    id: 'user-pune-admin-003',
    email: 'karan.kulkarni@explorecity.in',
    full_name: 'Karan Kulkarni (Pune Lead)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'admin',
    reputation_score: 280,
    badge: 'Civic Architect',
    created_at: '2025-10-01T00:00:00Z',
  }
};

// Initial Seed Reports for Pune (Local Browser Persistence & Offline Resilience)
// NOTE: These are strictly local demo records for situational awareness.
// They are not verified city safety feeds and are not submitted to municipal authorities.
export const INITIAL_PUNE_SEED_REPORTS: CitizenReport[] = [
  {
    id: 'rep-pune-001',
    user_id: 'user-pune-explorer-001',
    user_name: 'Aaditya Joshi',
    title: 'FC Road Pedestrian Promenade - Evening Book & Street Food Walkway Clear',
    description: 'Fergusson College Road wide pedestrian pavement is buzzing with student energy, book vendors, and lively street food stalls. Walkable and well-lit.',
    category: 'festival_event',
    severity: 'low',
    status: 'approved',
    lat: 18.5246,
    lng: 73.8415,
    address: 'FC Road, Deccan Gymkhana, Pune, Maharashtra 411004',
    confidence_score: 96,
    upvotes: 34,
    user_has_voted: false,
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
    voice_transcript: 'FC road walking area is clear, peaceful and vibrant with street food stalls open tonight.',
    data_source: 'citizen_community',
    created_at: '2026-10-09T08:30:00Z',
  },
  {
    id: 'rep-pune-002',
    user_id: 'user-pune-explorer-001',
    user_name: 'Pooja Shinde',
    title: 'Waterlogging & Deep Pothole Near Alka Talkies Chowk',
    description: 'Post-shower water collection on the left turn towards Tilak Road. Two-wheelers should slow down to avoid uneven asphalt.',
    category: 'pothole',
    severity: 'high',
    status: 'approved',
    lat: 18.5135,
    lng: 73.8488,
    address: 'Alka Talkies Chowk, Deccan, Pune, Maharashtra 411030',
    confidence_score: 88,
    upvotes: 22,
    user_has_voted: true,
    voice_transcript: 'Waterlogging and deep puddle on the left curve of Alka Talkies junction.',
    data_source: 'citizen_community',
    created_at: '2026-10-09T07:15:00Z',
  },
  {
    id: 'rep-pune-003',
    user_id: 'user-pune-admin-003',
    user_name: 'Pune Metro Transit Advisory Feed',
    title: 'Civil Court Interchange - Underground Concourse Escalator Servicing',
    description: 'North exit escalator under scheduled 45-min routine maintenance. Step-free elevator access is operational on South concourse.',
    category: 'transit_delay',
    severity: 'low',
    status: 'approved',
    lat: 18.5284,
    lng: 73.8569,
    address: 'Civil Court Metro Interchange, Shivajinagar, Pune 411005',
    confidence_score: 98,
    upvotes: 41,
    data_source: 'official_feed',
    created_at: '2026-10-09T06:00:00Z',
  },
  {
    id: 'rep-pune-004',
    user_id: 'user-pune-explorer-001',
    user_name: 'Mihir Ranade',
    title: 'Shaniwar Wada Heritage Sound & Light Show Gate Open',
    description: 'Delhi Darwaza entryway is clear. Ticket booth has active QR-code digital payment queue. Wonderful cooler evening breeze.',
    category: 'heritage_tip',
    severity: 'low',
    status: 'approved',
    lat: 18.5196,
    lng: 73.8553,
    address: 'Shaniwar Wada, Bajirao Road, Shaniwar Peth, Pune 411030',
    confidence_score: 95,
    upvotes: 56,
    image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600',
    data_source: 'citizen_community',
    created_at: '2026-10-08T19:40:00Z',
  },
  {
    id: 'rep-pune-005',
    user_id: 'user-pune-explorer-001',
    user_name: 'Ananya Roy',
    title: 'Broken Streetlight on Lane 6 Koregaon Park',
    description: 'Street lamp unlit on tree-lined Lane 6 near Osho garden turn. Commuters and cyclists should use bicycle lights.',
    category: 'street_light',
    severity: 'medium',
    status: 'approved',
    lat: 18.5372,
    lng: 73.8967,
    address: 'Lane 6, Koregaon Park, Pune, Maharashtra 411001',
    confidence_score: 81,
    upvotes: 15,
    data_source: 'citizen_community',
    created_at: '2026-10-08T16:20:00Z',
  },
  {
    id: 'rep-pune-006',
    user_id: 'user-pune-explorer-001',
    user_name: 'Devendra K.',
    title: 'High Crowd Density at Viman Nagar Market Corridor',
    description: 'Festive shopping rush near Datta Mandir Chowk. Strollers and wheelchairs should use alternate North lane.',
    category: 'crowd_surge',
    severity: 'low',
    status: 'approved',
    lat: 18.5679,
    lng: 73.9143,
    address: 'Viman Nagar Main Road, Pune 411014',
    confidence_score: 87,
    upvotes: 18,
    data_source: 'citizen_community',
    created_at: '2026-10-08T14:10:00Z',
  },
  {
    id: 'rep-pune-007',
    user_id: 'user-pune-explorer-001',
    user_name: 'Local Cyclist',
    title: 'Gravel Spill on Law College Road Curve',
    description: 'Loose construction gravel near Nal Stop flyover descend. Slippery for two-wheelers during turns.',
    category: 'safety_concern',
    severity: 'medium',
    status: 'pending',
    lat: 18.5123,
    lng: 73.8324,
    address: 'Law College Rd, Erandwane, Pune 411004',
    confidence_score: 62,
    upvotes: 4,
    data_source: 'citizen_community',
    created_at: '2026-10-09T09:10:00Z',
  }
];

// Safe storage wrapper with error resilience and storage quota protection
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storageService] Error reading key "${key}":`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storageService] Quota or write error on key "${key}":`, err);
    return false;
  }
}

export const localDb = {
  getUser(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.USER, DEMO_USERS.explorer);
  },

  setUser(user: UserProfile): void {
    safeSet(STORAGE_KEYS.USER, user);
  },

  getReports(): CitizenReport[] {
    const reports = safeGet<CitizenReport[] | null>(STORAGE_KEYS.REPORTS, null);
    if (reports && Array.isArray(reports) && reports.length > 0) {
      return reports;
    }
    // Initialize seed reports for Pune
    safeSet(STORAGE_KEYS.REPORTS, INITIAL_PUNE_SEED_REPORTS);
    return INITIAL_PUNE_SEED_REPORTS;
  },

  saveReports(reports: CitizenReport[]): void {
    safeSet(STORAGE_KEYS.REPORTS, reports);
  },

  getReportDraft(): Partial<CitizenReport> | null {
    return safeGet<Partial<CitizenReport> | null>(STORAGE_KEYS.REPORT_DRAFTS, null);
  },

  saveReportDraft(draft: Partial<CitizenReport> | null): void {
    if (!draft) {
      try {
        localStorage.removeItem(STORAGE_KEYS.REPORT_DRAFTS);
      } catch {
        // ignore
      }
    } else {
      safeSet(STORAGE_KEYS.REPORT_DRAFTS, draft);
    }
  },

  getSavedPlaces(): SavedPlace[] {
    return safeGet<SavedPlace[]>(STORAGE_KEYS.SAVED_PLACES, []);
  },

  saveSavedPlaces(places: SavedPlace[]): void {
    safeSet(STORAGE_KEYS.SAVED_PLACES, places);
  },

  getItineraries(): Itinerary[] {
    return safeGet<Itinerary[]>(STORAGE_KEYS.ITINERARIES, []);
  },

  saveItineraries(itineraries: Itinerary[]): void {
    safeSet(STORAGE_KEYS.ITINERARIES, itineraries);
  },

  getUserPreferences(): Record<string, any> {
    return safeGet<Record<string, any>>(STORAGE_KEYS.PREFERENCES, {
      city: 'Pune',
      currency: 'INR',
      budgetDefault: 'moderate',
      travelStyle: 'Balanced Explorer'
    });
  },

  saveUserPreferences(prefs: Record<string, any>): void {
    safeSet(STORAGE_KEYS.PREFERENCES, prefs);
  },

  // Clear all application data
  clearAllLocalData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    } catch (err) {
      console.warn('Error clearing localStorage:', err);
    }
  }
};
