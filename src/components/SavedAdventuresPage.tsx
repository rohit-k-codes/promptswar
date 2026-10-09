import React, { useState } from 'react';
import { Place, Itinerary, NavigationPage } from '../types';
import { 
  Bookmark, 
  Sparkles, 
  MapPin, 
  Trash2, 
  Compass, 
  Star, 
  Clock, 
  DollarSign, 
  Share2, 
  Calendar,
  Check,
  ArrowRight
} from 'lucide-react';

interface Props {
  savedPlaces: Place[];
  savedItineraries: Itinerary[];
  onRemoveSavedPlace: (placeId: string) => void;
  onRemoveItinerary: (itineraryId: string) => void;
  onSelectPlace: (place: Place) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const SavedAdventuresPage: React.FC<Props> = ({
  savedPlaces,
  savedItineraries,
  onRemoveSavedPlace,
  onRemoveItinerary,
  onSelectPlace,
  onNavigate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'places' | 'itineraries'>('places');
  const [copiedShare, setCopiedShare] = useState(false);

  const totalCost = savedItineraries.reduce((acc, i) => acc + (i.estimated_cost || 0), 0);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Pocket &amp; Itineraries</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Saved Adventures
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Your customized city bookmarks and synthesized AI exploration schedules. Ready for offline walks and street adventures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
              <span>{copiedShare ? 'Link Copied!' : 'Share Adventures'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Bookmarked Places</p>
            <p className="text-xl font-bold text-white mt-0.5">{savedPlaces.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Planned Itineraries</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{savedItineraries.length}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Budget</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5 font-mono">${totalCost}</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('places')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'places'
              ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarked Places ({savedPlaces.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('itineraries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'itineraries'
              ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Saved AI Itineraries ({savedItineraries.length})</span>
        </button>
      </div>

      {/* Content: Places */}
      {activeSubTab === 'places' && (
        <div>
          {savedPlaces.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Bookmarked Places</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Explore the city directory or interactive map and click the bookmark button to collect destinations.
              </p>
              <button
                onClick={() => onNavigate('places')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Browse Places Directory
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlaces.map((place) => (
                <div 
                  key={place.id}
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 w-full relative bg-slate-900">
                      <img 
                        src={place.photo_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700'} 
                        alt={place.name} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-950/80 text-amber-400 border border-slate-800">
                        {place.category}
                      </span>
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-950/80 text-amber-400 border border-slate-800">
                        ★ {place.rating}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-white truncate">{place.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate">{place.address}</p>

                      <div className="flex items-center gap-2 pt-1 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Safety: {place.safety_score}/10
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          Clean: {place.cleanliness_score}/10
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
                      className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                    <button
                      onClick={() => onRemoveSavedPlace(place.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content: Itineraries */}
      {activeSubTab === 'itineraries' && (
        <div className="space-y-6">
          {savedItineraries.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No AI Itineraries Saved Yet</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Use the AI Adventure Planner to synthesize a custom itinerary based on budget and live weather.
              </p>
              <button
                onClick={() => onNavigate('planner')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Go to AI Planner
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedItineraries.map((itin) => (
                <div key={itin.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {itin.duration_hours}h Tour · ${itin.estimated_cost}
                      </span>
                      <button
                        onClick={() => onRemoveItinerary(itin.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete Itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{itin.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{itin.destination}</p>

                    {/* Schedule Steps */}
                    <div className="space-y-2 mb-4">
                      {itin.schedule.map((st) => (
                        <div key={st.step} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono font-bold text-amber-400">{st.time}</span>
                            <span className="text-slate-400 font-mono">{st.cost_estimate}</span>
                          </div>
                          <p className="font-semibold text-white">{st.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{st.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 pt-3 border-t border-slate-800">
                    Saved on {new Date(itin.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
