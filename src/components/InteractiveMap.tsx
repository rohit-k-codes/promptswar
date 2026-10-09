import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
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
  ExternalLink,
  Layers,
  MapPin
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
  const [tileError, setTileError] = useState(false);

  // Center coordinates of Pune, Maharashtra
  const centerLat = 18.5204;
  const centerLng = 73.8567;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const reportsLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Filter places
  const filteredPlaces = places.filter(place => {
    // Only show markers when reliable coordinates are available
    if (typeof place.lat !== 'number' || typeof place.lng !== 'number') return false;
    if (isNaN(place.lat) || isNaN(place.lng)) return false;

    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter valid reports
  const validReports = citizenReports.filter(r => 
    typeof r.lat === 'number' && typeof r.lng === 'number' && !isNaN(r.lat) && !isNaN(r.lng)
  );

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | Zero-budget Pune Edition',
    });

    tileLayer.on('tileerror', () => {
      setTileError(true);
    });

    tileLayer.addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const reportsGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    reportsLayerRef.current = reportsGroup;
    mapInstanceRef.current = map;

    // Right-click or long-press on map to report a local issue
    map.on('contextmenu', (e: L.LeafletMouseEvent) => {
      onOpenReportModalWithCoords(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update place markers whenever filtered places change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredPlaces.forEach(place => {
      const isSelected = selectedPlace?.id === place.id;
      const categoryColor =
        place.category === 'heritage' ? '#f59e0b' :
        place.category === 'restaurant' ? '#10b981' :
        place.category === 'cafe' ? '#06b6d4' :
        place.category === 'hotel' ? '#8b5cf6' : '#ec4899';

      const iconHtml = `
        <div style="
          width: 34px;
          height: 34px;
          background: ${isSelected ? '#f59e0b' : '#0f172a'};
          border: 2px solid ${categoryColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          cursor: pointer;
          transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          transition: transform 0.2s;
        ">
          ${place.category === 'heritage' ? '🏛️' : place.category === 'cafe' ? '☕' : place.category === 'restaurant' ? '🍛' : '📍'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 220px; color: #f1f5f9;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: ${categoryColor}; font-weight: 700; margin-bottom: 2px;">
            ${place.category}
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 800; color: #ffffff;">${place.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #94a3b8; line-height: 1.3;">${place.address}</p>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; margin-bottom: 8px;">
            <span style="color: #f59e0b; font-weight: bold;">⭐ ${place.rating || '4.5'}</span>
            <span style="color: #cbd5e1;">${place.price_level || '₹'}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="
                display: inline-block;
                background: #f59e0b;
                color: #080c15;
                font-size: 11px;
                font-weight: 700;
                padding: 4px 8px;
                border-radius: 6px;
                text-decoration: none;
              "
            >
              Directions ↗
            </a>
            <a 
              href="https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="
                display: inline-block;
                background: #1e293b;
                color: #94a3b8;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 6px;
                text-decoration: none;
              "
            >
              OSM ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedPlace(place);
      });

      marker.addTo(markersGroup);
    });
  }, [filteredPlaces, selectedPlace]);

  // Update citizen reports layer
  useEffect(() => {
    const reportsGroup = reportsLayerRef.current;
    if (!reportsGroup) return;

    reportsGroup.clearLayers();

    if (!showReportsLayer) return;

    validReports.forEach(report => {
      const severityColor =
        report.severity === 'critical' ? '#ef4444' :
        report.severity === 'high' ? '#f97316' :
        report.severity === 'medium' ? '#f59e0b' : '#3b82f6';

      const iconHtml = `
        <div style="
          width: 28px;
          height: 28px;
          background: ${severityColor};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
        ">
          ⚠️
        </div>
      `;

      const reportIcon = L.divIcon({
        className: 'custom-leaflet-report-marker',
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([report.lat, report.lng], { icon: reportIcon });
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px; color: #f1f5f9;">
          <div style="font-size: 10px; color: ${severityColor}; font-weight: 700; text-transform: uppercase;">
            ${report.severity} Priority • Unverified Local Report
          </div>
          <h4 style="margin: 2px 0; font-size: 13px; font-weight: 700;">${report.title}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #cbd5e1;">${report.description}</p>
          <div style="font-size: 9px; color: #94a3b8;">
            Stored in local browser only. Not shared with municipal authorities.
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedReport(report);
      });
      marker.addTo(reportsGroup);
    });
  }, [validReports, showReportsLayer]);

  // Pan to selected place
  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedPlace.lat, selectedPlace.lng], 15, {
        animate: true,
      });
    }
  }, [selectedPlace]);

  // Handle route calculation
  const handleCalculateRoute = async (mode: 'WALK' | 'DRIVE' | 'BICYCLE' | 'TRANSIT') => {
    if (!selectedPlace) return;
    setIsCalculatingRoute(true);
    setRouteMode(mode);

    try {
      const estimate = await estimateRoute({
        origin: { lat: centerLat, lng: centerLng, name: 'Pune Central Station / Deccan' },
        destination: { lat: selectedPlace.lat, lng: selectedPlace.lng, name: selectedPlace.name },
        mode,
      });
      setActiveRoute(estimate);

      // Draw polyline on map
      const map = mapInstanceRef.current;
      if (map) {
        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
        }
        const latlngs: L.LatLngExpression[] = [
          [centerLat, centerLng],
          [selectedPlace.lat, selectedPlace.lng],
        ];
        const polyline = L.polyline(latlngs, {
          color: '#f59e0b',
          weight: 4,
          opacity: 0.8,
          dashArray: mode === 'WALK' ? '8, 8' : undefined,
        }).addTo(map);
        routePolylineRef.current = polyline;
      }
    } catch (e) {
      console.error('Route calculation error:', e);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] flex flex-col lg:flex-row overflow-hidden bg-brand-dark">
      {/* Search & Category Filter Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-2xl pointer-events-auto max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Pune heritage, FC Road cafes, misal..."
            className="w-full bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none px-2 py-1"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills & Reports Toggle */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto max-w-full">
          {(['all', 'heritage', 'restaurant', 'cafe', 'attraction', 'hotel'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-glow-amber'
                  : 'bg-slate-900/85 text-slate-300 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Places' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}

          <button
            onClick={() => setShowReportsLayer(!showReportsLayer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showReportsLayer
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-900/85 text-slate-400 border-slate-700/80'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Reports Layer ({validReports.length})</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas (Leaflet) */}
      <div className="flex-1 relative h-full w-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Tile Offline Banner if OSM tiles fail */}
        {tileError && (
          <div className="absolute bottom-6 left-6 z-[1000] bg-amber-950/90 border border-amber-600/80 text-amber-200 text-xs px-4 py-2.5 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Map tiles loading slowly or offline. Place list and coordinates remain 100% active.</span>
          </div>
        )}

        {/* Floating Quick Action hint */}
        <div className="absolute bottom-4 left-4 z-[500] hidden md:flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-400 backdrop-blur-md pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Right-click anywhere in Pune to log an unverified local observation.</span>
        </div>
      </div>

      {/* Sidebar: Synchronized Place List & Selection Details */}
      <div className="w-full lg:w-96 h-80 lg:h-full bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800/80 flex flex-col z-[500] backdrop-blur-xl">
        {selectedPlace ? (
          /* Selected Place Inspector */
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {selectedPlace.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 leading-tight font-heading">
                  {selectedPlace.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {selectedPlace.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedPlace.photo_url && (
              <div className="w-full h-36 rounded-xl overflow-hidden relative border border-slate-700/60 shadow-inner">
                <img
                  src={selectedPlace.photo_url}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] text-slate-300 px-2 py-0.5 rounded font-medium">
                  {selectedPlace.price_level || '₹₹'}
                </div>
              </div>
            )}

            {/* Notes & Heritage Context */}
            {selectedPlace.notes && (
              <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 leading-relaxed">
                {selectedPlace.notes}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {(selectedPlace.tags || []).map(t => (
                <span key={t} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60">
                  {t}
                </span>
              ))}
            </div>

            {/* Actions: Directions, Bookmark, Compare */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-glow-amber text-center"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </a>

              <button
                onClick={() => onBookmarkPlace(selectedPlace)}
                className={`flex items-center justify-center gap-1 px-3 py-2 font-bold text-xs rounded-xl border transition ${
                  isBookmarked(selectedPlace.id)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isBookmarked(selectedPlace.id) ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => onAddToCompare(selectedPlace)}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs rounded-xl transition"
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            </div>

            {/* Route Mode Calculator */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Estimate Route from Pune Central
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['WALK', 'BICYCLE', 'TRANSIT', 'DRIVE'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => handleCalculateRoute(m)}
                    disabled={isCalculatingRoute}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-semibold border transition ${
                      routeMode === m && activeRoute
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {m === 'WALK' && <Footprints className="w-3.5 h-3.5 mb-1" />}
                    {m === 'BICYCLE' && <Bike className="w-3.5 h-3.5 mb-1" />}
                    {m === 'TRANSIT' && <Bus className="w-3.5 h-3.5 mb-1" />}
                    {m === 'DRIVE' && <Car className="w-3.5 h-3.5 mb-1" />}
                    <span>{m}</span>
                  </button>
                ))}
              </div>

              {activeRoute && (
                <div className="mt-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span>{activeRoute.duration_minutes} mins</span>
                    <span className="text-amber-400">{activeRoute.distance_km} km</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{activeRoute.summary}</p>
                  <p className="text-[9px] text-slate-400 italic">
                    Calculated via Pune urban transit model. Open Google Maps for live GPS turn-by-turn.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Synchronized Places List */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pune Places ({filteredPlaces.length})
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">
                Leaflet & OpenStreetMap
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-2 space-y-1">
              {filteredPlaces.map(place => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition flex items-start justify-between gap-2 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        {place.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {place.address}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="text-amber-400 font-bold">⭐ {place.rating || '4.5'}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{place.price_level || '₹'}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-cyan-400 capitalize">{place.category}</span>
                    </div>
                  </div>
                  {place.photo_url && (
                    <img
                      src={place.photo_url}
                      alt={place.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700/60 shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
