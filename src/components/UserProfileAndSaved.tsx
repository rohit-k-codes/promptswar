import React, { useState } from 'react';
import { 
  UserProfile, 
  Place, 
  Itinerary, 
  CitizenReport 
} from '../types';
import { 
  Bookmark, 
  Sparkles, 
  ShieldAlert, 
  Trash2, 
  Award, 
  Compass
} from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  savedPlaces: Place[];
  savedItineraries: Itinerary[];
  userReports: CitizenReport[];
  onRemoveSavedPlace: (placeId: string) => void;
  onRemoveItinerary: (itineraryId: string) => void;
  onViewPlaceOnMap: (place: Place) => void;
}

export const UserProfileAndSaved: React.FC<Props> = ({
  currentUser,
  savedPlaces,
  savedItineraries,
  userReports,
  onRemoveSavedPlace,
  onRemoveItinerary,
  onViewPlaceOnMap,
}) => {
  const [activeTab, setActiveTab] = useState<'places' | 'itineraries' | 'reports'>('places');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Profile Card Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <img 
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={currentUser.full_name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-400 shadow-glow-amber" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                  {currentUser.full_name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentUser.badge}</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                  {currentUser.reputation_score} Reputation Pts
                </span>
              </div>
            </div>
          </div>

          {/* Quick Counts */}
          <div className="grid grid-cols-3 gap-3 text-center sm:text-right">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Bookmarks</p>
              <p className="text-lg font-bold text-white mt-0.5">{savedPlaces.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Itineraries</p>
              <p className="text-lg font-bold text-amber-400 mt-0.5">{savedItineraries.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Reports</p>
              <p className="text-lg font-bold text-rose-400 mt-0.5">{userReports.length}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('places')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'places'
              ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Places ({savedPlaces.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('itineraries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'itineraries'
              ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Saved Itineraries ({savedItineraries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>My Civic Submissions ({userReports.length})</span>
        </button>
      </div>

      {/* Tab: Saved Places */}
      {activeTab === 'places' && (
        <div>
          {savedPlaces.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Bookmarks Saved Yet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Browse destinations on the Explore Map and tap "Bookmark" to save them to your pocket.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlaces.map((place) => (
                <div 
                  key={place.id}
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 w-full relative bg-slate-900">
                      <img 
                        src={place.photo_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700'} 
                        alt={place.name} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-950/80 text-amber-400 border border-slate-800">
                        {place.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-white truncate">{place.name}</h3>
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                          ★ {place.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mb-3">{place.address}</p>

                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Safety: {place.safety_score}/10
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 capitalize">
                          {place.crowd_density}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/80 mt-2">
                    <button
                      onClick={() => onViewPlaceOnMap(place)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                    <button
                      onClick={() => onRemoveSavedPlace(place.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
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

      {/* Tab: Saved Itineraries */}
      {activeTab === 'itineraries' && (
        <div className="space-y-6">
          {savedItineraries.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No AI Itineraries Saved</h3>
              <p className="text-xs text-slate-400 mt-1">
                Go to the AI Trip Planner and save your customized urban adventure itineraries.
              </p>
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
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{itin.title}</h3>
                    <p className="text-xs text-slate-400 mb-4">{itin.destination}</p>

                    <div className="space-y-2 mb-4">
                      {itin.schedule.slice(0, 3).map((st) => (
                        <div key={st.step} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-amber-400 font-mono font-bold shrink-0">{st.time}</span>
                          <span className="text-slate-400">·</span>
                          <span className="truncate">{st.title}</span>
                        </div>
                      ))}
                      {itin.schedule.length > 3 && (
                        <p className="text-[11px] text-slate-500">+ {itin.schedule.length - 3} more stops</p>
                      )}
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

      {/* Tab: User Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {userReports.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Reports Submitted</h3>
              <p className="text-xs text-slate-400 mt-1">
                You haven't logged any street incidents or heritage tips yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userReports.map((rep) => (
                <div key={rep.id} className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{rep.title}</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                        rep.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{rep.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-cyan-400">{rep.confidence_score}% Confidence</p>
                    <p className="text-[11px] text-slate-500">{rep.upvotes} Upvotes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
