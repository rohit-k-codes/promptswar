import React from 'react';
import { Place } from '../types';
import { ProvenanceBadge } from './ProvenanceBadge';
import { 
  Columns3, 
  X, 
  Star, 
  ShieldCheck, 
  Footprints, 
  Accessibility, 
  Plus
} from 'lucide-react';

interface Props {
  comparisonPlaces: Place[];
  allPlaces: Place[];
  onRemoveFromCompare: (placeId: string) => void;
  onAddToCompare: (place: Place) => void;
  onClearCompare: () => void;
}

export const PlaceComparisonMatrix: React.FC<Props> = ({
  comparisonPlaces,
  allPlaces,
  onRemoveFromCompare,
  onAddToCompare,
  onClearCompare,
}) => {
  // Compute best scores among compared places for dynamic highlights
  const highestRating = Math.max(...comparisonPlaces.map(p => p.rating), 0);
  const highestSafety = Math.max(...comparisonPlaces.map(p => p.safety_score), 0);
  const highestWalkability = Math.max(...comparisonPlaces.map(p => p.walkability_score), 0);
  const highestAccessibility = Math.max(...comparisonPlaces.map(p => p.accessibility_rating), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 mb-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
              <Columns3 className="w-3.5 h-3.5" />
              <span>Sourced & Timestamped Evidence Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Place Comparison Matrix
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Compare urban destinations side-by-side using verifiable data: safety scores, pedestrian accessibility, crowd density, and verified Google Places metrics.
            </p>
          </div>

          {comparisonPlaces.length > 0 && (
            <button
              onClick={onClearCompare}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold self-start sm:self-auto"
            >
              Reset Comparison
            </button>
          )}
        </div>
      </div>

      {/* Main Matrix Container */}
      {comparisonPlaces.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
          <Columns3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Places Selected for Comparison</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Explore the map and click <strong>"Compare"</strong> on any location card, or select from the recommended destinations below.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {allPlaces.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => onAddToCompare(p)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-400 hover:border-amber-400 font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add {p.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Quick Slot Selector Bar if < 3 places */}
          {comparisonPlaces.length < 3 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">Add another slot:</span>
              <div className="flex flex-wrap gap-2">
                {allPlaces
                  .filter(p => !comparisonPlaces.some(cp => cp.id === p.id))
                  .slice(0, 4)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onAddToCompare(p)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium"
                    >
                      + {p.name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison Cards Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-${comparisonPlaces.length} gap-6`}>
            {comparisonPlaces.map((place) => (
              <div 
                key={place.id}
                className="glass-card rounded-2xl border border-slate-700/80 p-6 flex flex-col justify-between"
              >
                <div>
                  
                  {/* Photo & Remove Header */}
                  <div className="relative -mx-6 -mt-6 mb-4 h-40 bg-slate-800 overflow-hidden rounded-t-2xl">
                    <img 
                      src={place.photo_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700'} 
                      alt={place.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <button
                      onClick={() => onRemoveFromCompare(place.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                        {place.category}
                      </span>
                      <h2 className="text-base font-bold text-white mt-1 leading-snug">
                        {place.name}
                      </h2>
                    </div>
                  </div>

                  {/* Provenance Badge */}
                  <div className="mb-4">
                    <ProvenanceBadge 
                      source={place.data_source} 
                      timestamp={place.sourced_at} 
                      showTimestamp={true} 
                    />
                  </div>

                  {/* Metric Comparisons with Dynamic Winner Highlights */}
                  <div className="space-y-3 text-xs">
                    
                    {/* Rating Metric */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">User Rating</p>
                        <p className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{place.rating} / 5.0</span>
                        </p>
                        <p className="text-[9px] text-slate-500">{place.user_ratings_total.toLocaleString()} reviews</p>
                      </div>
                      {place.rating === highestRating && comparisonPlaces.length > 1 && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase">
                          Top Rated
                        </span>
                      )}
                    </div>

                    {/* Safety Score Metric */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Evidence Safety</p>
                        <p className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{place.safety_score} / 10</span>
                        </p>
                        <p className="text-[9px] text-slate-500">Corroborated ground data</p>
                      </div>
                      {place.safety_score === highestSafety && comparisonPlaces.length > 1 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
                          Safest
                        </span>
                      )}
                    </div>

                    {/* Walkability Score */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Walkability</p>
                        <p className="text-sm font-bold text-cyan-400 mt-0.5 flex items-center gap-1">
                          <Footprints className="w-3.5 h-3.5" />
                          <span>{place.walkability_score} / 10</span>
                        </p>
                        <p className="text-[9px] text-slate-500">Sidewalk & crosswalk quality</p>
                      </div>
                      {place.walkability_score === highestWalkability && comparisonPlaces.length > 1 && (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold uppercase">
                          Most Walkable
                        </span>
                      )}
                    </div>

                    {/* Accessibility Rating */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Step-Free Accessibility</p>
                        <p className="text-sm font-bold text-indigo-400 mt-0.5 flex items-center gap-1">
                          <Accessibility className="w-3.5 h-3.5" />
                          <span>{place.accessibility_rating} / 10</span>
                        </p>
                        <p className="text-[9px] text-slate-500">Ramps & elevators</p>
                      </div>
                      {place.accessibility_rating === highestAccessibility && comparisonPlaces.length > 1 && (
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-extrabold uppercase">
                          Top Accessible
                        </span>
                      )}
                    </div>

                    {/* Crowd Density & Price */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase">Live Crowd</p>
                        <p className="text-xs font-bold capitalize text-slate-200 mt-0.5">
                          {place.crowd_density}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                        <p className="text-[10px] text-slate-400 uppercase">Price Bracket</p>
                        <p className="text-xs font-bold text-amber-400 mt-0.5">
                          {place.price_level || 'Free'}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Sourced Timestamp Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Timestamp:</span>
                  <span className="font-mono text-slate-400">
                    {new Date(place.sourced_at).toLocaleString()}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
