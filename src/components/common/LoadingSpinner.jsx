import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-500">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-teal-600`} />
      {text && <p className="text-xs sm:text-sm font-semibold tracking-wide animate-pulse">{text}</p>}
    </div>
  );
}

export function MedicineCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="h-7 bg-slate-200 rounded-lg w-2/3"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
        </div>
        <div className="h-7 bg-slate-200 rounded-full w-24"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
      </div>
      <div className="flex gap-3 pt-2">
        <div className="h-10 bg-slate-200 rounded-2xl flex-1"></div>
        <div className="h-10 bg-slate-200 rounded-2xl flex-1"></div>
      </div>
    </div>
  );
}
