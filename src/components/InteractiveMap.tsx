import React, { useState } from 'react';
import { 
  Place, 
  PlaceCategory, 
  CitizenReport, 
  RouteEstimate 
} from '../types';
import { ProvenanceBadge } from './ProvenanceBadge';
import { estimateRoute } from '../services/routesService';
import { 
  Search, 
  ShieldAlert, 
  Navigation, 
  Star, 
  Clock, 
  Compass, 
  Bookmark, 
  Columns3, 
  Footprints, 
  Car, 
  Bike, 
  Bus, 
  X, 
  AlertTriangle, 
  Volume2
} from 'lucide-react';

interface Props {
  places: Place[];
  citizenReports: CitizenReport[];
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;
  onBookmarkPlace: (place: Place) => void;
  isBookmarked: (placeId: string) => boolean;
  onAddToCompare: (place: Place) => void;
  onOpenReportModalWithCoords: (lat: number, lng: number) => void;
}

export const InteractiveMap: React.FC<Props> = ({
  places,
  citizenReports,
  selectedPlace,
  setSelectedPlace,
  onBookmarkPlace,
  isBookmarked,
  onAddToCompare,
  onOpenReportModalWithCoords,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReportsLayer, setShowReportsLayer] = useState(true);
  const [activeRoute, setActiveRoute] = useState<RouteEstimate | null>(null);
  const [routeMode, setRouteMode] = useState<'WALK' | 'DRIVE' | 'BICYCLE' | 'TRANSIT'>('WALK');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);

  // Center coordinates of San Francisco Bay view
  const centerLat = 37.7749;
  const centerLng = -122.4194;

  // Coordinate normalizer for responsive SVG map projection
  // Lat: ~37.7500 to 37.8150 (approx 0.065 span)
  // Lng: ~-122.4700 to -122.3850 (approx 0.085 span)
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 37.7500;
    const maxLat = 37.8150;
    const minLng = -122.4700;
    const maxLng = -122.3850;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y because SVG coordinates have y=0 at top
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return { 
      x: Math.max(5, Math.min(95, x)), 
      y: Math.max(5, Math.min(95, y)) 
    };
  };

  const filteredPlaces = places.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const approvedReports = citizenReports.filter(r => r.status === 'approved');

  // Trigger route calculation when place or mode changes
  const handleCalculateRoute = async (place: Place, mode: typeof routeMode) => {
    setIsCalculatingRoute(true);
    setRouteMode(mode);
    try {
      const estimate = await estimateRoute({
        origin: { lat: 37.7749, lng: -122.4194, name: 'Market & 8th Hub' },
        destination: { lat: place.lat, lng: place.lng, name: place.name },
        mode,
      });
      setActiveRoute(estimate);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-brand-dark">
      
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Search Bar & Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto max-w-2xl w-full">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dining, heritage, vistas, landmarks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-slate-700/80 shadow-lg"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Vibe' },
              { id: 'restaurant', label: '🍴 Dining' },
              { id: 'heritage', label: '🏛️ Heritage' },
              { id: 'attraction', label: '🎡 Sights' },
              { id: 'hotel', label: '🏨 Stays' },
              { id: 'cafe', label: '☕ Cafes' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                    : 'glass-panel text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layer Toggles & Action */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          <button
            onClick={() => setShowReportsLayer(!showReportsLayer)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold glass-panel transition-all border ${
              showReportsLayer
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-sm'
                : 'text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Citizen Incidents ({approvedReports.length})</span>
          </button>
        </div>

      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 h-full w-full bg-[#0a0f1d] overflow-hidden select-none">
        
        {/* Cartographic Urban Vector Grid */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-60" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="urbanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            <linearGradient id="bayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0e172a" />
              <stop offset="100%" stop-color="#0284c7" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#urbanGrid)" />
          
          {/* Stylized San Francisco Coastline & Bay Curve */}
          <path
            d="M 68 0 Q 75 25 78 45 T 82 85 T 90 100 L 100 100 L 100 0 Z"
            fill="url(#bayGradient)"
            opacity="0.35"
          />
          {/* Main Transit Arterial (Market St diagonal) */}
          <line
            x1="15%"
            y1="82%"
            x2="85%"
            y2="30%"
            stroke="rgba(245, 158, 11, 0.25)"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
          {/* Embarcadero Waterfront line */}
          <path
            d="M 65 15 Q 78 30 84 55 T 85 90"
            fill="none"
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="3.5"
          />
        </svg>

        {/* Active Route Vector Line if calculated */}
        {activeRoute && selectedPlace && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <line
              x1="50%"
              y1="55%"
              x2={`${projectCoords(selectedPlace.lat, selectedPlace.lng).x}%`}
              y2={`${projectCoords(selectedPlace.lat, selectedPlace.lng).y}%`}
              stroke={routeMode === 'WALK' ? '#10B981' : routeMode === 'BICYCLE' ? '#06B6D4' : '#F59E0B'}
              strokeWidth="4"
              strokeDasharray={routeMode === 'WALK' ? '5,5' : 'none'}
              className="animate-pulse"
            />
          </svg>
        )}

        {/* User Current Location Indicator (Central Hub) */}
        <div 
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: '50%', top: '55%' }}
          title="Your Exploration Origin (Civic Center Hub)"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-8 h-8 rounded-full bg-cyan-500/20 radar-ping" />
            <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-glow-cyan flex items-center justify-center">
              <Navigation className="w-2.5 h-2.5 text-slate-950 fill-current" />
            </div>
          </div>
          <span className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-bold text-cyan-300 border border-cyan-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            You are here
          </span>
        </div>

        {/* Interactive Places Pins */}
        {filteredPlaces.map((place) => {
          const { x, y } = projectCoords(place.lat, place.lng);
          const isSelected = selectedPlace?.id === place.id;
          
          return (
            <div
              key={place.id}
              onClick={() => {
                setSelectedPlace(place);
                setSelectedReport(null);
              }}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              <div className="relative group flex flex-col items-center">
                {/* Pin Head */}
                <div className={`p-2 rounded-2xl shadow-xl border transition-all ${
                  isSelected 
                    ? 'bg-amber-500 text-slate-950 border-white shadow-glow-amber ring-4 ring-amber-500/30' 
                    : place.category === 'heritage' 
                    ? 'bg-indigo-900/90 text-indigo-200 border-indigo-500/40 hover:border-amber-400' 
                    : place.category === 'restaurant'
                    ? 'bg-amber-900/90 text-amber-200 border-amber-500/40 hover:border-amber-400'
                    : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-amber-400'
                }`}>
                  <span className="text-xs font-bold leading-none">
                    {place.category === 'restaurant' ? '🍴' : place.category === 'heritage' ? '🏛️' : place.category === 'hotel' ? '🏨' : place.category === 'cafe' ? '☕' : '🎡'}
                  </span>
                </div>

                {/* Rating badge */}
                <span className="mt-1 px-1.5 py-0.2 rounded-full bg-slate-950/90 border border-slate-800 text-[9px] font-bold text-amber-400 flex items-center gap-0.5 shadow-md">
                  ★ {place.rating}
                </span>

                {/* Hover Label */}
                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <div className="glass-panel px-2.5 py-1 rounded-lg text-xs font-semibold text-white border border-slate-700 shadow-xl flex items-center gap-1.5">
                    <span>{place.name}</span>
                    <span className="text-[10px] text-emerald-400 font-normal">
                      Safety {place.safety_score}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Citizen Incident Reports Layer */}
        {showReportsLayer && approvedReports.map((report) => {
          const { x, y } = projectCoords(report.lat, report.lng);
          const isSelected = selectedReport?.id === report.id;

          return (
            <div
              key={report.id}
              onClick={() => {
                setSelectedReport(report);
                setSelectedPlace(null);
              }}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              <div className="relative group flex flex-col items-center">
                <div className={`p-1.5 rounded-full border shadow-lg flex items-center justify-center ${
                  report.severity === 'high' || report.severity === 'critical'
                    ? 'bg-rose-600 text-white border-rose-300 ring-2 ring-rose-500/40 animate-pulse'
                    : report.category === 'festival_event'
                    ? 'bg-emerald-600 text-white border-emerald-300'
                    : 'bg-amber-600 text-white border-amber-300'
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                
                {/* Confidence indicator badge */}
                <span className="mt-0.5 px-1 rounded bg-slate-950/90 text-[8px] font-mono text-cyan-300 border border-cyan-800">
                  {report.confidence_score}%
                </span>

                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <div className="glass-panel px-2 py-0.5 rounded text-[11px] font-medium text-rose-300 border border-rose-500/40">
                    {report.title}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Click to Pinpoint New Citizen Report Callout */}
        <div className="absolute bottom-4 left-4 z-20">
          <button
            onClick={() => onOpenReportModalWithCoords(37.7833, -122.4167)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-amber-600 text-slate-950 font-bold text-xs shadow-glow-amber hover:opacity-95 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-slate-950" />
            <span>Submit Citizen Report at Coordinates</span>
          </button>
        </div>

      </div>

      {/* Place Details Slide-over Panel */}
      {selectedPlace && (
        <aside className="w-full lg:w-96 h-auto lg:h-full glass-panel border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto z-30 flex flex-col p-5 animate-slide-up">
          
          {/* Header image & close */}
          <div className="relative -mx-5 -mt-5 mb-4 h-48 bg-slate-800 overflow-hidden">
            <img
              src={selectedPlace.photo_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700'}
              alt={selectedPlace.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
            
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/70 text-slate-300 hover:text-white border border-slate-700/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-4 right-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                {selectedPlace.category}
              </span>
              <h2 className="text-lg font-heading font-extrabold text-white mt-1 leading-snug">
                {selectedPlace.name}
              </h2>
            </div>
          </div>

          {/* Provenance Badge */}
          <div className="mb-3">
            <ProvenanceBadge 
              source={selectedPlace.data_source} 
              timestamp={selectedPlace.sourced_at} 
              showTimestamp={true} 
            />
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center mb-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Rating</p>
              <p className="text-sm font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                {selectedPlace.rating}
              </p>
              <p className="text-[9px] text-slate-500">{selectedPlace.user_ratings_total.toLocaleString()} reviews</p>
            </div>
            <div className="border-x border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Safety Score</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">
                {selectedPlace.safety_score} / 10
              </p>
              <p className="text-[9px] text-emerald-500/80">Evidence-Backed</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Crowd</p>
              <p className="text-sm font-bold capitalize text-cyan-400 mt-0.5">
                {selectedPlace.crowd_density}
              </p>
              <p className="text-[9px] text-slate-500">Live Traffic</p>
            </div>
          </div>

          {/* Verified Sourced Metrics List */}
          <div className="space-y-2 mb-4 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{selectedPlace.opening_hours}</p>
                <p className="text-[11px] text-emerald-400">
                  {selectedPlace.is_open_now ? '● Open right now' : '○ Currently closed'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-slate-300">{selectedPlace.address}</p>
            </div>

            {selectedPlace.notes && (
              <p className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic">
                "{selectedPlace.notes}"
              </p>
            )}
          </div>

          {/* Action Row: Bookmark & Compare */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => onBookmarkPlace(selectedPlace)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                isBookmarked(selectedPlace.id)
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(selectedPlace.id) ? 'fill-current text-emerald-400' : ''}`} />
              <span>{isBookmarked(selectedPlace.id) ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={() => onAddToCompare(selectedPlace)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400 transition-all"
            >
              <Columns3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Compare</span>
            </button>
          </div>

          {/* Routes & Travel Estimates Section */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Travel Estimates
              </p>
              <span className="text-[10px] text-slate-400 font-medium">Traffic-Aware</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {[
                { mode: 'WALK' as const, icon: <Footprints className="w-3.5 h-3.5" />, label: 'Walk' },
                { mode: 'DRIVE' as const, icon: <Car className="w-3.5 h-3.5" />, label: 'Drive' },
                { mode: 'BICYCLE' as const, icon: <Bike className="w-3.5 h-3.5" />, label: 'Bike' },
                { mode: 'TRANSIT' as const, icon: <Bus className="w-3.5 h-3.5" />, label: 'Transit' },
              ].map((m) => (
                <button
                  key={m.mode}
                  onClick={() => handleCalculateRoute(selectedPlace, m.mode)}
                  className={`flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                    routeMode === m.mode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Active Route Result Card */}
            {activeRoute && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-400">
                    {activeRoute.duration_in_traffic_minutes || activeRoute.duration_minutes} mins
                  </span>
                  <span className="text-slate-400">{activeRoute.distance_km} km</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                    activeRoute.traffic_condition === 'heavy' ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {activeRoute.traffic_condition} traffic
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mb-2">{activeRoute.summary}</p>
                {activeRoute.steps && (
                  <ul className="space-y-1 text-[10px] text-slate-400 border-t border-slate-800 pt-2">
                    {activeRoute.steps.slice(0, 3).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">{idx + 1}.</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

        </aside>
      )}

      {/* Selected Report Inspection Overlay */}
      {selectedReport && (
        <aside className="w-full lg:w-96 h-auto lg:h-full glass-panel border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto z-30 flex flex-col p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Citizen Advisory
            </span>
            <button
              onClick={() => setSelectedReport(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-white mb-2">{selectedReport.title}</h3>
          
          <div className="mb-3">
            <ProvenanceBadge 
              source={selectedReport.data_source} 
              timestamp={selectedReport.created_at} 
              showTimestamp={true} 
            />
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            {selectedReport.description}
          </p>

          {selectedReport.voice_transcript && (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/30 mb-4">
              <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold mb-1">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Verified Audio Transcript</span>
              </div>
              <p className="text-xs text-slate-300 italic">"{selectedReport.voice_transcript}"</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Confidence Score:</span>
              <span className="font-bold text-cyan-400">{selectedReport.confidence_score} / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Community Upvotes:</span>
              <span className="font-bold text-emerald-400">{selectedReport.upvotes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Severity Level:</span>
              <span className="font-bold capitalize text-rose-400">{selectedReport.severity}</span>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
};
