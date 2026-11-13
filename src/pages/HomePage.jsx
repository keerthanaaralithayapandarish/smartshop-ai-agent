import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Cpu,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Layers,
  Bot,
} from 'lucide-react';
import { SearchBar } from '../components/common/SearchBar';
import { ProductCard } from '../components/common/ProductCard';
import { CATEGORIES } from '../data/categories';
import { getTrendingProducts, getFeaturedDeals } from '../services/productService';
import { getLowestPrice } from '../data/products';
import { useCatalogVersion } from '../hooks/useCatalogVersion';

export function HomePage() {
  const catalogVersion = useCatalogVersion();
  const trendingProducts = useMemo(() => getTrendingProducts(6), [catalogVersion]);
  const featuredDeals = useMemo(() => getFeaturedDeals(3), [catalogVersion]);
  const navigate = useNavigate();

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-6 h-6" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      case 'Watch':
        return <Watch className="w-6 h-6" />;
      default:
        return <Cpu className="w-6 h-6" />;
    }
  };

  const sampleAiQuestions = [
    'Suggest a laptop under ₹60,000',
    'Which mobile has the best camera?',
    'Compare MacBook Air M3 and Dell XPS 13',
    'Find the cheapest iPhone',
    'Which nearby store has Sony WH-1000XM5?',
    'Recommend headphones under ₹2,000',
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden hero-glow-bg">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Top Innovation Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-50 border border-electric-200/80 text-electric-700 text-xs sm:text-sm font-bold shadow-xs animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-electric-600" />
            <span>Next-Gen Multi-Retailer Price Engine & Local GPS Radar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-electric-600" />
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">Amazon • Flipkart • Croma</span>
          </div>

          {/* Hero Headings */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-navy-950 tracking-tight leading-[1.1]">
              Shop Smarter.{' '}
              <span className="text-gradient-electric">Save More.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Compare prices, discover better deals and find products near you with AI.
            </p>
          </div>

          {/* Large Hero Search Bar */}
          <div className="pt-4 max-w-3xl mx-auto">
            <SearchBar size="large" showQuickTags={true} />
          </div>

          {/* Trust Metrics / Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            <div className="p-3 rounded-xl bg-white/70 backdrop-blur-xs border border-slate-200/80 shadow-xs">
              <div className="text-lg sm:text-xl font-black text-navy-950">₹4.8 Cr+</div>
              <div className="text-[11px] font-medium text-slate-500">Shopper Savings</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 backdrop-blur-xs border border-slate-200/80 shadow-xs">
              <div className="text-lg sm:text-xl font-black text-electric-600">3 Top Retailers</div>
              <div className="text-[11px] font-medium text-slate-500">Amazon, Flipkart, Croma</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 backdrop-blur-xs border border-slate-200/80 shadow-xs">
              <div className="text-lg sm:text-xl font-black text-navy-950">50+ Local Stores</div>
              <div className="text-[11px] font-medium text-slate-500">Real-Time Inventory</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 backdrop-blur-xs border border-slate-200/80 shadow-xs">
              <div className="text-lg sm:text-xl font-black text-emerald-600">100% Free</div>
              <div className="text-[11px] font-medium text-slate-500">No Hidden Markup</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-electric-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Browse Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Popular Product Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Scan hundreds of verified specs and real-time prices across major electronic segments.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-electric-600 hover:text-electric-700 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.id)}`}
              className="group relative p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-electric-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-electric-600 group-hover:text-white text-navy-950 flex items-center justify-center transition-colors duration-300">
                  {getCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-navy-950 group-hover:text-electric-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.itemCount}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">From <strong className="text-navy-950">{cat.startingPrice}</strong></span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-electric-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED DEALS (Amazon vs Flipkart vs Croma Highlights) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-electric-950 text-white relative overflow-hidden shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-navy-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/20 text-electric-300 text-xs font-bold mb-2 border border-electric-400/30">
                <Zap className="w-3.5 h-3.5 text-electric-400" />
                Featured Best Deal Arbitrage
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Live Price War Highlights
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                See where Amazon, Flipkart and Croma differ. We highlight the exact merchant offering the lowest checkout total right now.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-navy-950 hover:bg-slate-100 font-bold text-sm shadow-md transition-all self-start lg:self-auto"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Deal Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDeals.map((prod) => {
              const { price, savings } = getLowestPrice(prod);
              return (
                <div
                  key={prod.id}
                  className="bg-navy-900/90 backdrop-blur-md rounded-2xl border border-navy-800 p-5 flex flex-col justify-between hover:border-electric-500/60 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-bold text-electric-400 uppercase tracking-wider">
                        {prod.brand}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[11px] font-extrabold border border-rose-500/30">
                        Save ₹{savings.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover border border-navy-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-electric-300 transition-colors">
                          {prod.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-black text-white">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Retailer Comparison Pills */}
                    <div className="space-y-1.5 py-3 border-t border-navy-800/80 text-xs">
                      {prod.onlineStores?.map((s) => {
                        const isCheapest = s.price === price;
                        return (
                          <div
                            key={s.id}
                            className={`flex items-center justify-between p-2 rounded-lg ${
                              isCheapest
                                ? 'bg-electric-600/30 border border-electric-400/40 text-white font-bold'
                                : 'bg-navy-950/60 text-slate-300'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {isCheapest && <CheckCircle2 className="w-3.5 h-3.5 text-electric-400" />}
                              <span>{s.name}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span>₹{s.price.toLocaleString('en-IN')}</span>
                              {isCheapest && (
                                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-electric-500 text-white">
                                  Best
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Link
                    to={`/compare-prices/${prod.id}`}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs text-center shadow-glow-electric transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Price Comparison</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-electric-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Verified Market Pricing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Trending Tech Products
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked customer favorites with instant multi-store price analysis & local store pickup status.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-950 hover:text-electric-600 transition-colors"
          >
            <span>Explore Entire Catalog (20+ Items)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. HOW SMARTSHOP AI WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5 text-electric-600" />
            <span>Intelligent Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            How SmartShop AI Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Four powerful layers operating in real-time to save you hours of research and thousands of rupees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-electric-50 text-electric-600 flex items-center justify-center font-black text-xl mb-4 border border-electric-100">
                01
              </div>
              <h3 className="text-base font-extrabold text-navy-950 mb-2">
                1. AI Intelligent Search
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Type natural queries like "Best laptop under ₹60,000" or search exact part numbers. Our semantic NLP engine decodes specifications instantly.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-electric-600">
              Natural Language Intent
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl mb-4 border border-blue-100">
                02
              </div>
              <h3 className="text-base font-extrabold text-navy-950 mb-2">
                2. Live Price Aggregation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We monitor Amazon.in, Flipkart and Croma round the clock. Stock status, delivery times, and bank discount offers are parsed in milliseconds.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-600">
              Multi-Retailer Scraping
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl mb-4 border border-emerald-100">
                03
              </div>
              <h3 className="text-base font-extrabold text-navy-950 mb-2">
                3. Nearby Physical Radar
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need it today? SmartShop checks verified inventories at local tech stores (Reliance Digital, Imagine, Vijay Sales) within your GPS radius.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-600">
              Instant Local Pickup
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl mb-4 border border-amber-100">
                04
              </div>
              <h3 className="text-base font-extrabold text-navy-950 mb-2">
                4. Best Value Decision
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare side-by-side spec differences, inspect 30-day price trends, and reserve pickup or buy online at the absolute lowest cost.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-600">
              Guaranteed Maximum Savings
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI SHOPPING ASSISTANT PROMOTIONAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-100 text-electric-800 text-xs font-bold">
              <Bot className="w-4 h-4 text-electric-600" />
              <span>Interactive Shopping AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 tracking-tight leading-tight">
              Meet Your Personal <br />
              <span className="text-electric-600">SmartShop AI Advisor</span>
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
              Not sure which laptop or camera phone fits your budget? Ask SmartShop AI. Our conversational agent analyzes benchmark scores, verified retailer prices, and store inventory to give unbiased advice.
            </p>

            {/* Clickable prompt sampler */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Click any question to try now:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleAiQuestions.slice(0, 4).map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigate(`/ai-assistant?q=${encodeURIComponent(q)}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-electric-400 hover:bg-electric-50 hover:text-electric-700 text-xs font-semibold text-slate-700 transition-all text-left shadow-2xs"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <Bot className="w-4 h-4 text-electric-300" />
                <span>Launch Full AI Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual AI Preview Card */}
          <div className="w-full lg:w-[420px] bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 space-y-3.5 shrink-0">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-electric-600 to-cyan-500 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-950">Ask SmartShop AI</h4>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online • Gemini Ready
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 text-slate-700 max-w-[85%] ml-auto">
                Suggest a laptop under ₹60,000 for programming
              </div>
              <div className="p-3.5 rounded-xl bg-electric-50 text-navy-950 border border-electric-100 space-y-2 max-w-[95%]">
                <p className="leading-relaxed">
                  I found <strong>Lenovo ThinkPad E14</strong> (i5, 16GB RAM) at <strong>₹58,990</strong> on Amazon (Save ₹21,000), plus in-stock at Croma Indiranagar!
                </p>
                <div className="p-2 rounded-lg bg-white border border-electric-200/80 flex items-center justify-between">
                  <span className="font-bold text-navy-950">Lenovo ThinkPad E14</span>
                  <span className="font-extrabold text-electric-600">₹58,990</span>
                </div>
              </div>
            </div>

            <Link
              to="/ai-assistant"
              className="block w-full py-2.5 rounded-xl bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs text-center shadow-xs transition-colors"
            >
              Start Chatting with AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
