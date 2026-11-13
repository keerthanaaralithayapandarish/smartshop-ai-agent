import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  Plus,
  RefreshCw,
  Award,
} from 'lucide-react';
import { ProductComparison } from '../components/common/ProductComparison';
import { useComparison } from '../context/ComparisonContext';
import { getCatalogProducts } from '../services/productService';

export function ComparisonPage() {
  const { comparisonItems, addToComparison, clearComparison } = useComparison();

  // Preset quick comparisons for judges & shoppers
  const comparisonPresets = [
    {
      title: 'Flagship Laptops: MacBook Air M3 vs Dell XPS 13',
      productIds: ['macbook-air-m3-13', 'dell-xps-13-9340'],
      category: 'Laptops',
    },
    {
      title: 'Supreme Cameras: iPhone 16 Pro vs Galaxy S24 Ultra',
      productIds: ['iphone-16-pro', 'samsung-galaxy-s24-ultra'],
      category: 'Smartphones',
    },
    {
      title: 'Flagship ANC: Sony WH-1000XM5 vs Bose QC Ultra',
      productIds: ['sony-wh-1000xm5', 'bose-quietcomfort-ultra'],
      category: 'Headphones',
    },
  ];

  const handleLoadPreset = (productIds) => {
    clearComparison();
    productIds.forEach((id) => {
      const prod = getCatalogProducts().find((p) => p.id === id);
      if (prod) addToComparison(prod);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-electric-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-500/20 text-electric-300 text-xs font-bold border border-electric-400/30">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Hardware & Pricing Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Product Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select 2 to 4 devices to inspect processor performance, memory, battery endurance, display panels, and lowest verified online prices.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="p-3.5 rounded-2xl bg-navy-900/90 border border-navy-800 text-xs shrink-0 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold">Selected Models</span>
            <span className="text-lg font-black text-white">{comparisonItems.length} of 4</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-electric-600/30 text-electric-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Preset Quick-Compare Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          One-Click Head-to-Head Presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {comparisonPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadPreset(preset.productIds)}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-electric-300 hover:bg-electric-50/50 text-left transition-all shadow-xs group"
            >
              <span className="text-[10px] font-bold uppercase text-electric-600">
                {preset.category}
              </span>
              <h4 className="text-xs font-bold text-navy-950 group-hover:text-electric-700 transition-colors line-clamp-1 mt-0.5">
                {preset.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Component */}
      <ProductComparison />
    </div>
  );
}
