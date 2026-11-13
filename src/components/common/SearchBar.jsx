import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { getLowestPrice } from '../../data/products';
import { getCatalogProducts } from '../../services/productService';
import { useCatalogVersion } from '../../hooks/useCatalogVersion';
import { CATEGORIES } from '../../data/categories';

export function SearchBar({
  initialQuery = '',
  initialCategory = 'all',
  placeholder = 'Search by product name, brand, processor, specs (e.g. "MacBook M3", "RTX 4060", "Sony XM5")...',
  className = '',
  size = 'large', // 'normal' | 'large'
  showQuickTags = true,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const catalogVersion = useCatalogVersion();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions as query changes
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const catalog = getCatalogProducts();
    const matches = catalog.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchText =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.barcode && String(p.barcode).toLowerCase().includes(q)) ||
        Object.values(p.specs || {}).some((val) => String(val).toLowerCase().includes(q));
      return matchCat && matchText;
    }).slice(0, 5);

    setSuggestions(matches);
  }, [query, selectedCategory, catalogVersion]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);

    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);

    navigate(`/products?${params.toString()}`);
  };

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleTagClick = (tagText) => {
    setQuery(tagText);
    navigate(`/products?q=${encodeURIComponent(tagText)}`);
  };

  const quickTags = [
    'MacBook M3',
    'iPhone 16 Pro',
    'Laptops under 60,000',
    'Sony WH-1000XM5',
    'Galaxy S24 Ultra',
    'Smart Watch',
  ];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSearch}
        className={`relative flex items-center bg-white rounded-2xl border-2 transition-all shadow-card hover:shadow-card-hover ${
          isOpen
            ? 'border-electric-600 ring-4 ring-electric-100'
            : 'border-slate-200/90 hover:border-slate-300'
        } ${size === 'large' ? 'p-1.5 sm:p-2' : 'p-1'}`}
      >
        {/* Category Selector */}
        <div className="hidden sm:flex items-center pl-3 pr-2 border-r border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer pr-1 py-1"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input */}
        <div className="relative flex-1 flex items-center pl-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent text-navy-950 placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="shrink-0 px-5 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-navy-950 via-navy-900 to-electric-600 hover:from-navy-900 hover:to-electric-500 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-glow-electric transition-all flex items-center gap-2 group"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      {/* Auto-suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-electric-600">
              <Sparkles className="w-3.5 h-3.5" />
              Live Product Matches ({suggestions.length})
            </span>
            <span>Press Enter to view all</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {suggestions.map((product) => {
              const { price, store } = getLowestPrice(product);
              return (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  type="button"
                  className="w-full p-3.5 flex items-center gap-3.5 hover:bg-electric-50/60 text-left transition-colors group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-electric-700 bg-electric-100/70 px-1.5 py-0.5 rounded">
                        {product.brand}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{product.category}</span>
                    </div>
                    <h5 className="text-sm font-bold text-navy-950 truncate mt-0.5 group-hover:text-electric-600 transition-colors">
                      {product.name}
                    </h5>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-navy-950">₹{price.toLocaleString('en-IN')}</span>
                      <span>• Lowest on {store?.name || 'Online'}</span>
                      <span className="text-emerald-600 font-semibold">• In Stock</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-electric-600 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={handleSearch}
              className="text-xs font-bold text-electric-600 hover:text-electric-700 inline-flex items-center gap-1"
            >
              See all results for "{query}" <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Popular Quick Tags */}
      {showQuickTags && (
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3 text-electric-600" />
            Popular:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 rounded-full bg-slate-100/90 hover:bg-electric-50 hover:text-electric-600 hover:border-electric-200 border border-slate-200/60 text-slate-600 font-medium transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
