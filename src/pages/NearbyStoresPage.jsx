import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Compass,
  Phone,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { getStoresWithDistance, getNearbyStoresForProduct } from '../services/storeService';
import { getCatalogProducts } from '../services/productService';
import { PRODUCTS } from '../data/products';
import { StoreCard } from '../components/common/StoreCard';
import { InteractiveMap } from '../components/common/InteractiveMap';
import { DEFAULT_CUSTOMER_COORDINATES } from '../data/stores';
import { useCatalogVersion } from '../hooks/useCatalogVersion';

export function NearbyStoresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productIdParam = searchParams.get('product') || 'all';

  const [selectedProductId, setSelectedProductId] = useState(productIdParam);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [maxDistanceKm, setMaxDistanceKm] = useState('25');
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_CUSTOMER_COORDINATES);

  // Re-fetch when the store owner saves or deletes inventory
  const catalogVersion = useCatalogVersion();

  // Sync with param
  useEffect(() => {
    setSelectedProductId(productIdParam);
  }, [productIdParam]);

  const selectedProduct = useMemo(() => {
    return getCatalogProducts().find((p) => p.id === selectedProductId) || null;
  }, [selectedProductId, catalogVersion]);

  // Stores filtered by product, city, and distance
  const stores = useMemo(() => {
    let list = getStoresWithDistance(userLocation);

    // City filter
    if (selectedCity && selectedCity !== 'all') {
      list = list.filter((s) => s.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Distance filter
    if (maxDistanceKm && maxDistanceKm !== 'all') {
      const maxKm = Number(maxDistanceKm);
      list = list.filter((s) => (s.distanceKm || 0) <= maxKm);
    }

    // Product availability filter
    if (selectedProduct) {
      list = list.filter((s) => s.inventory && s.inventory[selectedProduct.id]);
    }

    return list;
  }, [userLocation, selectedCity, maxDistanceKm, selectedProduct, catalogVersion]);

  useEffect(() => {
    if (stores.length > 0) {
      setSelectedStore((prev) => prev || stores[0]);
    }
  }, [stores]);

  const handleProductChange = (e) => {
    const val = e.target.value;
    setSelectedProductId(val);
    if (val === 'all') {
      searchParams.delete('product');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ product: val });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-electric-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-500/20 text-electric-300 text-xs font-bold border border-electric-400/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Local Store Inventory Radar</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Find Nearby Physical Stores
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Locate authorized electronics retail outlets in your neighborhood offering live demos, immediate curbside pickup, and store discounts.
          </p>
        </div>

        {/* User baseline location pill */}
        <div className="p-3.5 rounded-2xl bg-navy-900/90 border border-navy-800 text-xs shrink-0 space-y-1">
          <div className="flex items-center gap-1.5 text-electric-400 font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Customer GPS Reference:</span>
          </div>
          <div className="text-white font-semibold">
            {userLocation.city} ({userLocation.landmark})
          </div>
          <div className="text-[10px] text-slate-400">
            Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        {/* Product Filter */}
        <div className="flex-1 min-w-[220px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Filter by In-Stock Product
          </label>
          <select
            value={selectedProductId}
            onChange={handleProductChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-navy-950 focus:outline-none focus:border-electric-600"
          >
            <option value="all">All Stores (Any Product in Stock)</option>
            {getCatalogProducts().map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div className="w-40">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-navy-950 focus:outline-none focus:border-electric-600"
          >
            <option value="Bengaluru">Bengaluru</option>
            <option value="all">All Locations</option>
          </select>
        </div>

        {/* Radius Distance Filter */}
        <div className="w-40">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Max Radius
          </label>
          <select
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-navy-950 focus:outline-none focus:border-electric-600"
          >
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="all">Any Distance</option>
          </select>
        </div>
      </div>

      {/* Selected Product Banner if filtered */}
      {selectedProduct && (
        <div className="p-4 rounded-2xl bg-electric-50/80 border border-electric-200/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-12 h-12 rounded-xl object-cover border border-electric-200"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-electric-700">
                Checking In-Store Stock For:
              </span>
              <h4 className="text-sm font-bold text-navy-950">{selectedProduct.name}</h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
              {stores.length} Nearby Stores Stocking This Item
            </span>
            <button
              onClick={() => handleProductChange({ target: { value: 'all' } })}
              className="text-xs font-bold text-slate-500 hover:text-navy-950"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Split View: Stores Grid + Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stores List */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-navy-950">
              {stores.length} Retail Stores Found
            </span>
            <span className="text-xs text-slate-400">
              Sorted by nearest driving distance
            </span>
          </div>

          {stores.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-navy-950">No stores found matching criteria</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try expanding the maximum radius or selecting another city.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  product={selectedProduct}
                  userLocation={userLocation}
                  onSelectOnMap={(s) => setSelectedStore(s)}
                  isSelected={selectedStore?.id === store.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map */}
        <div className="lg:col-span-6 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-navy-950">
              <Compass className="w-4 h-4 text-electric-600" />
              <span>Interactive Store Map & Radar</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click any pin or card to inspect
            </span>
          </div>

          <InteractiveMap
            stores={stores}
            selectedStore={selectedStore}
            onSelectStore={(s) => setSelectedStore(s)}
            userLocation={userLocation}
            product={selectedProduct}
          />

          {/* Local Pickup Perks Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card text-xs text-slate-600 space-y-2">
            <h5 className="font-bold text-navy-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Why Buy at Nearby Physical Stores?
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant hands-on demo</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero wait time for delivery</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Immediate device trade-in</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Same-day curbside pickup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
