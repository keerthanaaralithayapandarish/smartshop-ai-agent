import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  UserPlus,
  LogIn,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useOwnerAuth } from '../../context/OwnerAuthContext';

export function OwnerPortalPage() {
  const { isOwner, owner } = useOwnerAuth();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative bg-slate-50">
      <div className="max-w-4xl w-full space-y-8">
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-950 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-electric-600" />
            Back to SmartShop AI
          </Link>

          {isOwner && (
            <Link
              to="/owner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Signed in as {owner?.storeName || 'Owner'} — Open Dashboard →
            </Link>
          )}
        </div>

        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-950 via-navy-900 to-electric-600 text-white mx-auto flex items-center justify-center shadow-xl shadow-electric-600/20">
            <Store className="w-8 h-8 text-electric-300" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-100/80 text-electric-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-electric-600" />
            Merchant & Retailer Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight">
            Store Owner Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Welcome to the SmartShop AI Retail Network. List your store inventory, set live competitive prices, and connect directly with local tech buyers.
          </p>
        </div>

        {/* Two Main Options: 1. Register Your Store, 2. Owner Login */}
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          {/* Option 1: Register Your Store */}
          <div className="relative bg-white rounded-3xl p-7 sm:p-8 border-2 border-slate-200/90 shadow-card hover:border-electric-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-electric-50 text-electric-600 border border-electric-200/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserPlus className="w-6 h-6 text-electric-600" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-electric-600 block">
                  New Retail Partner
                </span>
                <h2 className="text-2xl font-black text-navy-950 mt-1">
                  Register Your Store
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Create a verified store profile in under 2 minutes. Add your store details, physical location, and begin publishing products to customer searches.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant demo registration with localStorage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Featured in Nearby Store Radar</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Integrated Barcode Inventory Scanner</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/owner/register"
                className="w-full py-3.5 px-6 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all group-hover:bg-electric-600"
              >
                <span>Register Your Store</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Option 2: Owner Login */}
          <div className="relative bg-white rounded-3xl p-7 sm:p-8 border-2 border-slate-200/90 shadow-card hover:border-navy-900 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-950 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LogIn className="w-6 h-6 text-navy-900" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Existing Merchant
                </span>
                <h2 className="text-2xl font-black text-navy-950 mt-1">
                  Owner Login
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sign in to your merchant dashboard to manage in-store products, update pricing, restock units, and view live inventory alerts.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-electric-600 shrink-0" />
                  <span>Real-time price & stock adjustment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-electric-600 shrink-0" />
                  <span>Automatic Low Stock alerts (below 5 units)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-electric-600 shrink-0" />
                  <span>Camera & manual barcode quick lookup</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/owner/login"
                className="w-full py-3.5 px-6 rounded-xl border-2 border-navy-950 hover:bg-navy-950 hover:text-white text-navy-950 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Owner Login</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle trust footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Store owner operations are kept fully separate from customer browsing.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
