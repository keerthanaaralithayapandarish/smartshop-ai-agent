import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Sparkles, X, MessageSquare } from 'lucide-react';
import { ChatBot } from './ChatBot';

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide floating widget if user is already on the dedicated AI Assistant page
  if (location.pathname === '/ai-assistant') {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-navy-950 via-navy-900 to-electric-600 text-white shadow-xl hover:shadow-glow-electric border border-electric-400/30 transition-all duration-300 hover:scale-105"
            aria-label="Open AI Shopping Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-electric-300 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-navy-950 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-navy-950 rounded-full" />
            </div>
            <span className="text-xs font-black tracking-wide">Ask SmartShop AI</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-electric-500/40 text-electric-200">
              Live
            </span>
          </button>
        )}
      </div>

      {/* Floating Popover Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
            <ChatBot fullPage={false} className="border-0 shadow-none" />
          </div>
        </div>
      )}
    </>
  );
}
