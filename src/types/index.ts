export type UserRole = 'explorer' | 'moderator' | 'admin';

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  reputation_score: number;
  badge: string;
  created_at?: string;
}

export type PlaceCategory = 'restaurant' | 'hotel' | 'attraction' | 'heritage' | 'cafe';

export type DataSourceType = 
  | 'official_google_places' 
  | 'official_feed' 
  | 'citizen_community' 
  | 'municipal_sensor' 
  | 'pune_verified_local_database'
  | 'pune_urban_transit_model'
  | 'pune_climatological_model'
  | 'open_meteo_keyless'
  | 'demo_fallback';

export interface Place {
  id: string;
  place_id: string;
  name: string;
  category: PlaceCategory;
  rating: number;
  user_ratings_total: number;
  price_level?: string;
  address: string;
  lat: number;
  lng: number;
  photo_url?: string;
  photo_attribution?: string;
  opening_hours?: string;
  is_open_now?: boolean;
  phone?: string;
  website?: string;
  tags?: string[];
  safety_score: number; // 1-10
  cleanliness_score: number; // 1-10
  crowd_density: 'low' | 'moderate' | 'busy' | 'packed';
  walkability_score: number; // 1-10
  accessibility_rating: number; // 1-10
  data_source: DataSourceType;
  sourced_at: string;
  notes?: string;
}

export type ReportCategory = 
  | 'pothole'
  | 'street_light'
  | 'crowd_surge'
  | 'safety_concern'
  | 'transit_delay'
  | 'festival_event'
  | 'heritage_tip'
  | 'accessibility_barrier'
  | 'other';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'resolved';

export interface CitizenReport {
  id: string;
  user_id?: string;
  user_name?: string;
  title: string;
  description: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  lat: number;
  lng: number;
  address?: string;
  image_url?: string;
  audio_url?: string;
  voice_transcript?: string;
  confidence_score: number; // 0-100
  upvotes: number;
  user_has_voted?: boolean;
  duplicate_of?: string | null;
  moderation_note?: string;
  moderated_by?: string;
  moderated_at?: string;
  data_source: DataSourceType;
  created_at: string;
  distance_meters?: number;
}

export interface ItineraryStep {
  step: number;
  time: string;
  title: string;
  location: string;
  category: string;
  duration: string;
  cost_estimate: string;
  notes: string;
  safety_tip?: string;
  lat?: number;
  lng?: number;
}

export type BudgetTier = 'budget' | 'moderate' | 'luxury' | 'flexible';

export interface WeatherContext {
  summary: string;
  temp_c: number;
  condition: string;
  recommendation: string;
}

export interface Itinerary {
  id: string;
  user_id?: string;
  title: string;
  destination: string;
  budget_tier: BudgetTier;
  duration_hours: number;
  interests: string[];
  food_preferences?: string[];
  travel_style?: string;
  accessibility_options: string[];
  weather_context?: WeatherContext;
  weather_considerations?: string;
  schedule: ItineraryStep[];
  estimated_cost: number;
  currency?: string;
  data_source?: DataSourceType;
  is_public?: boolean;
  created_at: string;
}

export interface WeatherData {
  city: string;
  temp_c: number;
  temp_f: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_kph: number;
  uv_index: number;
  air_quality: string;
  rain_probability: number;
  outdoor_score: number; // 0-100
  recommendation: string;
  last_updated: string;
  data_source: DataSourceType;
}

export interface RouteEstimate {
  mode: 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT';
  origin: { lat: number; lng: number; name?: string };
  destination: { lat: number; lng: number; name?: string };
  distance_km: number;
  duration_minutes: number;
  duration_in_traffic_minutes?: number;
  traffic_condition: 'light' | 'moderate' | 'heavy';
  summary: string;
  steps?: string[];
  data_source: DataSourceType;
}

export interface SavedPlace {
  id: string;
  user_id: string;
  place_id: string;
  name: string;
  category?: string;
  address?: string;
  rating?: number;
  price_level?: string;
  lat: number;
  lng: number;
  notes?: string;
  created_at: string;
}

export type NavigationPage = 
  | 'home' 
  | 'explore' 
  | 'places' 
  | 'planner' 
  | 'compare' 
  | 'reports' 
  | 'insights' 
  | 'saved' 
  | 'profile' 
  | 'admin';
