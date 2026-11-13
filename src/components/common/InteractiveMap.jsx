import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../../utils/distance';

export function InteractiveMap({
  stores = [],
  selectedStore = null,
  onSelectStore = null,
  userLocation = null,
  product = null,
}) {
  const [zoom, setZoom] = useState(1);
  const [mapType, setMapType] = useState('modern'); // 'modern' | 'satellite'

  // Approximate relative positioning on canvas for Bengaluru tech map
  // Center is roughly 12.96, 77.64
  const getPinPosition = (lat, lng) => {
    // Offset relative to center (Domlur/Indiranagar)
    const baseLat = 12.960;
    const baseLng = 77.640;

    // Scale factors
    const deltaX = (lng - baseLng) * 800; // east-west
    const deltaY = (baseLat - lat) * 900; // north-south

    const leftPercent = Math.min(Math.max(50 + deltaX, 8), 92);
    const topPercent = Math.min(Math.max(50 + deltaY, 12), 88);

    return { left: `${leftPercent}%`, top: `${topPercent}%` };
  };

  return (
    <div className="relative w-full h-[540px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-navy-950/90 backdrop-blur-md border border-navy-800 text-white text-xs font-bold shadow-lg flex items-center gap-2">
          <Compass className="w-4 h-4 text-electric-400 animate-spin [animation-duration:8s]" />
          <span>Interactive Radar Map</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 0.2, 1.6))}
          className="p-2 rounded-xl bg-navy-950/90 text-white border border-navy-800 hover:bg-navy-900 shadow-md text-xs"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
          className="p-2 rounded-xl bg-navy-950/90 text-white border border-navy-800 hover:bg-navy-900 shadow-md text-xs"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Map Canvas with Grid Lines */}
      <div
        className="relative w-full h-full overflow-hidden transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient Map Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-electric-600/10 blur-3xl pointer-events-none" />

        {/* Simulated Roads & Tech Corridor Vectors */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800/80 pointer-events-none stroke-2">
          <path d="M 0 180 Q 250 220 500 240 T 1000 280" fill="none" strokeWidth="4" stroke="rgba(30, 41, 59, 0.6)" />
          <path d="M 200 0 Q 240 300 320 600" fill="none" strokeWidth="3" stroke="rgba(30, 41, 59, 0.6)" />
          <path d="M 600 0 Q 550 250 680 600" fill="none" strokeWidth="3" stroke="rgba(30, 41, 59, 0.6)" />
          <path d="M 0 420 Q 400 380 1000 450" fill="none" strokeWidth="3" stroke="rgba(30, 41, 59, 0.6)" />
        </svg>

        {/* User Location Radar Marker */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-electric-500/20 animate-ping" />
            <span className="absolute w-6 h-6 rounded-full bg-electric-500/40 animate-pulse" />
            <div className="w-5 h-5 rounded-full bg-electric-600 border-2 border-white shadow-glow-electric flex items-center justify-center text-[10px] text-white font-bold">
              ●
            </div>
          </div>
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-navy-950/90 text-white text-[10px] font-bold whitespace-nowrap border border-slate-700 shadow-md">
            You Are Here
          </div>
        </div>

        {/* Physical Store Pins */}
        {stores.map((store) => {
          const isSelected = selectedStore?.id === store.id;
          const pos = getPinPosition(store.coordinates.lat, store.coordinates.lng);
          const itemStock = product ? store.inventory?.[product.id]?.stock : null;

          return (
            <div
              key={store.id}
              className={`absolute z-20 -translate-x-1/2 -translate-y-full cursor-pointer transition-transform duration-200 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
              style={{ left: pos.left, top: pos.top }}
              onClick={() => onSelectStore && onSelectStore(store)}
            >
              <div className="relative flex flex-col items-center">
                {/* Custom Marker Pin */}
                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-xl flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-electric-600 text-white border-white ring-4 ring-electric-400/30'
                      : 'bg-navy-950/95 text-white border-slate-700 hover:border-electric-400'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-electric-400'}`} />
                  <span className="truncate max-w-[110px]">{store.brand}</span>
                </div>
                {/* Pointer Tip */}
                <div
                  className={`w-2 h-2 rotate-45 -mt-1 ${
                    isSelected ? 'bg-electric-600' : 'bg-navy-950'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Store Popover Tray at Bottom of Map */}
      {selectedStore && (
        <div className="absolute bottom-4 left-4 right-4 z-30 p-4 rounded-2xl bg-navy-950/95 backdrop-blur-md border border-navy-800 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={selectedStore.image}
              alt={selectedStore.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-electric-400">
                  {selectedStore.brand}
                </span>
                <span className="text-xs text-slate-400">• {selectedStore.formattedDistance}</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate">{selectedStore.name}</h4>
              <p className="text-xs text-slate-400 truncate mt-0.5">{selectedStore.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href={getGoogleMapsDirectionsUrl(
                selectedStore.coordinates.lat,
                selectedStore.coordinates.lng,
                userLocation?.lat,
                userLocation?.lng
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
