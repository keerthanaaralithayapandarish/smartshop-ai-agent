import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useOwnerAuth } from '../../context/OwnerAuthContext';
import { useToast } from '../../context/ToastContext';

export function OwnerRegisterPage() {
  const { registerOwner, isOwner } = useOwnerAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    ownerName: '',
    storeName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOwner) navigate('/owner', { replace: true });
  }, [isOwner, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    if (
      !form.ownerName.trim() ||
      !form.storeName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.address.trim()
    ) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await registerOwner(form);
      toast.success(
        `${form.storeName} is now registered. Welcome to your store inventory dashboard!`,
        'Store Registered'
      );
      navigate('/owner', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Could not complete store registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-xl w-full space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-950"
        >
          <Sparkles className="w-3.5 h-3.5 text-electric-600" />
          Back to SmartShop AI
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-950 via-navy-900 to-electric-600 text-white mx-auto flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-electric-300" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
              Register Your Store
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Join the SmartShop AI local retail radar. Publish verified in-store inventory and prices to nearby customers.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Owner Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={form.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Store / Retailer Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={form.storeName}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                    placeholder="e.g. Apex Digital Megastore"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Store Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="store@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dashboard Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Physical Store Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Shop No., Street, Landmark, Area, Bengaluru, Karnataka"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-navy-950 hover:bg-navy-900 flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-md mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Store...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an owner account?{' '}
              <Link
                to="/owner/login"
                className="font-bold text-electric-600 hover:text-electric-700"
              >
                Sign in to dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
