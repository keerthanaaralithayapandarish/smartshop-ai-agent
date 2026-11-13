import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Scale,
  Sparkles,
  MapPin,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getLowestPrice } from '../../data/products';
import { useComparison } from '../../context/ComparisonContext';

export function ProductCard({ product, showCompareButton = true }) {
  const { isInComparison, addToComparison } = useComparison();
  const navigate = useNavigate();

  if (!product) return null;

  const { price, store, savings } = getLowestPrice(product);
  const discountPercent = Math.round((savings / product.originalPrice) * 100);
  const inComparison = isInComparison(product.id);

  // Retailer logo styling helper
  const getRetailerColor = (name) => {
    switch (name?.toLowerCase()) {
      case 'amazon':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'flipkart':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'croma':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-electric-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-navy-950 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-electric-300" />
              {product.badge}
            </span>
          )}
          {discountPercent > 5 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" />
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick Compare Action */}
        {showCompareButton && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToComparison(product);
            }}
            className={`pointer-events-auto p-2 rounded-xl transition-all shadow-sm ${
              inComparison
                ? 'bg-electric-600 text-white shadow-glow-electric scale-105'
                : 'bg-white/95 backdrop-blur-md text-slate-600 hover:text-navy-950 hover:bg-white border border-slate-200'
            }`}
            title={inComparison ? 'In Comparison Tray (Click to remove)' : 'Add to Compare'}
          >
            <Scale className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative block w-full pt-[68%] bg-slate-50/70 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold uppercase tracking-wider text-electric-600">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-navy-950 text-sm sm:text-base leading-snug line-clamp-2 hover:text-electric-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Key Specs Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
            {product.specs?.processor && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 font-medium truncate max-w-[170px]">
                {product.specs.processor.split('(')[0]}
              </span>
            )}
            {product.specs?.ram && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 font-medium">
                {product.specs.ram.split(' ')[0]} RAM
              </span>
            )}
            {product.specs?.storage && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 font-medium">
                {product.specs.storage.split(' ')[0]}
              </span>
            )}
            {product.specs?.display && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 font-medium">
                {product.specs.display.split(' ')[0]} Display
              </span>
            )}
          </div>
        </div>

        {/* Price & Retailer Section */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lowest Online Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-navy-950">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > price && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {/* Lowest Retailer Tag */}
            {store && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Best on</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${getRetailerColor(
                    store.name
                  )}`}
                >
                  {store.name}
                </span>
              </div>
            )}
          </div>

          {/* Retailer Count & Physical store indicator */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                {product.onlineStores?.length || 3} Online Retailers
              </span>
            </div>
            {product.nearbyStoreIds && product.nearbyStoreIds.length > 0 && (
              <Link
                to={`/nearby?product=${product.id}`}
                className="flex items-center gap-1 text-electric-600 hover:text-electric-700 font-semibold"
              >
                <MapPin className="w-3 h-3" />
                <span>In Local Stores</span>
              </Link>
            )}
          </div>

          {/* Store Name & Stock Availability */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 min-w-0 pr-2">
              <span className="text-slate-400 font-medium">Store:</span>
              <span className="font-bold text-navy-950 truncate max-w-[130px]" title={store?.name || 'Store'}>
                {store?.name || 'Local Store'}
              </span>
            </div>

            {store?.stockStatus === 'out_of_stock' || store?.stock === 'Out of Stock' ? (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Out of Stock
              </span>
            ) : store?.stockStatus === 'low_stock' || store?.stock === 'Limited Stock' ? (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Low Stock
              </span>
            ) : (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                In Stock
              </span>
            )}
          </div>

          {/* Bottom Card Actions */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <Link
              to={`/compare-prices/${product.id}`}
              className="py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 text-center hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              Compare Prices
            </Link>
            <Link
              to={`/product/${product.id}`}
              className="py-2 px-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold text-center shadow-xs flex items-center justify-center gap-1 transition-all group/btn"
            >
              <span>View Specs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
