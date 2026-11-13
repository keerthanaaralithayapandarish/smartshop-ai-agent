import React from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatRelativeTime, getStatusBadge } from '../../utils/formatters';
import { formatDistance, getGoogleMapsDirectionsUrl } from '../../utils/distance';

export function MedicineCard({ item, userLocation }) {
  const { medicine, pharmacy, distanceKm } = item;

  const statusInfo = getStatusBadge(medicine.status, medicine.quantity);
  const formattedDistance = formatDistance(distanceKm);
  const directionsUrl = getGoogleMapsDirectionsUrl(
    pharmacy.latitude,
    pharmacy.longitude,
    userLocation?.latitude,
    userLocation?.longitude
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-brand-300/80 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {/* Subtle top ambient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        medicine.quantity === 0 || medicine.status === 'Out of Stock'
          ? 'bg-rose-500'
          : medicine.quantity <= 10 || medicine.status === 'Low Stock'
          ? 'bg-amber-500'
          : 'bg-teal-500'
      }`} />

      <div>
        {/* Top Header: Pharmacy Identity & Verified Badge */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white transition-all">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate group-hover:text-brand-700 transition-colors">
                  {pharmacy.name}
                </h3>
                <span
                  title="Verified Retail Pharmacy"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/70"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {pharmacy.city ? `${pharmacy.city}${pharmacy.pincode ? ` • ${pharmacy.pincode}` : ''}` : pharmacy.address}
              </p>
            </div>
          </div>

          {/* Proximity Distance Tag */}
          {distanceKm !== null && distanceKm !== undefined && (
            <div className="shrink-0 text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                📏 {formattedDistance}
              </span>
            </div>
          )}
        </div>

        {/* Medicine Name, Strength & Salt formula */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-2">
              <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {medicine.medicineName}
              </h4>
              {medicine.strength && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                  {medicine.strength}
                </span>
              )}
            </div>

            {/* Availability Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'currentColor' }} />
              {statusInfo.label}
            </span>
          </div>

          {medicine.genericName && (
            <p className="text-xs text-slate-500 font-medium">
              Salt: <span className="text-slate-700">{medicine.genericName}</span>
            </p>
          )}

          {medicine.category && (
            <div className="pt-1">
              <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {medicine.category}
              </span>
            </div>
          )}
        </div>

        {/* Stock & Pricing Details Box */}
        <div className="mt-4 p-4 bg-slate-50/90 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Available Units
            </span>
            <div className="font-extrabold text-slate-800 text-base flex items-baseline gap-1">
              {medicine.quantity > 0 ? (
                <>
                  <span>{medicine.quantity}</span>
                  <span className="text-xs font-medium text-slate-500">packs in stock</span>
                </>
              ) : (
                <span className="text-rose-600 font-bold text-sm">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="border-l border-slate-200/60 pl-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Retail Price
            </span>
            <span className="font-black text-brand-700 text-lg">
              {formatCurrency(medicine.price)}
            </span>
          </div>
        </div>

        {/* Store Logistics: Full Address, Operating Hours & Update Stamp */}
        <div className="mt-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed text-slate-600">{pharmacy.address}</span>
          </div>

          {(pharmacy.openingTime || pharmacy.closingTime) && (
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Operating Hours: <strong className="text-slate-700">{pharmacy.openingTime || '08:00 AM'} – {pharmacy.closingTime || '10:00 PM'}</strong>
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100">
            <span>Last stock update:</span>
            <span className="font-semibold text-slate-600">
              {formatRelativeTime(medicine.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Get Directions & Call Pharmacy */}
      <div className="mt-5 pt-3 grid grid-cols-2 gap-3">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition-all text-center"
        >
          <Navigation className="w-4 h-4 text-brand-600" />
          Get Directions
        </a>

        {pharmacy.phone ? (
          <a
            href={`tel:${pharmacy.phone}`}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-md shadow-teal-600/20 transition-all text-center"
          >
            <Phone className="w-4 h-4" />
            Call Pharmacy
          </a>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-400 bg-slate-100 cursor-not-allowed"
          >
            <Phone className="w-4 h-4" />
            No Phone Listed
          </button>
        )}
      </div>
    </div>
  );
}
