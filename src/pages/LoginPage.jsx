import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Signed in successfully!', 'Welcome back');
      navigate(redirectPath);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative hero-glow-bg">
      <div className="max-w-md w-full relative z-10 space-y-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-950 via-navy-900 to-electric-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-electric-600/25">
              <Sparkles className="w-7 h-7 text-electric-300" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">
              Sign In to SmartShop AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Access real-time price tracking, saved comparisons & AI shopping history.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@smartshop.ai"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-electric-600 hover:text-electric-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-navy-950 hover:bg-navy-900 shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Store Owner Redirection Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs font-bold text-navy-950 flex items-center justify-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-electric-600" />
              <span>Store Owner / Retailer?</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Manage your store inventory, stock, and live store prices.
            </p>
            <div className="pt-1 flex items-center justify-center gap-3 text-xs font-bold">
              <Link to="/owner/login" className="text-electric-600 hover:text-electric-700">
                Owner Login →
              </Link>
              <span className="text-slate-300">•</span>
              <Link to="/owner/register" className="text-electric-600 hover:text-electric-700">
                Register Store →
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-1">
            <Link to="/" className="text-slate-500 hover:text-navy-950 font-medium">
              ← Return to public shopping catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
