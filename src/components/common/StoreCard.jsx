import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../../utils/distance';
import { useToast } from '../../context/ToastContext';

export function StoreCard({
  store,
  product = null,
  userLocation = null,
  onSelectOnMap = null,
  isSelected = false,
}) {
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState(false);
  const { toast } = useToast();

  if (!store) return null;

  const productInfo = product
    ? store.inventory?.[product.id] || null
    : null;

  const directionsUrl = getGoogleMapsDirectionsUrl(
    store.coordinates.lat,
    store.coordinates.lng,
    userLocation?.lat,
    userLocation?.lng
  );

  const handleReserve = () => {
    setReserving(true);
    setTimeout(() => {
      setReserving(false);
      setReserved(true);
      toast.success(
        `Reserved at ${store.name}! Reservation code: #SMART-${Math.floor(1000 + Math.random() * 9000)}. Pickup valid for 24 hours.`,
        'Store Pickup Confirmed'
      );
    }, 600);
  };

  const getStatusBadge = (status, stock) => {
    if (stock === 0 || status === 'Out of Stock') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-500" />
          Out of Stock
        </span>
      );
    }
    if (stock <= 3 || status === 'Limited Stock') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          Only {stock} Left in Stock
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        {stock ? `${stock} Units Available` : 'In Stock'}
      </span>
    );
  };

  return (
    <div
      onClick={onSelectOnMap ? () => onSelectOnMap(store) : undefined}
      className={`relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-2 border-electric-600 shadow-xl ring-4 ring-electric-50'
          : 'border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-slate-300'
      } ${onSelectOnMap ? 'cursor-pointer' : ''}`}
    >
      <div>
        {/* Store Top Image Banner */}
        <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

          {/* Distance Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-navy-950 text-xs font-extrabold shadow-sm flex items-center gap-1.5 border border-slate-200">
            <Navigation className="w-3 h-3 text-electric-600" />
            <span>{store.formattedDistance || `${store.distanceKm || 1.8} km away`}</span>
          </div>

          {/* Store Brand Pill */}
          <div className="absolute bottom-3 left-3 text-white">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-electric-600 text-white shadow-sm inline-block mb-1">
              {store.brand}
            </span>
            <h4 className="text-sm font-bold text-white drop-shadow-sm leading-snug">
              {store.name}
            </h4>
          </div>
        </div>

        {/* Store Details Body */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Specific product stock & price info if filtered by product */}
          {product && productInfo && (
            <div className="p-3 rounded-xl bg-electric-50/70 border border-electric-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Store Price for {product.name.split('(')[0]}
                </span>
                <span className="text-lg font-black text-navy-950">
                  ₹{productInfo.price.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                {getStatusBadge(productInfo.status, productInfo.stock)}
              </div>
            </div>
          )}

          {/* Address */}
          <div className="flex items-start gap-2.5 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{store.address}</span>
          </div>

          {/* Opening Hours */}
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium text-emerald-800">{store.hours}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <a
              href={`tel:${store.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-navy-950 font-semibold hover:text-electric-600 transition-colors"
            >
              {store.phone}
            </a>
          </div>

          {/* Store Amenities */}
          {store.amenities && store.amenities.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {store.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-1.5 transition-colors text-center"
        >
          <Navigation className="w-3.5 h-3.5 text-electric-600" />
          <span>Get Directions</span>
        </a>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleReserve();
          }}
          disabled={reserving || reserved}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center ${
            reserved
              ? 'bg-emerald-600 text-white'
              : 'bg-navy-950 hover:bg-navy-900 text-white shadow-xs'
          }`}
        >
          {reserved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reserved!</span>
            </>
          ) : reserving ? (
            <span>Reserving...</span>
          ) : (
            <>
              <PackageCheck className="w-3.5 h-3.5 text-electric-300" />
              <span>Reserve Pickup</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
