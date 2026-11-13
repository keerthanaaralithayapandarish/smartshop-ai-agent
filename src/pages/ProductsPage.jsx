import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  Star,
  ArrowUpDown,
  Grid,
  List,
  RotateCcw,
} from 'lucide-react';
import { searchProducts, getAllBrands } from '../services/productService';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/common/ProductCard';
import { SearchBar } from '../components/common/SearchBar';
import { getLowestPrice } from '../data/products';
import { useCatalogVersion } from '../hooks/useCatalogVersion';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search parameters from URL
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Re-fetch when the store owner saves or deletes inventory (cross-tab / same-tab updates)
  const catalogVersion = useCatalogVersion();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL params change
  useEffect(() => {
    setQuery(queryParam);
    setSelectedCategory(categoryParam);
  }, [queryParam, categoryParam]);

  // Load and filter products
  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      const results = await searchProducts({
        query,
        category: selectedCategory,
        brand: selectedBrands.length > 0 ? selectedBrands : 'all',
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        inStockOnly,
        minRating,
        sortBy,
      });
      setProducts(results);
      setLoading(false);
    }
    fetchFiltered();
  }, [query, selectedCategory, selectedBrands, minPrice, maxPrice, inStockOnly, minRating, sortBy, catalogVersion]);

  const allAvailableBrands = useMemo(() => getAllBrands(), [catalogVersion]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setMinRating(0);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    query ||
    selectedCategory !== 'all' ||
    selectedBrands.length > 0 ||
    minPrice ||
    maxPrice ||
    inStockOnly ||
    minRating > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-electric-950 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-500/20 text-electric-300 text-xs font-bold border border-electric-400/30">
            <Search className="w-3.5 h-3.5" />
            Product Search & Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Find the Best Tech Deals
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Filter by technical hardware specifications, compare Amazon, Flipkart and Croma prices side-by-side, and check local store availability.
          </p>
          <div className="pt-2">
            <SearchBar
              initialQuery={query}
              initialCategory={selectedCategory}
              placeholder="Search by product name, brand, processor, specs..."
              size="normal"
              showQuickTags={false}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden w-full flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-950 text-white text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>
          <span className="text-xs font-semibold text-slate-600">
            {products.length} Products Found
          </span>
        </div>

        {/* Desktop Sidebar Filters */}
        <aside
          className={`lg:block w-full lg:w-72 bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-6 shrink-0 ${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 overflow-y-auto m-0 rounded-none'
              : 'hidden'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-electric-600" />
              <h3 className="font-bold text-navy-950 text-sm">Filter Catalog</h3>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            {mobileFilterOpen && (
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden p-1 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Category
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-electric-50 text-electric-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span>(20)</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                    selectedCategory.toLowerCase() === cat.id.toLowerCase()
                      ? 'bg-electric-50 text-electric-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Price Range (INR)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400">Min (₹)</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-electric-600"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Max (₹)</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="2,00,000"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-electric-600"
                />
              </div>
            </div>
            {/* Quick price presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMinPrice('0');
                  setMaxPrice('60000');
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-electric-50 hover:text-electric-600"
              >
                Under ₹60k
              </button>
              <button
                type="button"
                onClick={() => {
                  setMinPrice('60000');
                  setMaxPrice('120000');
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-electric-50 hover:text-electric-600"
              >
                ₹60k - ₹1.2L
              </button>
              <button
                type="button"
                onClick={() => {
                  setMinPrice('120000');
                  setMaxPrice('');
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-electric-50 hover:text-electric-600"
              >
                Over ₹1.2L
              </button>
            </div>
          </div>

          {/* Brand Checkbox Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Brand
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allAvailableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer hover:text-navy-950"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 rounded text-electric-600 focus:ring-electric-500 cursor-pointer"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* In-Stock & Availability */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Availability
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-electric-600 focus:ring-electric-500 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Minimum Rating
            </label>
            <div className="space-y-1">
              {[4.5, 4.0, 0].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMinRating(r)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    minRating === r
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r > 0 ? (
                    <>
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{r}★ & above</span>
                    </>
                  ) : (
                    <span>Any Rating</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {mobileFilterOpen && (
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-navy-950 text-white font-bold text-xs"
              >
                Apply Filters ({products.length} Results)
              </button>
            </div>
          )}
        </aside>

        {/* Results Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Sorting & Result Count Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-extrabold text-navy-950">
                {products.length} Products Found
              </span>
              {query && (
                <span className="text-xs text-slate-500 ml-1.5">
                  for "<strong className="text-navy-950">{query}</strong>"
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-navy-950 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured Popularity</option>
                  <option value="lowest_price">Price: Low to High</option>
                  <option value="highest_price">Price: High to Low</option>
                  <option value="discount">Highest Discount (Savings)</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="name_asc">Name (A to Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'grid' ? 'bg-white shadow-xs text-navy-950' : 'text-slate-500'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${
                    viewMode === 'list' ? 'bg-white shadow-xs text-navy-950' : 'text-slate-500'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Active filters:</span>
              {query && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  Search: "{query}"
                  <button onClick={() => setQuery('')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-electric-50 text-electric-700 font-semibold">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700"
                >
                  Brand: {b}
                  <button onClick={() => handleBrandToggle(b)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  Price: ₹{minPrice || 0} - ₹{maxPrice || '∞'}
                  <button
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Listing */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-950">No products match your criteria</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                Try expanding your price range, clearing brand selections, or searching for broader terms like "laptop" or "phone".
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-navy-950 text-white font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {products.map((product) => {
                const { price, store, savings } = getLowestPrice(product);
                return (
                  <div
                    key={product.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row items-center gap-5 justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-electric-600 uppercase">
                            {product.brand} • {product.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        <Link
                          to={`/product/${product.id}`}
                          className="text-base font-bold text-navy-950 hover:text-electric-600 block line-clamp-1 mt-0.5"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {product.highlights?.join(' • ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-navy-950">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          {savings > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 sm:justify-end">
                          <span className="text-[11px] text-slate-600 font-medium">
                            Store: <strong className="text-navy-950 font-bold">{store?.name || 'Local Store'}</strong>
                          </span>
                          {store?.stockStatus === 'out_of_stock' || store?.stock === 'Out of Stock' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Out of Stock
                            </span>
                          ) : store?.stockStatus === 'low_stock' || store?.stock === 'Limited Stock' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              In Stock
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/compare-prices/${product.id}`}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Compare Prices
                        </Link>
                        <Link
                          to={`/product/${product.id}`}
                          className="px-4 py-2 rounded-xl bg-navy-950 text-white text-xs font-bold hover:bg-navy-900"
                        >
                          View Specs
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
