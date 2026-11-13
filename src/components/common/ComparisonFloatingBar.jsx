import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useComparison } from '../../context/ComparisonContext';

export function ComparisonFloatingBar() {
  const { comparisonItems, removeFromComparison, clearComparison, isBarOpen, setIsBarOpen } = useComparison();
  const location = useLocation();

  // Hide on compare page or if tray is empty or minimized
  if (location.pathname === '/compare' || comparisonItems.length === 0 || !isBarOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-navy-950/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-navy-800 p-3 sm:p-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-electric-400 shrink-0">
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
            <span className="px-1.5 py-0.2 rounded-full bg-electric-600 text-white text-[10px]">
              {comparisonItems.length}/4
            </span>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {comparisonItems.map((prod) => (
              <div
                key={prod.id}
                className="relative group w-10 h-10 rounded-lg bg-white p-0.5 border border-slate-700 shrink-0"
                title={prod.name}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeFromComparison(prod.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={clearComparison}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-lg text-xs"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to="/compare"
            className="px-4 py-2 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-bold shadow-glow-electric transition-all flex items-center gap-1.5"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsBarOpen(false)}
            className="p-1 text-slate-400 hover:text-white ml-1"
            title="Minimize"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
