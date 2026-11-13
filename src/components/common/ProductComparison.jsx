import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Scale,
  Award,
  Layers,
} from 'lucide-react';
import { getLowestPrice } from '../../data/products';
import { getCatalogProducts } from '../../services/productService';
import { useComparison } from '../../context/ComparisonContext';
import { useToast } from '../../context/ToastContext';

export function ProductComparison({
  products = [],
  onRemove = null,
  onAdd = null,
  className = '',
}) {
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const { comparisonItems, addToComparison, removeFromComparison, clearComparison } = useComparison();
  const { toast } = useToast();

  const currentProducts = products.length > 0 ? products : comparisonItems;

  // Determine Best Value Option
  const bestValueProduct = React.useMemo(() => {
    if (currentProducts.length < 2) return null;
    let best = currentProducts[0];
    let bestScore = -Infinity;

    currentProducts.forEach((p) => {
      const { price, savings } = getLowestPrice(p);
      // Value score based on rating, discount %, and absolute savings
      const discountPct = (savings / p.originalPrice) * 100;
      const score = (p.rating * 20) + (discountPct * 1.5) - (price / 50000);
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    });
    return best;
  }, [currentProducts]);

  // Specification attributes to compare
  const specFields = [
    { key: 'price', label: 'Lowest Online Price', isCustom: true },
    { key: 'bestRetailer', label: 'Best Deal Retailer', isCustom: true },
    { key: 'rating', label: 'Customer Rating', isCustom: true },
    { key: 'brand', label: 'Brand & Category', isCustom: true },
    { key: 'processor', label: 'Processor / Chipset', path: 'specs.processor' },
    { key: 'ram', label: 'RAM / Memory', path: 'specs.ram' },
    { key: 'storage', label: 'Internal Storage', path: 'specs.storage' },
    { key: 'display', label: 'Display & Resolution', path: 'specs.display' },
    { key: 'battery', label: 'Battery & Endurance', path: 'specs.battery' },
    { key: 'camera', label: 'Camera Setup', path: 'specs.camera' },
    { key: 'os', label: 'Operating System', path: 'specs.os' },
    { key: 'weight', label: 'Device Weight', path: 'specs.weight' },
    { key: 'connectivity', label: 'Wireless & Ports', path: 'specs.connectivity' },
    { key: 'warranty', label: 'Warranty & Support', path: 'specs.warranty' },
  ];

  // Helper to extract nested spec values
  const getVal = (prod, field) => {
    if (field.isCustom) {
      if (field.key === 'price') {
        const { price, savings } = getLowestPrice(prod);
        return `₹${price.toLocaleString('en-IN')}`;
      }
      if (field.key === 'bestRetailer') {
        const { store } = getLowestPrice(prod);
        return store?.name || 'Amazon';
      }
      if (field.key === 'rating') {
        return `${prod.rating} / 5 (${prod.reviewsCount} reviews)`;
      }
      if (field.key === 'brand') {
        return `${prod.brand} • ${prod.category}`;
      }
    }
    const val = field.path.split('.').reduce((acc, part) => acc && acc[part], prod);
    return val || '—';
  };

  // Check if all values in row are identical
  const areValuesDifferent = (field) => {
    if (currentProducts.length <= 1) return false;
    const firstVal = getVal(currentProducts[0], field);
    return currentProducts.some((p) => getVal(p, field) !== firstVal);
  };

  const filteredFields = onlyDifferences
    ? specFields.filter(areValuesDifferent)
    : specFields;

  // Available products that aren't yet in comparison
  const availableToAdd = getCatalogProducts().filter(
    (p) => !currentProducts.some((cp) => cp.id === p.id)
  );

  if (currentProducts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-electric-50 text-electric-600 flex items-center justify-center mx-auto mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-navy-950">No products selected for comparison</h3>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Add at least two products to see side-by-side technical specs, lowest online prices, and AI value rankings.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-950 text-white font-bold text-sm shadow-md hover:bg-navy-900 transition-all"
        >
          <span>Browse Products Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-electric-600" />
            <span className="font-extrabold text-navy-950 text-base">
              Comparing {currentProducts.length} of 4 Products
            </span>
          </div>

          {currentProducts.length < 4 && (
            <button
              type="button"
              onClick={() => setIsSelectorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-electric-50 text-electric-600 border border-electric-200 hover:bg-electric-100 font-bold text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Model</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Difference Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={onlyDifferences}
              onChange={(e) => setOnlyDifferences(e.target.checked)}
              className="w-4 h-4 rounded text-electric-600 focus:ring-electric-500 cursor-pointer"
            />
            <span>Highlight Differences Only</span>
          </label>

          <button
            type="button"
            onClick={clearComparison}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header with Product Cards */}
            <thead>
              <tr className="border-b border-slate-200">
                <th className="w-56 p-4 sm:p-5 text-left bg-slate-50/70 align-top">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Specs & Features
                  </span>
                  <p className="text-xs text-slate-500 font-normal mt-1">
                    Side-by-side hardware analysis & online pricing
                  </p>
                </th>

                {currentProducts.map((prod) => {
                  const { price, store, savings } = getLowestPrice(prod);
                  const isBest = bestValueProduct?.id === prod.id;

                  return (
                    <th
                      key={prod.id}
                      className={`min-w-[240px] max-w-[280px] p-4 sm:p-5 text-left align-top relative border-l border-slate-100 ${
                        isBest ? 'bg-electric-50/40' : 'bg-white'
                      }`}
                    >
                      {/* Best Value Badge */}
                      {isBest && (
                        <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-electric-600 text-white text-[11px] font-extrabold shadow-sm">
                          <Award className="w-3.5 h-3.5" />
                          <span>SmartShop Best Value</span>
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeFromComparison(prod.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Product Thumbnail */}
                      <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden mb-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-xs font-bold uppercase tracking-wider text-electric-600 mb-1">
                        {prod.brand}
                      </div>

                      <Link
                        to={`/product/${prod.id}`}
                        className="text-sm font-bold text-navy-950 hover:text-electric-600 line-clamp-2 block transition-colors"
                      >
                        {prod.name}
                      </Link>

                      <div className="mt-2.5 flex items-baseline gap-2">
                        <span className="text-lg font-black text-navy-950">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {savings > 0 && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Best price on <span className="font-bold text-navy-900">{store?.name}</span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Link
                          to={`/compare-prices/${prod.id}`}
                          className="py-1.5 px-2 text-center rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-[11px] font-semibold transition-colors"
                        >
                          View Deals
                        </Link>
                        <Link
                          to={`/product/${prod.id}`}
                          className="py-1.5 px-2 text-center rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                        >
                          Full Specs
                        </Link>
                      </div>
                    </th>
                  );
                })}

                {/* Empty Add Slot */}
                {currentProducts.length < 4 && (
                  <th className="min-w-[200px] p-6 text-center align-middle bg-slate-50/50 border-l border-dashed border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsSelectorOpen(true)}
                      className="w-full py-8 rounded-xl border-2 border-dashed border-slate-300 hover:border-electric-500 hover:bg-electric-50/50 flex flex-col items-center justify-center gap-2 group transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-electric-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-electric-600">
                        Add Product
                      </span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            {/* Spec Rows */}
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredFields.map((field) => {
                const isDifferent = areValuesDifferent(field);
                return (
                  <tr
                    key={field.key}
                    className={`transition-colors ${
                      isDifferent ? 'bg-amber-50/30 font-medium' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/60 align-middle">
                      <div className="flex items-center gap-1.5">
                        <span>{field.label}</span>
                        {isDifferent && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
                            title="Different across models"
                          />
                        )}
                      </div>
                    </td>

                    {currentProducts.map((prod) => {
                      const val = getVal(prod, field);
                      const isBestCol = bestValueProduct?.id === prod.id;

                      return (
                        <td
                          key={prod.id}
                          className={`p-4 sm:p-5 text-slate-800 border-l border-slate-100 align-middle ${
                            isBestCol ? 'bg-electric-50/20' : ''
                          }`}
                        >
                          {field.key === 'rating' ? (
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                              <span className="font-bold text-navy-950">{prod.rating}</span>
                              <span className="text-slate-400">({prod.reviewsCount} reviews)</span>
                            </div>
                          ) : field.key === 'price' ? (
                            <span className="text-base font-extrabold text-navy-950">{val}</span>
                          ) : field.key === 'bestRetailer' ? (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-electric-100 text-electric-800">
                              {val}
                            </span>
                          ) : (
                            <span className="leading-relaxed">{val}</span>
                          )}
                        </td>
                      );
                    })}

                    {currentProducts.length < 4 && <td className="bg-slate-50/30 border-l border-slate-100" />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Selector Modal to Add Item */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 bg-navy-950 text-white flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold">Select Product to Compare</h4>
                <p className="text-xs text-slate-300">Choose from available catalog models</p>
              </div>
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto divide-y divide-slate-100">
              {availableToAdd.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  All available catalog products are already in comparison!
                </div>
              ) : (
                availableToAdd.map((p) => {
                  const { price } = getLowestPrice(p);
                  return (
                    <div
                      key={p.id}
                      className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-electric-600 uppercase">
                            {p.brand} • {p.category}
                          </span>
                          <h5 className="text-sm font-bold text-navy-950 line-clamp-1">{p.name}</h5>
                          <span className="text-xs font-extrabold text-navy-950">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToComparison(p);
                          setIsSelectorOpen(false);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-electric-600 hover:bg-electric-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Add to Compare
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
