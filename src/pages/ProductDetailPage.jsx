import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Scale,
  Sparkles,
  MapPin,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Truck,
  Bot,
  Layers,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  Camera,
  Share2,
} from 'lucide-react';
import { getProductById, getTrendingProducts } from '../services/productService';
import { getLowestPrice } from '../data/products';
import { getNearbyStoresForProduct } from '../services/storeService';
import { PriceCard } from '../components/common/PriceCard';
import { StoreCard } from '../components/common/StoreCard';
import { ProductCard } from '../components/common/ProductCard';
import { useComparison } from '../context/ComparisonContext';
import { useToast } from '../context/ToastContext';
import { useCatalogVersion } from '../hooks/useCatalogVersion';

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToComparison, isInComparison } = useComparison();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Re-load when the store owner updates price or stock for this product
  const catalogVersion = useCatalogVersion();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const found = await getProductById(id);
      setProduct(found);
      if (found) {
        setSelectedImage(found.image);
        const stores = getNearbyStoresForProduct(found.id);
        setNearbyStores(stores);
        const trending = getTrendingProducts(4).filter((p) => p.id !== found.id);
        setRelatedProducts(trending);
      }
      setLoading(false);
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, catalogVersion]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-electric-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading verified specifications & retailer inventory...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-navy-950">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The requested product does not exist in the catalog.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl bg-navy-950 text-white font-bold text-sm"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const { price: lowestPrice, store: bestStore, savings: totalSavings } = getLowestPrice(product);
  const highestPrice = Math.max(...(product.onlineStores?.map((s) => s.price) || [lowestPrice]));
  const inComparison = isInComparison(product.id);
  const discountPercent = Math.round((totalSavings / product.originalPrice) * 100);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!', 'Link Copied');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-navy-950">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-navy-950">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-navy-950">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-navy-950 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Hero Product Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative w-full pt-[75%] rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden shadow-card group">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-navy-950 text-white shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-electric-300" />
                {product.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-200 shadow-sm flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === imgUrl
                      ? 'border-electric-600 shadow-md ring-2 ring-electric-100'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Overview & Price Callout */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-electric-600 bg-electric-50 px-2.5 py-1 rounded-md">
                {product.brand} • {product.category}
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-lg text-slate-500 hover:text-navy-950 hover:bg-slate-100 transition-colors"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 tracking-tight mt-2.5 leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars & Reviews */}
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 font-bold text-slate-800">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} verified reviews)</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                In Stock Across Retailers
              </span>
            </div>
          </div>

          {/* Guaranteed Best Deal Banner Box */}
          <div className="p-5 rounded-2xl bg-electric-50/70 border-2 border-electric-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-electric-700">
                Guaranteed Lowest Online Price
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-electric-600 text-white">
                Best on {bestStore?.name || 'Amazon'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-navy-950">
                ₹{lowestPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > lowestPrice && (
                <span className="text-base text-slate-400 line-through font-medium">
                  MRP ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {totalSavings > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  Save ₹{totalSavings.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-electric-600" />
                <span>{bestStore?.delivery || 'Free Fast Delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Store: <strong className="text-navy-950 font-bold">{bestStore?.name || 'Local Store'}</strong></span>
                {bestStore?.stockStatus === 'out_of_stock' || bestStore?.stock === 'Out of Stock' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    Out of Stock
                  </span>
                ) : bestStore?.stockStatus === 'low_stock' || bestStore?.stock === 'Limited Stock' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Low Stock (&lt; 5 units)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                    In Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Key Feature Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-electric-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to={`/compare-prices/${product.id}`}
              className="flex-1 py-3 px-6 rounded-xl bg-electric-600 hover:bg-electric-500 text-white font-bold text-sm shadow-glow-electric text-center transition-all flex items-center justify-center gap-2"
            >
              <span>Compare All Online Retailers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => addToComparison(product)}
              className={`py-3 px-5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                inComparison
                  ? 'bg-navy-950 text-white border-navy-950'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{inComparison ? 'In Comparison Tray' : 'Compare Product'}</span>
            </button>

            <Link
              to={`/ai-assistant?q=${encodeURIComponent(`Tell me if ${product.name} is worth buying`)}`}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center"
              title="Ask AI Assistant about this product"
            >
              <Bot className="w-5 h-5 text-electric-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Online Retailer Price Comparison Section */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-navy-950">
              Online Retailer Prices
            </h2>
            <p className="text-xs text-slate-500">
              Live quotes from Amazon, Flipkart, and Croma with real-time stock checks.
            </p>
          </div>
          <Link
            to={`/compare-prices/${product.id}`}
            className="text-xs font-bold text-electric-600 hover:text-electric-700 inline-flex items-center gap-1"
          >
            <span>Full Online Comparison Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.onlineStores?.map((store) => (
            <PriceCard
              key={store.id}
              store={store}
              product={product}
              isBestPrice={store.price === lowestPrice}
              highestPrice={highestPrice}
            />
          ))}
        </div>
      </section>

      {/* Full Technical Specifications Section */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-navy-950">
            Full Technical Specifications
          </h2>
          <p className="text-xs text-slate-500">
            Detailed hardware and configuration specifications verified for this exact model.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {product.specs?.processor && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-electric-600" />
                  Processor / Chipset
                </span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.processor}
                </span>
              </div>
            )}

            {product.specs?.ram && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  RAM / Memory
                </span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.ram}
                </span>
              </div>
            )}

            {product.specs?.storage && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  Internal Storage
                </span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.storage}
                </span>
              </div>
            )}

            {product.specs?.display && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-600" />
                  Display & Resolution
                </span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.display}
                </span>
              </div>
            )}

            {product.specs?.battery && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <Battery className="w-4 h-4 text-emerald-600" />
                  Battery & Charging
                </span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.battery}
                </span>
              </div>
            )}

            {product.specs?.camera && product.specs.camera !== 'N/A' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-rose-600" />
                  Camera Setup
                </span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.camera}
                </span>
              </div>
            )}

            {product.specs?.os && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700">Operating System</span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.os}
                </span>
              </div>
            )}

            {product.specs?.weight && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700">Weight</span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.weight}
                </span>
              </div>
            )}

            {product.specs?.connectivity && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700">Connectivity & Ports</span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.connectivity}
                </span>
              </div>
            )}

            {product.specs?.warranty && (
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 hover:bg-slate-50/50">
                <span className="font-bold text-slate-700">Warranty Coverage</span>
                <span className="sm:col-span-2 text-slate-900 font-medium mt-1 sm:mt-0">
                  {product.specs.warranty}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Nearby Physical Store Availability Section */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-navy-950 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-electric-600" />
              <span>Nearby Physical Store Availability</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verified local retail inventory in Bengaluru ready for immediate pickup today.
            </p>
          </div>
          <Link
            to={`/nearby?product=${product.id}`}
            className="text-xs font-bold text-electric-600 hover:text-electric-700 inline-flex items-center gap-1"
          >
            <span>Open Interactive Map Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {nearbyStores.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No local physical store in your immediate area currently stocks this specific model. You can order online above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* Similar Trending Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-navy-950">
                Similar Products You May Consider
              </h2>
              <p className="text-xs text-slate-500">
                Compare alternatives in the same category with verified online retailer pricing.
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-electric-600 hover:text-electric-700 inline-flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </section>
      )}

      {/* Compare Product CTA Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-navy-950 to-navy-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold">Unsure If This Is the Right Choice?</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Compare {product.name.split('(')[0]} with competing models side-by-side to highlight differences in battery, performance benchmarks, and pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              addToComparison(product);
              navigate('/compare');
            }}
            className="px-6 py-3 rounded-xl bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs shadow-glow-electric transition-all"
          >
            Open in Comparison Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
