-- ==============================================================================
-- Explore City — Database Schema & Row Level Security (RLS)
-- Tagline: Less Survival Mode. More Adventure.
-- ==============================================================================

-- Enable PostGIS if available (falls back gracefully to standard float coordinates)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'explorer' CHECK (role IN ('explorer', 'moderator', 'admin')),
    reputation_score INTEGER NOT NULL DEFAULT 10,
    badge TEXT NOT NULL DEFAULT 'Rookie Explorer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 2. CITIZEN REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.citizen_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'pothole', 
        'street_light', 
        'crowd_surge', 
        'safety_concern', 
        'transit_delay', 
        'festival_event', 
        'heritage_tip', 
        'accessibility_barrier', 
        'other'
    )),
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resolved')),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    address TEXT,
    image_url TEXT,
    audio_url TEXT,
    voice_transcript TEXT,
    confidence_score INTEGER NOT NULL DEFAULT 50,
    upvotes INTEGER NOT NULL DEFAULT 0,
    duplicate_of UUID REFERENCES public.citizen_reports(id) ON DELETE SET NULL,
    moderation_note TEXT,
    moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    moderated_at TIMESTAMPTZ,
    data_source TEXT NOT NULL DEFAULT 'citizen_community' CHECK (data_source IN ('citizen_community', 'official_feed', 'demo_fallback')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.citizen_reports ENABLE ROW LEVEL SECURITY;

-- Reports Policies
-- Approved reports are public; creators can view their own; moderators & admins view all
CREATE POLICY "Approved reports are viewable by all users" 
    ON public.citizen_reports FOR SELECT 
    USING (
        status = 'approved' 
        OR auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('moderator', 'admin')
        )
    );

CREATE POLICY "Authenticated users can create citizen reports" 
    ON public.citizen_reports FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own pending citizen reports" 
    ON public.citizen_reports FOR UPDATE 
    USING (
        (auth.uid() = user_id AND status = 'pending')
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('moderator', 'admin')
        )
    );

CREATE POLICY "Admins can delete reports" 
    ON public.citizen_reports FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 3. REPORT VOTES / COMMUNITY VERIFICATION TABLE
CREATE TABLE IF NOT EXISTS public.report_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.citizen_reports(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL DEFAULT 'up' CHECK (vote_type IN ('up', 'down', 'verify')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(report_id, user_id)
);

ALTER TABLE public.report_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view report votes" 
    ON public.report_votes FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can cast votes" 
    ON public.report_votes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
    ON public.report_votes FOR DELETE 
    USING (auth.uid() = user_id);

-- 4. SAVED PLACES TABLE (BOOKMARKS)
CREATE TABLE IF NOT EXISTS public.saved_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    place_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    address TEXT,
    rating NUMERIC(3, 2),
    price_level TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    notes TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, place_id)
);

ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view only their own saved places" 
    ON public.saved_places FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved places" 
    ON public.saved_places FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved places" 
    ON public.saved_places FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved places" 
    ON public.saved_places FOR DELETE 
    USING (auth.uid() = user_id);

-- 5. ITINERARIES TABLE (AI TRIP PLANNER STORAGE)
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    budget_tier TEXT CHECK (budget_tier IN ('budget', 'moderate', 'luxury', 'flexible')),
    duration_hours INTEGER NOT NULL,
    interests JSONB DEFAULT '[]'::jsonb,
    accessibility_options JSONB DEFAULT '[]'::jsonb,
    weather_context JSONB,
    schedule JSONB NOT NULL,
    estimated_cost NUMERIC(10, 2),
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public itineraries or own itineraries are viewable" 
    ON public.itineraries FOR SELECT 
    USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create itineraries" 
    ON public.itineraries FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own itineraries" 
    ON public.itineraries FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries" 
    ON public.itineraries FOR DELETE 
    USING (auth.uid() = user_id);

-- 6. PLACE COMPARISONS & SOURCED METRICS TABLE
CREATE TABLE IF NOT EXISTS public.place_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_bracket TEXT,
    rating NUMERIC(3, 2),
    reviews_count INTEGER DEFAULT 0,
    safety_score NUMERIC(3, 1),
    crowd_density TEXT CHECK (crowd_density IN ('low', 'moderate', 'busy', 'packed')),
    walkability_score NUMERIC(3, 1),
    accessibility_rating NUMERIC(3, 1),
    data_source TEXT NOT NULL,
    sourced_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.place_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Place metrics are public for read" 
    ON public.place_metrics FOR SELECT 
    USING (true);

-- 7. TRIGGERS & AUTOMATION

-- A. Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role, reputation_score, badge)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        'explorer',
        10,
        'Rookie Explorer'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B. Auto-update report upvotes & confidence score on vote change
CREATE OR REPLACE FUNCTION public.handle_report_vote_change()
RETURNS trigger AS $$
DECLARE
    v_report_id UUID;
    v_total_upvotes INTEGER;
    v_total_verifications INTEGER;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_report_id := OLD.report_id;
    ELSE
        v_report_id := NEW.report_id;
    END IF;

    SELECT 
        COUNT(*) FILTER (WHERE vote_type = 'up'),
        COUNT(*) FILTER (WHERE vote_type = 'verify')
    INTO v_total_upvotes, v_total_verifications
    FROM public.report_votes
    WHERE report_id = v_report_id;

    UPDATE public.citizen_reports
    SET 
        upvotes = v_total_upvotes,
        confidence_score = LEAST(99, 50 + (v_total_upvotes * 5) + (v_total_verifications * 10)),
        updated_at = timezone('utc'::text, now())
    WHERE id = v_report_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_report_vote_change ON public.report_votes;
CREATE TRIGGER on_report_vote_change
    AFTER INSERT OR UPDATE OR DELETE ON public.report_votes
    FOR EACH ROW EXECUTE FUNCTION public.handle_report_vote_change();

-- C. Automatically update reporter reputation upon approved report
CREATE OR REPLACE FUNCTION public.handle_report_moderation_reputation()
RETURNS trigger AS $$
BEGIN
    IF (NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') AND NEW.user_id IS NOT NULL) THEN
        UPDATE public.profiles
        SET 
            reputation_score = reputation_score + 15,
            badge = CASE 
                WHEN reputation_score + 15 >= 100 THEN 'Urban Legend'
                WHEN reputation_score + 15 >= 50 THEN 'City Scout'
                WHEN reputation_score + 15 >= 25 THEN 'Pathfinder'
                ELSE 'Rookie Explorer'
            END,
            updated_at = timezone('utc'::text, now())
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_report_status_moderated ON public.citizen_reports;
CREATE TRIGGER on_report_status_moderated
    AFTER UPDATE OF status ON public.citizen_reports
    FOR EACH ROW EXECUTE FUNCTION public.handle_report_moderation_reputation();

-- 8. INDEXES FOR HIGH-PERFORMANCE GEOSPATIAL & FILTER QUERIES
CREATE INDEX IF NOT EXISTS idx_citizen_reports_coords ON public.citizen_reports(lat, lng);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_status ON public.citizen_reports(status);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_category ON public.citizen_reports(category);
CREATE INDEX IF NOT EXISTS idx_saved_places_user ON public.saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_user ON public.itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_place_metrics_place_id ON public.place_metrics(place_id);
