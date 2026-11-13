import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role, loading, setDemoRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Authenticating user access..." />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-card text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Restricted</h2>
            <p className="text-sm text-slate-600 mt-2">
              Your account currently has the role <span className="font-bold text-slate-900 uppercase tracking-wider text-xs bg-slate-100 px-2 py-1 rounded-md">{role}</span>, which does not have permission to view this portal.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 text-left space-y-2.5">
            <p className="font-bold text-slate-700">Required Role:</p>
            <div className="flex gap-2 flex-wrap">
              {allowedRoles.map((r) => (
                <span key={r} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-teal-700 font-bold">
                  {r}
                </span>
              ))}
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              For testing and demonstration, you can switch your active session role below:
            </p>
            <div className="flex gap-2 pt-1 flex-wrap">
              {allowedRoles.includes('admin') && (
                <button
                  onClick={() => setDemoRole('admin')}
                  className="bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-brand-200"
                >
                  Switch Role to Admin
                </button>
              )}
              {allowedRoles.includes('pharmacy_owner') && (
                <button
                  onClick={() => setDemoRole('pharmacy_owner')}
                  className="bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-teal-200"
                >
                  Switch Role to Pharmacy Owner
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <Home className="w-4 h-4" /> Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
