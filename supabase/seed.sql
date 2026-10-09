-- ==============================================================================
-- Explore City — Seed Data for Development and Testing
-- Tagline: Less Survival Mode. More Adventure.
-- ==============================================================================

-- 1. SEED PROFILES (Mock IDs for development reference)
-- Real users will be created via Supabase Auth

-- 2. SEED CITIZEN REPORTS (Geotagged around San Francisco / Bay Area & Central Hub)
-- Lat: ~37.7749, Lng: -122.4194
INSERT INTO public.citizen_reports (
    id, title, description, category, severity, status, lat, lng, address,
    confidence_score, upvotes, data_source, voice_transcript
) VALUES 
(
    'a1111111-1111-1111-1111-111111111111',
    'Chinatown Lantern Festival Night Walkway Clear',
    'Grant Ave has festive pedestrian-only lanterns active tonight. Street is safe, vibrant, and well-lit with high police presence.',
    'festival_event', 'low', 'approved',
    37.7941, -122.4078, '720 Grant Ave, San Francisco, CA',
    94, 28, 'citizen_community',
    'Grant avenue is open for pedestrians only, lanterns are gorgeous and very safe tonight.'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Broken Streetlight near Valencia Alleyway',
    'Corner street lamp flickering out, dark corner for cyclists and pedestrians after 9 PM. Recommend using Mission St until fixed.',
    'street_light', 'medium', 'approved',
    37.7599, -122.4215, 'Valencia St & 19th St, San Francisco, CA',
    82, 14, 'citizen_community',
    'Streetlight on the corner of Valencia and 19th is completely dead. Very dark right now.'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Rapid Muni 38 Geary Bus Track Maintenance',
    'Outbound bus delayed by 15 mins due to surface asphalt repaving between Powell & Stockton.',
    'transit_delay', 'medium', 'approved',
    37.7874, -122.4082, 'Geary St & Powell St, San Francisco, CA',
    89, 19, 'official_feed',
    NULL
),
(
    'a4444444-4444-4444-4444-444444444444',
    'Historic Cable Car Powerhouse Hidden Rooftop Open',
    'Heritage access secret: Cable Car Barn rooftop viewing terrace is open today with free entry and wheelchair ramp.',
    'heritage_tip', 'low', 'approved',
    37.7948, -122.4117, '1201 Mason St, San Francisco, CA',
    96, 42, 'citizen_community',
    'Rooftop viewing deck at Mason Street cable car barn is open to the public today.'
),
(
    'a5555555-5555-5555-5555-555555555555',
    'Pothole on Embarcadero Bike Lane',
    'Deep 10-inch pothole right in the two-way cycle track near Ferry Building south pier. Hazard for e-scooters and road bikes.',
    'pothole', 'high', 'approved',
    37.7946, -122.3929, 'The Embarcadero & Market St, San Francisco, CA',
    78, 11, 'citizen_community',
    NULL
),
(
    'a6666666-6666-6666-6666-666666666666',
    'Weekend Crowd Surge at Pier 39 Sea Lion Dock',
    'Very packed observation boardwalk. Stroller movement is slow. Best viewing spot is the upper level deck near fog bell.',
    'crowd_surge', 'low', 'approved',
    37.8087, -122.4098, 'Pier 39, Beach St, San Francisco, CA',
    88, 15, 'citizen_community',
    'Boardwalk is packed today, head up to the second level for clear views.'
),
(
    'a7777777-7777-7777-7777-777777777777',
    'Suspicious Broken Glass near Civic Center Plaza',
    'Shattered glass bottle pile along playground south walkway. Needs municipal street sweeper dispatch.',
    'safety_concern', 'medium', 'pending',
    37.7793, -122.4172, 'Civic Center Plaza, San Francisco, CA',
    52, 2, 'citizen_community',
    NULL
),
(
    'a8888888-8888-8888-8888-888888888888',
    'Duplicate: Pothole on Embarcadero Waterfront Path',
    'Near Ferry Building bike lane there is a large hole in asphalt.',
    'pothole', 'high', 'pending',
    37.7947, -122.3930, 'The Embarcadero, San Francisco, CA',
    60, 3, 'citizen_community',
    NULL
)
ON CONFLICT (id) DO NOTHING;

-- Link duplicate report
UPDATE public.citizen_reports 
SET duplicate_of = 'a5555555-5555-5555-5555-555555555555' 
WHERE id = 'a8888888-8888-8888-8888-888888888888';

-- 3. SEED SOURCED PLACE COMPARISONS
INSERT INTO public.place_metrics (
    place_id, name, category, price_bracket, rating, reviews_count,
    safety_score, crowd_density, walkability_score, accessibility_rating,
    data_source, sourced_at, metadata
) VALUES 
(
    'place_sf_tartine',
    'Tartine Manufactory & Bakery',
    'Dining & Bakery',
    '$$',
    4.7,
    3840,
    9.2,
    'busy',
    9.4,
    9.0,
    'official_google_places',
    NOW(),
    '{"best_time": "Weekday 2-4 PM", "outdoor_seating": true, "heritage_origin": "Mission Craft Revival"}'::jsonb
),
(
    'place_sf_coit',
    'Coit Tower & Telegraph Hill Murals',
    'Heritage & Vista',
    '$',
    4.6,
    8920,
    9.5,
    'moderate',
    8.1,
    7.2,
    'official_google_places',
    NOW(),
    '{"best_time": "Sunset / Golden Hour", "elevator_accessible": true, "wpa_murals": true}'::jsonb
),
(
    'place_sf_ferry',
    'Ferry Building Historic Marketplace',
    'Food Hall & Waterfront Heritage',
    '$$$',
    4.7,
    15200,
    9.8,
    'busy',
    9.9,
    9.8,
    'official_google_places',
    NOW(),
    '{"farmers_market_days": ["Tuesday", "Thursday", "Saturday"], "transit_accessible": true}'::jsonb
),
(
    'place_sf_cable_car_barn',
    'Cable Car Museum & Powerhouse',
    'Heritage & Engineering Wonder',
    'Free',
    4.7,
    4200,
    9.6,
    'low',
    8.5,
    8.6,
    'official_google_places',
    NOW(),
    '{"admission": "Free", "working_machinery": true}'::jsonb
),
(
    'place_sf_mission_dolores',
    'Mission San Francisco de Asís (Dolores)',
    'Historic Landmark',
    '$',
    4.5,
    2100,
    9.0,
    'low',
    8.8,
    8.0,
    'official_google_places',
    NOW(),
    '{"established": 1776, "oldest_intact_building_sf": true}'::jsonb
)
ON CONFLICT (place_id) DO UPDATE SET
    rating = EXCLUDED.rating,
    sourced_at = NOW();

-- 4. SEED SAMPLE ADVENTURE ITINERARY
INSERT INTO public.itineraries (
    id, title, destination, budget_tier, duration_hours,
    interests, accessibility_options, weather_context, estimated_cost, is_public, schedule
) VALUES (
    'b1111111-1111-1111-1111-111111111111',
    'Historic Waterfront to Mission Food Odyssey',
    'San Francisco, CA',
    'moderate',
    6,
    '["heritage", "local_food", "scenic_walk", "art"]'::jsonb,
    '["step_free_options", "shaded_rest_stops"]'::jsonb,
    '{"summary": "Mild coastal sunshine, 19°C (66°F), low wind", "recommendation": "Ideal for waterfront walking & outdoor dining"}'::jsonb,
    48.00,
    true,
    '[
        {
            "step": 1,
            "time": "09:30 AM",
            "title": "Morning Brew & Sourdough at Ferry Building",
            "location": "Historic Ferry Marketplace",
            "category": "Culinary Heritage",
            "duration": "1 hr",
            "cost_estimate": "$12",
            "notes": "Enjoy fresh coffee with panoramic bay bridge views. Step-free access throughout.",
            "safety_tip": "High foot-traffic, exceptionally safe promenade."
        },
        {
            "step": 2,
            "time": "11:00 AM",
            "title": "Cable Car Barn & Underground Giant Sheaves",
            "location": "1201 Mason St",
            "category": "Living Heritage",
            "duration": "1.5 hrs",
            "cost_estimate": "Free Entry",
            "notes": "Watch the huge 14-foot winding wheels powering the entire cable car network.",
            "safety_tip": "Steep incline outside; board cable car at Powell/Market to avoid hill climbing."
        },
        {
            "step": 3,
            "time": "01:00 PM",
            "title": "Culinary Mission Discovery: Authentic Taqueria & Artisanal treats",
            "location": "Valencia & Mission Corridor",
            "category": "Local Food",
            "duration": "2 hrs",
            "cost_estimate": "$22",
            "notes": "Sample legendary carnitas followed by craft gelato. Vibrant street art alleys.",
            "safety_tip": "Well-lit and vibrant afternoon streets; stick to main pedestrian avenues."
        },
        {
            "step": 4,
            "time": "03:30 PM",
            "title": "Sunset Skyline Lounge at Dolores Park",
            "location": "Mission Dolores Park",
            "category": "Scenic Chill",
            "duration": "1.5 hrs",
            "cost_estimate": "$5",
            "notes": "Relax on the southwest slope for iconic views of the downtown skyline.",
            "safety_tip": "Pack out all trash; park closes at 10 PM."
        }
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
