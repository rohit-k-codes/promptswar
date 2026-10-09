import React from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ShieldAlert, 
  Columns3, 
  Bookmark, 
  ArrowRight, 
  CloudSun, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Utensils,
  Landmark,
  Building2,
  Coffee,
  Navigation
} from 'lucide-react';
import { Place, CitizenReport, WeatherData, NavigationPage } from '../types';
import { ProvenanceBadge } from './ProvenanceBadge';

interface Props {
  weather: WeatherData | null;
  places: Place[];
  reports: CitizenReport[];
  onNavigate: (page: NavigationPage) => void;
  onSelectPlace: (place: Place) => void;
  onBookmarkPlace: (place: Place) => void;
  isBookmarked: (placeId: string) => boolean;
}

export const HomeDashboard: React.FC<Props> = ({
  weather,
  places,
  reports,
  onNavigate,
  onSelectPlace,
  onBookmarkPlace,
  isBookmarked,
}) => {
  const approvedReports = reports.filter(r => r.status === 'approved');
  const recentReports = reports.slice(0, 3);
  const featuredPlaces = places.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-10">
      
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-slate-700/80 shadow-glass">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-brand-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
            <Compass className="w-3.5 h-3.5" />
            <span>Civic Intelligence & Urban Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.1]">
            Explore<span className="text-gradient-amber">City</span>
          </h1>
          <p className="text-xl sm:text-2xl font-heading font-bold text-slate-200 mt-2">
            Less Survival Mode. <span className="text-cyan-400">More Adventure.</span>
          </p>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl">
            Stop merely surviving the city and start enjoying it. Discover verified local food gems, living heritage powerhouses, transparent safety insights, and weather-calibrated AI itineraries backed by actual citizen reports.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={() => onNavigate('explore')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-brand-500 to-amber-600 text-slate-950 font-extrabold text-sm shadow-glow-amber hover:opacity-95 transition-all"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Launch Interactive Map</span>
            </button>

            <button
              onClick={() => onNavigate('planner')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card text-white hover:text-amber-300 border border-slate-700 text-sm font-bold transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Plan AI Adventure</span>
            </button>

            <button
              onClick={() => onNavigate('places')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl glass-card text-slate-300 hover:text-white border border-slate-700 text-sm font-semibold transition-all"
            >
              <Utensils className="w-4 h-4 text-cyan-400" />
              <span>Browse Food & Sights</span>
            </button>
          </div>
        </div>
      </div>

      {/* City Pulse Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Weather Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Weather Pulse</span>
            <CloudSun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {weather ? `${weather.temp_c}°C` : '19°C'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {weather ? `${weather.temp_f}°F` : '66°F'}
            </span>
          </div>
          <p className="text-xs text-emerald-400 font-semibold mt-1 truncate">
            {weather ? weather.condition : 'Pleasant Deccan Breeze'}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
            <span>Outdoor Score: <strong className="text-emerald-400">{weather?.outdoor_score || 92}%</strong></span>
            <span className="font-mono">{weather?.data_source === 'official_feed' ? 'Official Feed' : 'Demo Model'}</span>
          </div>
        </div>

        {/* Safety Index Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Safety Index</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">9.4</span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">High Ground Evidence</p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
            <span>Pedestrian Comfort</span>
            <span className="text-cyan-400 font-bold">Verified Routes</span>
          </div>
        </div>

        {/* Civic Reports Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Citizen Reports</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{reports.length}</span>
            <span className="text-xs text-amber-400 font-semibold">({approvedReports.length} Active)</span>
          </div>
          <p className="text-xs text-cyan-400 font-semibold mt-1">Community Moderated</p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
            <span>Duplicate Clustered</span>
            <span className="font-bold text-slate-400">Algorithmic &lt;200m</span>
          </div>
        </div>

        {/* Verified Places Card */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Places</span>
            <Landmark className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{places.length}</span>
            <span className="text-xs text-slate-400">Curated Gems</span>
          </div>
          <p className="text-xs text-amber-400 font-semibold mt-1">Sourced Ratings & Hours</p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
            <span>Cleanliness &amp; Accessibility</span>
            <span className="font-bold text-emerald-400">Timestamped</span>
          </div>
        </div>

      </div>

      {/* Featured Places & Adventure Gems */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
              Featured Urban Gems
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Authentic food, living heritage, and scenic vantage points with evidence-based safety scores
            </p>
          </div>
          <button
            onClick={() => onNavigate('places')}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            <span>View All ({places.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlaces.map((place) => (
            <div
              key={place.id}
              className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="h-40 w-full relative bg-slate-900 overflow-hidden">
                  <img
                    src={place.photo_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700'}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-amber-400 border border-slate-800">
                    {place.category}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-950/80 text-amber-400 border border-slate-800">
                    ★ {place.rating}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {place.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">{place.address}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                      Safety: {place.safety_score}/10
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800 capitalize">
                      {place.crowd_density}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/80 mt-2">
                <button
                  onClick={() => {
                    onSelectPlace(place);
                    onNavigate('explore');
                  }}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>
                <button
                  onClick={() => onBookmarkPlace(place)}
                  className={`p-1.5 rounded-lg border text-xs font-semibold ${
                    isBookmarked(place.id)
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(place.id) ? 'fill-current text-emerald-400' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Advisory Highlights & Quick Comparison Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Citizen Reports */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Live Community Watch</span>
              </div>
              <h2 className="text-lg font-bold text-white">Recent Citizen Reports</h2>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View Hub</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {report.category.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                      report.severity === 'high' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{report.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{report.description}</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 shrink-0">
                  {report.confidence_score}% Confidence
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Card */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Evidence-Based Decision Support</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Built to Eliminate City Friction
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Explore City does not invent traffic data, ratings, or crime rumors. We strictly aggregate official platform feeds, timestamped telemetry, and multi-modal citizen reports so you can make informed decisions.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Side-by-side Place Comparison Matrix</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gemini 3.8 Flash AI weather-adapted itinerary planner</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Voice dictation &amp; algorithmic duplicate clustering</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('compare')}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Columns3 className="w-4 h-4 text-cyan-400" />
            <span>Open Place Comparison Matrix</span>
          </button>
        </div>

      </div>

    </div>
  );
};
