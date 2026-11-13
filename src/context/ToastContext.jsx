import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000, title = '' }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration, title };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, title = 'Success') => addToast({ message, title, type: 'success' }),
    error: (message, title = 'Error') => addToast({ message, title, type: 'error', duration: 6000 }),
    warning: (message, title = 'Warning') => addToast({ message, title, type: 'warning', duration: 5000 }),
    info: (message, title = 'Notice') => addToast({ message, title, type: 'info' }),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transform transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              item.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/60'
                : item.type === 'error'
                ? 'bg-rose-950/90 text-rose-100 border-rose-700/60'
                : item.type === 'warning'
                ? 'bg-amber-950/90 text-amber-100 border-amber-700/60'
                : 'bg-slate-900/90 text-slate-100 border-slate-700/60'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {item.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {item.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            <div className="flex-1 min-w-0">
              {item.title && <div className="text-sm font-semibold tracking-wide mb-0.5">{item.title}</div>}
              <div className="text-xs sm:text-sm opacity-90 leading-relaxed break-words">{item.message}</div>
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="shrink-0 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    ...context.toast,
    toast: context.toast,
    addToast: context.addToast,
    removeToast: context.removeToast,
  };
}
