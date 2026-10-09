import React, { useState } from 'react';
import { 
  Place, 
  PlaceCategory, 
  NavigationPage 
} from '../types';
import { ProvenanceBadge } from './ProvenanceBadge';
import { 
  Search, 
  Star, 
  MapPin, 
  Bookmark, 
  Columns3, 
  Clock, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Accessibility, 
  LayoutGrid, 
  List, 
  X,
  Compass,
  Filter
} from 'lucide-react';

interface Props {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  onBookmarkPlace: (place: Place) => void;
  isBookmarked: (placeId: string) => boolean;
  onAddToCompare: (place: Place) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const PlacesDirectoryPage: React.FC<Props> = ({
  places,
  onSelectPlace,
  onBookmarkPlace,
  isBookmarked,
  onAddToCompare,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredPlaces = places.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRating = p.rating >= minRating;
    const matchesPrice = priceFilter === 'all' || p.price_level === priceFilter;

    return matchesCategory && matchesSearch && matchesRating && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/80 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Verified Destination Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Places &amp; Urban Gems
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Explore authentic dining spots, boutique hotels, tourist attractions, and historic landmarks. Timestamped metrics with evidence-based safety and accessibility rankings.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold ${
                viewMode === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        
        {/* Search Bar & Categories */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by place name, address, or specialty tags..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
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
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'all', label: 'All Places' },
              { id: 'restaurant', label: '🍴 Food Spots' },
              { id: 'hotel', label: '🏨 Stays & Hotels' },
              { id: 'attraction', label: '🎡 Sights & Attractions' },
              { id: 'heritage', label: '🏛️ Heritage Landmarks' },
              { id: 'cafe', label: '☕ Roasteries & Cafes' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-amber'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Line */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.6}>4.6+ Stars</option>
                <option value={4.7}>4.7+ Stars</option>
              </select>
            </div>

            {/* Price Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Price:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
              >
                <option value="all">All Budgets</option>
                <option value="Free">Free Entry</option>
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Upscale)</option>
                <option value="$$$$">$$$$ (Luxury)</option>
              </select>
            </div>

          </div>

          <span className="text-slate-400 font-mono">
            Showing <strong>{filteredPlaces.length}</strong> of {places.length} destinations
          </span>
        </div>

      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div 
              key={place.id}
              className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 w-full relative bg-slate-900 overflow-hidden">
                  <img 
                    src={place.photo_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700'} 
                    alt={place.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-950/90 text-amber-400 border border-slate-800">
                    {place.category}
                  </span>

                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-950/90 text-amber-400 border border-slate-800 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{place.rating}</span>
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                      {place.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                      {place.price_level || 'Free'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </p>

                  <div className="mb-2">
                    <ProvenanceBadge source={place.data_source} timestamp={place.sourced_at} showTimestamp={true} />
                  </div>

                  {place.notes && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {place.notes}
                    </p>
                  )}

                  {/* Sourced Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Safety</p>
                      <p className="font-bold text-emerald-400 mt-0.5">{place.safety_score}/10</p>
                    </div>
                    <div className="border-x border-slate-800">
                      <p className="text-[10px] text-slate-400 uppercase">Cleanliness</p>
                      <p className="font-bold text-cyan-400 mt-0.5">{place.cleanliness_score}/10</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Mobility</p>
                      <p className="font-bold text-indigo-400 mt-0.5">{place.accessibility_rating}/10</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {place.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {place.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/80 mt-2">
                <button
                  onClick={() => {
                    onSelectPlace(place);
                    onNavigate('explore');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View Map</span>
                </button>

                <button
                  onClick={() => onAddToCompare(place)}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-xs font-semibold flex items-center gap-1"
                  title="Add to Compare"
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>

                <button
                  onClick={() => onBookmarkPlace(place)}
                  className={`p-2 rounded-xl border text-xs font-semibold ${
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
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Destination</th>
                <th className="p-4">Category</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Price</th>
                <th className="p-4">Safety</th>
                <th className="p-4">Cleanliness</th>
                <th className="p-4">Accessibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPlaces.map((place) => (
                <tr key={place.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">{place.name}</p>
                    <p className="text-[11px] text-slate-400">{place.address}</p>
                  </td>
                  <td className="p-4 capitalize">{place.category}</td>
                  <td className="p-4 font-bold text-amber-400">★ {place.rating}</td>
                  <td className="p-4 font-mono">{place.price_level || 'Free'}</td>
                  <td className="p-4 font-bold text-emerald-400">{place.safety_score}/10</td>
                  <td className="p-4 font-bold text-cyan-400">{place.cleanliness_score}/10</td>
                  <td className="p-4 font-bold text-indigo-400">{place.accessibility_rating}/10</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        onSelectPlace(place);
                        onNavigate('explore');
                      }}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold"
                    >
                      Map
                    </button>
                    <button
                      onClick={() => onAddToCompare(place)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-semibold"
                    >
                      Compare
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredPlaces.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
          <p className="text-slate-400 text-sm">No destinations matched your search filters.</p>
        </div>
      )}

    </div>
  );
};
