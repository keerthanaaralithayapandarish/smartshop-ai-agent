import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldAlert,
  Send,
  MapPin,
  Bot,
  Scale,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  Store,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success('Subscribed for real-time price drop alerts!', 'Price Alert Active');
    setEmail('');
  };

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo Data Disclaimer Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-navy-900/90 border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>National Hackathon Showcase Notice & Demo Transparency</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                SAMPLE DATA ONLY
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              All prices, retailer listings (Amazon.in, Flipkart, Croma), and physical store inventory levels shown on SmartShop AI are realistic sample data created for interface presentation and user testing. In production, these hook into live merchant scraping and retail partner ERP APIs.
            </p>
          </div>
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-900/80">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-600 to-cyan-500 flex items-center justify-center text-white shadow-glow-electric">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-white tracking-tight">SmartShop</span>
                <span className="text-2xl font-black text-electric-400">AI</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The next-generation AI shopping comparison platform. We scan online retailers (Amazon, Flipkart, Croma) and physical neighborhood stores so you always secure the guaranteed best deal.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-navy-900 text-slate-300 border border-navy-800">
                Amazon Aggregation
              </span>
              <span className="px-2.5 py-1 rounded-md bg-navy-900 text-slate-300 border border-navy-800">
                Flipkart Scraping
              </span>
              <span className="px-2.5 py-1 rounded-md bg-navy-900 text-slate-300 border border-navy-800">
                Croma Store Inventory
              </span>
              <span className="px-2.5 py-1 rounded-md bg-navy-900 text-slate-300 border border-navy-800">
                Local GPS Radar
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-electric-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-electric-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-electric-400 transition-colors">
                  Product Comparison
                </Link>
              </li>
              <li>
                <Link to="/nearby" className="hover:text-electric-400 transition-colors">
                  Nearby Store Finder
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-electric-400 transition-colors flex items-center gap-1.5 text-electric-300">
                  <Bot className="w-3.5 h-3.5" />
                  Ask SmartShop AI
                </Link>
              </li>
              <li>
                <Link to="/owner/login" className="hover:text-electric-400 transition-colors flex items-center gap-1.5 text-slate-400">
                  <Store className="w-3.5 h-3.5 text-electric-400" />
                  Store Owner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?category=Laptops" className="hover:text-electric-400 transition-colors">
                  Laptops & Ultrabooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=Smartphones" className="hover:text-electric-400 transition-colors">
                  AI Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Headphones" className="hover:text-electric-400 transition-colors">
                  ANC Headphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Smart Watches" className="hover:text-electric-400 transition-colors">
                  Smart Watches
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-electric-400 transition-colors">
                  Audio & Gadgets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Price Drop Alerts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Price Drop Alerts
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Get notified when top tech drops below your target price.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800 p-2.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>Alerts active! We will email you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-navy-900 border border-navy-800 text-white placeholder-slate-500 focus:outline-none focus:border-electric-500"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 rounded-lg bg-electric-600 hover:bg-electric-500 text-white flex items-center justify-center transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block">No spam, unsubscribe anytime.</span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} SmartShop AI Engine. Built for High-Performance Shopping.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-medium">Retailer Integrations:</span>
            <span className="text-slate-300">Amazon.in</span>
            <span className="text-slate-300">Flipkart</span>
            <span className="text-slate-300">Croma</span>
            <span className="text-slate-300">Reliance Digital</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
