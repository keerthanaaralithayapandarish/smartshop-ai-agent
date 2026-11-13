import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, Key, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { isFirebaseConfigured, getFirebaseConfig, saveFirebaseConfigOverride, clearFirebaseConfigOverride } from '../../firebase/config';
import { useToast } from '../../context/ToastContext';

export function FirebaseSetupModal({ isOpen, onClose }) {
  const currentConfig = getFirebaseConfig();
  const toast = useToast();

  const [formData, setFormData] = useState({
    apiKey: currentConfig.apiKey || '',
    authDomain: currentConfig.authDomain || '',
    projectId: currentConfig.projectId || '',
    storageBucket: currentConfig.storageBucket || '',
    messagingSenderId: currentConfig.messagingSenderId || '',
    appId: currentConfig.appId || '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.apiKey || !formData.projectId) {
      toast.error('API Key and Project ID are required.');
      return;
    }
    saveFirebaseConfigOverride(formData);
    toast.success('Firebase configuration saved! Reloading application...');
  };

  const handleClear = () => {
    clearFirebaseConfigOverride();
    toast.info('Firebase configuration reset to environment defaults.');
  };

  const copyEnvSample = () => {
    const envText = `VITE_FIREBASE_API_KEY=${formData.apiKey || 'your_api_key'}
VITE_FIREBASE_AUTH_DOMAIN=${formData.authDomain || 'your_project.firebaseapp.com'}
VITE_FIREBASE_PROJECT_ID=${formData.projectId || 'your_project_id'}
VITE_FIREBASE_STORAGE_BUCKET=${formData.storageBucket || 'your_project.appspot.com'}
VITE_FIREBASE_MESSAGING_SENDER_ID=${formData.messagingSenderId || '1234567890'}
VITE_FIREBASE_APP_ID=${formData.appId || '1:1234567890:web:abc123'}`;
    navigator.clipboard.writeText(envText);
    toast.success('Environment variables copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Firebase Configuration</h2>
              <p className="text-xs text-slate-300">Live Firebase & Cloud Firestore Connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              {isFirebaseConfigured ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Firebase Live Backend Connected
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Firebase Configuration Pending
                  </span>
                </>
              )}
            </div>
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
            >
              Open Firebase Console <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            You can configure your Firebase keys by editing the project's <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">.env</code> file, or by entering your web credentials below directly in the browser.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                API Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="AIzaSy..."
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                placeholder="medifinder-app"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                name="authDomain"
                value={formData.authDomain}
                onChange={handleChange}
                placeholder="medifinder-app.firebaseapp.com"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage Bucket
              </label>
              <input
                type="text"
                name="storageBucket"
                value={formData.storageBucket}
                onChange={handleChange}
                placeholder="medifinder-app.appspot.com"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Messaging Sender ID
              </label>
              <input
                type="text"
                name="messagingSenderId"
                value={formData.messagingSenderId}
                onChange={handleChange}
                placeholder="109823472918"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                App ID
              </label>
              <input
                type="text"
                name="appId"
                value={formData.appId}
                onChange={handleChange}
                placeholder="1:109823472918:web:89a1b..."
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyEnvSample}
                className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors font-medium"
              >
                <Copy className="w-3.5 h-3.5" /> Copy .env Template
              </button>
              {localStorage.getItem('MEDIFINDER_FIREBASE_CONFIG') && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors font-medium"
                >
                  Reset Override
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Save & Connect
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
