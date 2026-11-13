import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Star,
  CheckCircle2,
  Truck,
  ExternalLink,
  MapPin,
  Bot,
  Scale,
} from 'lucide-react';
import { getProductById } from '../services/productService';
import { getLowestPrice } from '../data/products';
import { PriceCard } from '../components/common/PriceCard';
import { useComparison } from '../context/ComparisonContext';
import { useCatalogVersion } from '../hooks/useCatalogVersion';

export function PriceComparisonPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToComparison, isInComparison } = useComparison();
  const navigate = useNavigate();
  const catalogVersion = useCatalogVersion();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const found = await getProductById(id);
      setProduct(found);
      setLoading(false);
    }
    load();
  }, [id, catalogVersion]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-electric-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-600">Aggregating live prices across Amazon, Flipkart & Croma...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-navy-950">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The requested product could not be found in our comparison catalog.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl bg-navy-950 text-white font-bold text-sm"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const { price: lowestPrice, store: lowestStore, savings: maxSavings } = getLowestPrice(product);
  const highestPrice = Math.max(...(product.onlineStores?.map((s) => s.price) || [lowestPrice]));
  const inComparison = isInComparison(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back breadcrumb */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>
      </div>

      {/* Hero Product Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left min-w-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-electric-600">
              <span>{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 mt-1 line-clamp-2">
              {product.name}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400">({product.reviewsCount} reviews)</span>
              </div>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Live Monitored</span>
            </div>
          </div>
        </div>

        {/* Best Deal Callout Right Box */}
        <div className="p-5 rounded-2xl bg-electric-50/80 border border-electric-200/80 text-center sm:text-right shrink-0 w-full sm:w-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-electric-700 block">
            Guaranteed Best Online Deal
          </span>
          <div className="flex items-baseline justify-center sm:justify-end gap-2 mt-1">
            <span className="text-3xl font-black text-navy-950">
              ₹{lowestPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-slate-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs font-bold text-emerald-600 mt-0.5">
            Save ₹{maxSavings.toLocaleString('en-IN')} on {lowestStore?.name}
          </p>

          <div className="mt-3 flex items-center justify-center sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => addToComparison(product)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                inComparison
                  ? 'bg-electric-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{inComparison ? 'In Comparison' : 'Add to Compare'}</span>
            </button>
            <Link
              to={`/product/${product.id}`}
              className="px-3 py-1.5 rounded-lg bg-navy-950 text-white text-xs font-bold hover:bg-navy-900"
            >
              Full Specs
            </Link>
          </div>
        </div>
      </div>

      {/* Online Retailer Cards (Amazon, Flipkart, Croma) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-navy-950">
              Retailer Side-by-Side Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Compare direct online prices, stock availability, and delivery guarantees across certified sellers.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            3 Major Platforms Analyzed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.onlineStores?.map((store) => (
            <PriceCard
              key={store.id}
              store={store}
              product={product}
              isBestPrice={store.price === lowestPrice}
              highestPrice={highestPrice}
            />
          ))}
        </div>
      </div>

      {/* Clean Comparison Matrix Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-navy-950">Online Retailer Comparison Matrix</h3>
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4 text-left">Platform</th>
                  <th className="p-4 text-left">Checkout Price</th>
                  <th className="p-4 text-left">Stock Status</th>
                  <th className="p-4 text-left">Estimated Delivery</th>
                  <th className="p-4 text-left">Bank & Exchange Offers</th>
                  <th className="p-4 text-right">Direct Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {product.onlineStores?.map((store) => {
                  const isLowest = store.price === lowestPrice;
                  return (
                    <tr
                      key={store.id}
                      className={isLowest ? 'bg-electric-50/30 font-medium' : 'hover:bg-slate-50/50'}
                    >
                      <td className="p-4 font-bold text-navy-950">
                        <div className="flex items-center gap-2">
                          <span>{store.name}</span>
                          {isLowest && (
                            <span className="px-1.5 py-0.2 rounded bg-electric-600 text-white font-extrabold text-[10px]">
                              BEST PRICE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-base font-black text-navy-950">
                          ₹{store.price.toLocaleString('en-IN')}
                        </span>
                        {store.savings > 0 && (
                          <span className="block text-[11px] text-emerald-600 font-semibold">
                            Save ₹{store.savings.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {store.stock}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-electric-600 shrink-0" />
                          <span>{store.delivery}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs text-xs">
                        {store.offers || 'Standard credit card discounts available.'}
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                            isLowest
                              ? 'bg-electric-600 hover:bg-electric-500 text-white shadow-glow-electric'
                              : 'bg-navy-950 hover:bg-navy-900 text-white'
                          }`}
                        >
                          <span>Visit {store.name}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Cross-Sell: Nearby Physical Stores & AI Assistant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Nearby Stores Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-start gap-4">
          <div className="p-3 rounded-xl bg-electric-50 text-electric-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-navy-950">
              Prefer Picking It Up in Person?
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              We checked physical stores within your city. Local authorized sellers have verified stock of {product.name.split('(')[0]} ready for immediate pickup.
            </p>
            <Link
              to={`/nearby?product=${product.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-950 text-xs font-bold transition-colors"
            >
              <span>View Local Stores & Inventory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* AI Assistant Question */}
        <div className="p-6 rounded-2xl bg-gradient-to-tr from-navy-950 to-navy-900 text-white shadow-card flex items-start gap-4">
          <div className="p-3 rounded-xl bg-electric-500/20 text-electric-300 border border-electric-400/30 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-white">
              Ask SmartShop AI About This Product
            </h4>
            <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
              Get an instant AI review: Is this the right time to buy? How does it compare to its closest rival?
            </p>
            <Link
              to={`/ai-assistant?q=${encodeURIComponent(
                `Tell me if ${product.name} is worth buying at ₹${lowestPrice.toLocaleString('en-IN')}`
              )}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-bold transition-colors shadow-glow-electric"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Advisor</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
