import React, { useState } from 'react';
import {
  Search,
  MapPin,
  LocateFixed,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Pill,
  Clock,
  Compass,
} from 'lucide-react';
import { getCurrentCoordinates } from '../../utils/distance';
import { useToast } from '../../context/ToastContext';

// Preset test cities with coordinates
const PRESET_LOCATIONS = [
  { name: 'Mangalore (Hampankatta)', lat: 12.8687, lng: 74.8427 },
  { name: 'Mangalore (Kadri)', lat: 12.8835, lng: 74.8622 },
  { name: 'Bengaluru (Central)', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai (South)', lat: 18.9220, lng: 72.8347 },
  { name: 'Delhi (Connaught Place)', lat: 28.6304, lng: 77.2177 },
];

const POPULAR_SUGGESTIONS = [
  { name: 'Paracetamol 650mg', query: 'Paracetamol' },
  { name: 'Azithromycin 500mg', query: 'Azithromycin' },
  { name: 'Cetirizine 10mg', query: 'Cetirizine' },
  { name: 'Amoxicillin 500mg', query: 'Amoxicillin' },
  { name: 'Pantoprazole 40mg', query: 'Pantoprazole' },
];

export function MedicineSearch({
  searchQuery,
  setSearchQuery,
  userLocation,
  setUserLocation,
  filters,
  setFilters,
  totalResultsCount,
  availableStrengths = [],
  availableCategories = [],
}) {
  const toast = useToast();
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState(searchQuery);

  // Trigger search execution
  const handleExecuteSearch = (e) => {
    if (e) e.preventDefault();
    setSearchQuery(searchInputVal.trim());
    const el = document.getElementById('search-results');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Browser geolocation detect
  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      const coords = await getCurrentCoordinates();
      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: 'Browser GPS Detected',
        isDetected: true,
      });
      toast.success(
        `GPS Coordinates detected: ${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`,
        'Location Updated'
      );
    } catch (err) {
      toast.error(err.message || 'Unable to retrieve location.');
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleSelectPresetLocation = (e) => {
    const val = e.target.value;
    if (val === 'none') {
      setUserLocation(null);
      return;
    }
    const selected = PRESET_LOCATIONS.find((l) => l.name === val);
    if (selected) {
      setUserLocation({
        latitude: selected.lat,
        longitude: selected.lng,
        name: selected.name,
        isDetected: false,
      });
      toast.info(`Location set to ${selected.name}`);
    }
  };

  return (
    <div id="search-section" className="relative pt-6 sm:pt-12 pb-10">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-200/40 to-teal-200/40 blur-3xl pointer-events-none rounded-full" />

      {/* Hero Section Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines, Search Bar & Popular Suggestions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Real-Time Pharmacy Stock Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Find Your Medicine. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-600 via-teal-600 to-teal-500 bg-clip-text text-transparent">
                Find It Nearby.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Search nearby pharmacies and check medicine availability in real time.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleExecuteSearch}
              className="bg-white rounded-3xl p-3 sm:p-4 shadow-card hover:shadow-card-hover border border-slate-200 transition-all text-left space-y-3"
            >
              {/* Medicine Input & Search Button */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchInputVal}
                    onChange={(e) => setSearchInputVal(e.target.value)}
                    placeholder="Search medicine name, generic salt (e.g. Paracetamol 650mg, Dolo)..."
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 placeholder-slate-400 text-sm font-medium border border-transparent focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                  {searchInputVal && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInputVal('');
                        setSearchQuery('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 shrink-0 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

              {/* Location Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  {/* GPS Auto-Detect Button */}
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detectingLocation}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      userLocation?.isDetected
                        ? 'bg-teal-50 text-teal-800 border-teal-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <LocateFixed className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin text-teal-600' : 'text-slate-500'}`} />
                    <span>{detectingLocation ? 'Detecting GPS...' : userLocation?.isDetected ? 'GPS Active' : 'My Location'}</span>
                  </button>

                  {/* City Preset Dropdown */}
                  <div className="relative">
                    <select
                      value={userLocation?.name || 'none'}
                      onChange={handleSelectPresetLocation}
                      className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                    >
                      <option value="none">📍 Select City / Area</option>
                      {PRESET_LOCATIONS.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {userLocation && (
                    <button
                      type="button"
                      onClick={() => setUserLocation(null)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 underline ml-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    showAdvancedFilters || filters.status !== 'all' || filters.sortBy !== 'default'
                      ? 'bg-brand-50 text-brand-700 border-brand-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Active Location Indicator */}
              {userLocation && (
                <div className="text-[11px] text-teal-800 bg-teal-50/70 px-3 py-1.5 rounded-xl border border-teal-100 flex items-center justify-between">
                  <span>📍 Proximity sorting active for: <strong>{userLocation.name}</strong> ({userLocation.latitude.toFixed(3)}°, {userLocation.longitude.toFixed(3)}°)</span>
                </div>
              )}
            </form>

            {/* Popular Medicine Suggestions */}
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1 justify-center lg:justify-start">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Popular:</span>
              {POPULAR_SUGGESTIONS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setSearchInputVal(item.query);
                    setSearchQuery(item.query);
                  }}
                  className="px-3 py-1 rounded-full bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-600 font-semibold border border-slate-200 shadow-2xs transition-all hover:border-teal-300"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Professional Healthcare Graphic / Startup Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative backdrop glow card */}
              <div className="bg-gradient-to-tr from-brand-600 to-teal-500 rounded-3xl p-1 shadow-card-hover transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900 rounded-[22px] p-6 text-white space-y-5">
                  {/* Live Radar Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white tracking-wide">MediFinder Radar</div>
                        <div className="text-[10px] text-teal-400 font-medium">Real-Time Inventory Active</div>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold bg-teal-950 text-teal-300 px-2.5 py-1 rounded-full border border-teal-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                      Live Sync
                    </span>
                  </div>

                  {/* Sample Mockup Cards */}
                  <div className="space-y-3">
                    {/* Mock Card 1 */}
                    <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-brand-400" />
                          <span className="text-xs font-bold text-white">ABC Pharmacy</span>
                          <span className="text-[9px] bg-teal-900/90 text-teal-300 font-bold px-1.5 py-0.5 rounded border border-teal-700/50">Verified</span>
                        </div>
                        <span className="text-xs font-bold text-slate-300">📏 1.2 km</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-100">Paracetamol 650mg</div>
                          <div className="text-[10px] text-slate-400">120 packs in stock</div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-300 font-bold text-[10px] border border-teal-700/40">
                            🟢 Available
                          </span>
                          <div className="font-bold text-white text-xs mt-0.5">₹32.00</div>
                        </div>
                      </div>
                    </div>

                    {/* Mock Card 2 */}
                    <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2.5 opacity-90">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-teal-400" />
                          <span className="text-xs font-bold text-white">Mangalore Medicals</span>
                          <span className="text-[9px] bg-teal-900/90 text-teal-300 font-bold px-1.5 py-0.5 rounded border border-teal-700/50">24/7</span>
                        </div>
                        <span className="text-xs font-bold text-slate-300">📏 2.3 km</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-100">Azithromycin 500mg</div>
                          <div className="text-[10px] text-slate-400">3 packs left</div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 font-bold text-[10px] border border-amber-700/40">
                            🟡 Low Stock
                          </span>
                          <div className="font-bold text-white text-xs mt-0.5">₹110.00</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Micro Trust Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div>
                      <div className="text-sm font-extrabold text-teal-400">100%</div>
                      <div className="text-[10px] text-slate-400">Verified Stores</div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-brand-400">&lt; 1s</div>
                      <div className="text-[10px] text-slate-400">Stock Latency</div>
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-white">Direct</div>
                      <div className="text-[10px] text-slate-400">Google Maps</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="mt-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-teal-600" /> Filter & Sort Settings
              </span>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    status: 'all',
                    strength: 'all',
                    category: 'all',
                    sortBy: 'default',
                  })
                }
                className="text-xs text-slate-500 hover:text-teal-600 font-semibold"
              >
                Reset All Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Availability</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="all">All Availability Statuses</option>
                  <option value="Available">🟢 Available Only</option>
                  <option value="Low Stock">🟡 Low Stock Only</option>
                  <option value="Out of Stock">🔴 Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Dosage / Strength</label>
                <select
                  value={filters.strength}
                  onChange={(e) => setFilters({ ...filters, strength: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="all">All Strengths</option>
                  {availableStrengths.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Sort Results</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="default">Default Relevance</option>
                  <option value="distance" disabled={!userLocation}>
                    Distance: Nearest First {userLocation ? '📏' : '(Select Location first)'}
                  </option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="quantity_desc">Highest Stock Quantity</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
