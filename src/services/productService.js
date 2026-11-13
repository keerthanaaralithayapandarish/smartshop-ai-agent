/**
 * SmartShop AI - Product Service
 * Clean data abstraction layer ready to be swapped with a real backend REST/GraphQL/Firebase API.
 */

import { PRODUCTS, getLowestPrice } from '../data/products.js';
import { PRODUCT_BARCODES } from '../data/barcodes.js';
import { getOwnerInventory, stockMeta, OWNER_STORE_ID } from './ownerInventoryService.js';

const CATEGORY_IMAGES = {
  Laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
  Smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
  Headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
  'Smart Watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
  Electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80',
};

function applyOwnerPrice(product, item) {
  const withBarcode = {
    ...product,
    barcode: item?.barcode || product.barcode || PRODUCT_BARCODES[product.id] || '',
  };
  if (!item) return withBarcode;

  const meta = stockMeta(item.stock);
  const price = Number(item.price);
  const storeId = item?.storeId || OWNER_STORE_ID;
  const storeName = item?.storeName || 'Croma Megastore - Indiranagar';

  const onlineStores = [...(withBarcode.onlineStores || [])];
  const targetIndex = onlineStores.findIndex(
    (s) => s.id === storeId || (storeId === OWNER_STORE_ID && s.id === 'croma')
  );

  const original = withBarcode.originalPrice || price;
  const storeEntry = {
    id: storeId,
    name: storeName.split(' - ')[0] || storeName,
    logoText: storeName,
    price,
    originalPrice: original,
    savings: Math.max(0, original - price),
    stock: meta.stock,
    stockStatus: meta.stockStatus,
    delivery: 'Store pickup / Local delivery',
    deliveryType: 'Instant Local',
    rating: 4.8,
    reviews: 1,
    url: '#',
    lastUpdated: 'Updated by store',
    offers: `In-store listing by ${storeName}`,
  };

  if (targetIndex >= 0) {
    onlineStores[targetIndex] = {
      ...onlineStores[targetIndex],
      ...storeEntry,
      url: onlineStores[targetIndex].url || '#',
    };
  } else {
    onlineStores.push(storeEntry);
  }

  const nearbyStoreIds = withBarcode.nearbyStoreIds?.includes(storeId)
    ? withBarcode.nearbyStoreIds
    : [...(withBarcode.nearbyStoreIds || []), storeId];

  return { ...withBarcode, onlineStores, nearbyStoreIds };
}

function buildOwnerProduct(item) {
  const price = Number(item.price) || 0;
  const originalPrice = Number(item.originalPrice) > 0 ? Number(item.originalPrice) : price;
  const meta = stockMeta(item.stock);
  const image = item.image || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.Electronics;
  const storeId = item.storeId || OWNER_STORE_ID;
  const storeName = item.storeName || 'Croma Megastore - Indiranagar';
  return {
    id: item.productId,
    barcode: item.barcode,
    name: item.name,
    brand: item.brand || 'Store Brand',
    category: item.category || 'Electronics',
    rating: 4.8,
    reviewsCount: 1,
    badge: 'Store Listing',
    image,
    gallery: [image],
    originalPrice,
    description: item.description || `${item.name} is listed by the store owner at ${storeName}.`,
    highlights: [
      `Barcode ${item.barcode}`,
      `Available at ${storeName}`,
      `${meta.qty} units at the store`,
    ],
    specs: {
      barcode: item.barcode,
      brand: item.brand || 'Store Brand',
      category: item.category || 'Electronics',
      availability: meta.status,
      store: storeName,
      stockQuantity: `${meta.qty} units`,
    },
    onlineStores: [
      {
        id: storeId,
        name: storeName.split(' - ')[0] || storeName,
        logoText: storeName,
        price,
        originalPrice,
        savings: Math.max(0, originalPrice - price),
        stock: meta.stock,
        stockStatus: meta.stockStatus,
        delivery: 'Store pickup today',
        deliveryType: 'Instant Local',
        rating: 4.8,
        reviews: 1,
        url: '#',
        lastUpdated: 'Updated by store',
        offers: `Listed by ${storeName}.`,
      },
    ],
    nearbyStoreIds: [storeId],
    ownerManaged: true,
  };
}

/** Static catalog plus store-owner price, stock, and new products. */
export function getCatalogProducts() {
  const inventory = getOwnerInventory();
  const byProductId = new Map(inventory.filter((item) => item.linkedProductId).map((item) => [item.linkedProductId, item]));
  const merged = PRODUCTS.map((product) => applyOwnerPrice(product, byProductId.get(product.id)));
  const knownIds = new Set(PRODUCTS.map((product) => product.id));

  inventory.forEach((item) => {
    if (!item.linkedProductId && !knownIds.has(item.productId)) {
      merged.push(buildOwnerProduct(item));
    }
  });

  return merged;
}

export function getBaseProductByBarcode(barcode) {
  const code = String(barcode || '').trim();
  const id = Object.keys(PRODUCT_BARCODES).find((key) => PRODUCT_BARCODES[key] === code);
  if (!id) return null;
  const product = PRODUCTS.find((item) => item.id === id);
  return product ? { ...product, barcode: code } : null;
}

export function getProductByBarcode(barcode) {
  const code = String(barcode || '').trim();
  if (!code) return null;
  return getCatalogProducts().find((product) => product.barcode === code) || null;
}

/**
 * Get all catalog products
 * @returns {Promise<Array>}
 */
export async function getAllProducts() {
  // Simulate standard network latency for smooth UI feel
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getCatalogProducts());
    }, 120);
  });
}

/**
 * Get single product by its unique ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getProductById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = getCatalogProducts().find((p) => p.id === id);
      resolve(found || null);
    }, 80);
  });
}

/**
 * Search and filter products
 */
export async function searchProducts({
  query = '',
  category = 'all',
  brand = 'all',
  minPrice = null,
  maxPrice = null,
  inStockOnly = false,
  minRating = 0,
  sortBy = 'featured'
} = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...getCatalogProducts()];

      // Text search in name, description, brand, highlights, specs
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        results = results.filter((p) => {
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchHighlights = p.highlights?.some((h) => h.toLowerCase().includes(q));
          const matchSpecs = Object.values(p.specs || {}).some((v) =>
            String(v).toLowerCase().includes(q)
          );
          const matchBarcode = String(p.barcode || '').toLowerCase().includes(q);
          return matchName || matchBrand || matchCategory || matchDesc || matchHighlights || matchSpecs || matchBarcode;
        });
      }

      // Category filter
      if (category && category !== 'all') {
        results = results.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Brand filter
      if (brand && brand !== 'all') {
        const brands = Array.isArray(brand) ? brand : [brand];
        if (brands.length > 0 && !brands.includes('all')) {
          results = results.filter((p) => brands.includes(p.brand));
        }
      }

      // Price filters (based on lowest online price)
      if (minPrice !== null && !isNaN(minPrice)) {
        results = results.filter((p) => {
          const { price } = getLowestPrice(p);
          return price >= minPrice;
        });
      }

      if (maxPrice !== null && !isNaN(maxPrice)) {
        results = results.filter((p) => {
          const { price } = getLowestPrice(p);
          return price <= maxPrice;
        });
      }

      // Rating filter
      if (minRating > 0) {
        results = results.filter((p) => p.rating >= minRating);
      }

      // In-stock only
      if (inStockOnly) {
        results = results.filter((p) =>
          p.onlineStores.some((s) => s.stockStatus === 'available' || s.stockStatus === 'low_stock')
        );
      }

      // Sorting
      results.sort((a, b) => {
        const lowA = getLowestPrice(a).price;
        const lowB = getLowestPrice(b).price;
        const savingsA = getLowestPrice(a).savings;
        const savingsB = getLowestPrice(b).savings;

        switch (sortBy) {
          case 'price_low_high':
          case 'lowest_price':
            return lowA - lowB;
          case 'price_high_low':
          case 'highest_price':
            return lowB - lowA;
          case 'rating':
            return b.rating - a.rating;
          case 'discount':
          case 'highest_discount':
            return savingsB - savingsA;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'featured':
          default:
            return b.reviewsCount - a.reviewsCount;
        }
      });

      resolve(results);
    }, 100);
  });
}

/**
 * Get trending products for homepage
 */
export function getTrendingProducts(limit = 6) {
  return getCatalogProducts().slice(0, limit);
}

/**
 * Get featured deals with highest absolute savings
 */
export function getFeaturedDeals(limit = 4) {
  const sorted = [...getCatalogProducts()].sort((a, b) => {
    const saveA = getLowestPrice(a).savings;
    const saveB = getLowestPrice(b).savings;
    return saveB - saveA;
  });
  return sorted.slice(0, limit);
}

/**
 * Get unique brands across all products
 */
export function getAllBrands() {
  const brands = new Set(getCatalogProducts().map((p) => p.brand));
  return Array.from(brands).sort();
}
