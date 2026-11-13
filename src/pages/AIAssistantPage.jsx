import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { ChatBot } from '../components/common/ChatBot';

export function AIAssistantPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-electric-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-500/20 text-electric-300 text-xs font-bold border border-electric-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Conversational Shopping Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Ask SmartShop AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your personal advisor for electronic gear. Ask for budget recommendations, camera showdowns, lowest retailer deals, and nearby store stock availability.
          </p>
        </div>

        {/* Gemini Engine Status Pill */}
        <div className="p-3.5 rounded-2xl bg-navy-900/90 border border-navy-800 text-xs shrink-0 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-electric-600/30 text-electric-400 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">AI Core</span>
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Gemini 1.5 Architecture
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout: Chat Interface + Side Assistance Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Column: Full-Height Chat Interface */}
        <div className="lg:col-span-8">
          <ChatBot fullPage={true} initialQuery={initialQuery} />
        </div>

        {/* Right Column: AI Capabilities & Guidance */}
        <div className="lg:col-span-4 space-y-5">
          {/* Capability Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
            <h3 className="font-bold text-navy-950 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-electric-600" />
              <span>What You Can Ask SmartShop AI</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-navy-950 block">💰 Budget Hardware Filtering</span>
                <p className="text-slate-500 text-[11px]">
                  "Suggest a laptop under ₹60,000 for coding & multitasking"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-navy-950 block">📸 Spec & Feature Shootouts</span>
                <p className="text-slate-500 text-[11px]">
                  "Which mobile has the best camera between iPhone 16 Pro and Galaxy S24 Ultra?"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-navy-950 block">🏷️ Lowest Price Detection</span>
                <p className="text-slate-500 text-[11px]">
                  "Where is the cheapest place to buy the Sony WH-1000XM5 online right now?"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-navy-950 block">📍 Physical Inventory Radar</span>
                <p className="text-slate-500 text-[11px]">
                  "Which nearby store in Indiranagar has the MacBook Air M3 in stock today?"
                </p>
              </div>
            </div>
          </div>

          {/* Engine Technical Note */}
          <div className="p-5 rounded-2xl bg-navy-950 text-white shadow-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-electric-400">
              <Cpu className="w-4 h-4" />
              <span>Developer & API Ready</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              SmartShop AI combines a local semantic product catalog engine with standard Google Gemini API hooks via <code className="px-1 py-0.5 rounded bg-navy-900 text-electric-300 text-[11px]">VITE_GEMINI_API_KEY</code>.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Product Cards embedded directly in AI responses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
