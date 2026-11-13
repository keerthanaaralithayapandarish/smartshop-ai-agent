import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function PriceCard({
  store,
  product,
  isBestPrice = false,
  highestPrice = 0,
}) {
  const { toast } = useToast();
  const [redirecting, setRedirecting] = useState(false);

  if (!store) return null;

  const savingsVsHighest = highestPrice > store.price ? highestPrice - store.price : 0;

  const getRetailerMeta = (name) => {
    switch (name?.toLowerCase()) {
      case 'amazon':
        return {
          badgeBg: 'bg-amber-500',
          textColor: 'text-amber-900',
          borderHover: 'hover:border-amber-400',
          tag: 'Amazon Verified Merchant',
          tagBg: 'bg-amber-100 text-amber-800',
          iconText: 'a',
        };
      case 'flipkart':
        return {
          badgeBg: 'bg-blue-600',
          textColor: 'text-blue-900',
          borderHover: 'hover:border-blue-400',
          tag: 'Flipkart Plus Assured',
          tagBg: 'bg-blue-100 text-blue-800',
          iconText: 'f',
        };
      case 'croma':
        return {
          badgeBg: 'bg-emerald-600',
          textColor: 'text-emerald-900',
          borderHover: 'hover:border-emerald-400',
          tag: 'Tata Croma Official',
          tagBg: 'bg-emerald-100 text-emerald-800',
          iconText: 'c',
        };
      default:
        return {
          badgeBg: 'bg-slate-700',
          textColor: 'text-slate-900',
          borderHover: 'hover:border-slate-400',
          tag: 'Verified Online Partner',
          tagBg: 'bg-slate-100 text-slate-800',
          iconText: 'o',
        };
    }
  };

  const meta = getRetailerMeta(store.name);

  const handleVisitStore = () => {
    setRedirecting(true);
    toast.info(
      `Redirecting to ${store.name} demo listing with tracked Best Price coupon applied!`,
      `Opening ${store.name}`
    );
    setTimeout(() => {
      window.open(store.url, '_blank', 'noopener,noreferrer');
      setRedirecting(false);
    }, 400);
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between ${
        isBestPrice
          ? 'border-2 border-electric-600 shadow-xl ring-4 ring-electric-50'
          : `border-slate-200/90 shadow-card hover:shadow-card-hover ${meta.borderHover}`
      }`}
    >
      {/* Best Price Ribbon Badge */}
      {isBestPrice && (
        <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-electric-600 to-sky-500 text-white text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Guaranteed Best Price</span>
        </div>
      )}

      <div>
        {/* Retailer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl ${meta.badgeBg} text-white flex items-center justify-center font-black text-xl shadow-sm`}
            >
              {meta.iconText.toUpperCase()}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-navy-950 flex items-center gap-2">
                {store.name}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.tagBg}`}>
                  {meta.tag}
                </span>
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {store.lastUpdated || 'Updated 10m ago'}
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">{store.stock}</span>
              </div>
            </div>
          </div>

          {/* Savings Callout */}
          {savingsVsHighest > 0 && (
            <div className="hidden sm:block text-right">
              <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                Save vs Other Stores
              </span>
              <span className="text-sm font-extrabold text-emerald-600">
                +₹{savingsVsHighest.toLocaleString('en-IN')} Saved
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Offers */}
        <div className="py-4">
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-black text-navy-950">
              ₹{store.price.toLocaleString('en-IN')}
            </span>
            {store.originalPrice > store.price && (
              <span className="text-sm text-slate-400 line-through font-medium">
                ₹{store.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {store.savings > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
                Save ₹{store.savings.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Delivery & Shipping Info */}
          <div className="mt-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Truck className="w-4 h-4 text-electric-600 shrink-0" />
              <span className="font-medium">{store.delivery}</span>
            </div>

            {store.offers && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{store.offers}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>7-Day Return / Replacement</span>
        </div>

        <button
          type="button"
          onClick={handleVisitStore}
          disabled={redirecting}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all ${
            isBestPrice
              ? 'bg-electric-600 hover:bg-electric-700 text-white shadow-glow-electric'
              : 'bg-navy-900 hover:bg-navy-950 text-white'
          }`}
        >
          <span>{redirecting ? 'Opening...' : `Visit ${store.name}`}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
