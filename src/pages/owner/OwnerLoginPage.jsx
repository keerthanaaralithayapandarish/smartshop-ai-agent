import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { DEMO_OWNER, useOwnerAuth } from '../../context/OwnerAuthContext';
import { useToast } from '../../context/ToastContext';

export function OwnerLoginPage() {
  const { login, isOwner } = useOwnerAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOwner) navigate('/owner', { replace: true });
  }, [isOwner, navigate]);

  const submit = async (nextEmail, nextPassword) => {
    setErrorMsg('');
    setSubmitting(true);
    try {
      await login(nextEmail, nextPassword);
      toast.success('Store dashboard unlocked.', 'Owner signed in');
      navigate('/owner', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Enter the store owner email and password.');
      return;
    }
    submit(email.trim(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-4">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-navy-950">
          <Sparkles className="w-3.5 h-3.5 text-electric-600" />
          Back to SmartShop AI
        </Link>
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-950 via-navy-900 to-electric-600 text-white mx-auto flex items-center justify-center">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight">Store owner sign in</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage {DEMO_OWNER.storeName} inventory. Shoppers do not use this login.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Owner email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="owner@smartshop.ai"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600 focus:ring-4 focus:ring-electric-100 bg-slate-50/60"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-navy-950 hover:bg-navy-900 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {submitting ? 'Checking access...' : 'Open dashboard'}
            </button>
          </form>

          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setEmail(DEMO_OWNER.email);
              setPassword(DEMO_OWNER.password);
              submit(DEMO_OWNER.email, DEMO_OWNER.password);
            }}
            className="w-full p-3 rounded-xl bg-electric-50 border border-electric-200 text-left text-xs font-semibold text-navy-950 hover:bg-electric-100 flex items-center justify-between"
          >
            <span>Demo owner: {DEMO_OWNER.email} / {DEMO_OWNER.password}</span>
            <span className="px-2 py-0.5 rounded bg-electric-600 text-white text-[10px] font-bold">1-Click</span>
          </button>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New retailer?{' '}
              <Link
                to="/owner/register"
                className="font-bold text-electric-600 hover:text-electric-700"
              >
                Register your store
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
