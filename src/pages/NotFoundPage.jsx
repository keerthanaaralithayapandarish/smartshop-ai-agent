import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, Search, Bot } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-electric-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="max-w-md w-full text-center space-y-4 relative z-10 bg-white p-10 rounded-3xl border border-slate-200/90 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-electric-50 text-electric-600 mx-auto flex items-center justify-center shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-navy-950">404</h1>
        <h2 className="text-xl font-bold text-navy-950">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another section.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-navy-950 hover:bg-navy-900 shadow-md transition-all"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            <Search className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
