/**
 * SmartShop AI - Physical Stores Service
 */

import { PHYSICAL_STORES, DEFAULT_CUSTOMER_COORDINATES } from '../data/stores.js';
import { calculateDistance, formatDistance } from '../utils/distance.js';
import { getOwnerInventory, OWNER_STORE_ID, stockMeta } from './ownerInventoryService.js';
import { getRegisteredOwners } from './ownerAuthService.js';

export function getAllPhysicalStores() {
  const all = [...PHYSICAL_STORES];
  try {
    const registered = getRegisteredOwners().filter((o) => o.storeId && o.storeId !== OWNER_STORE_ID);
    registered.forEach((o, index) => {
      if (!all.some((s) => s.id === o.storeId)) {
        all.push({
          id: o.storeId,
          name: o.storeName,
          brand: o.storeName.split(' ')[0] || 'Local Retailer',
          city: 'Bengaluru',
          area: o.address?.split(',')?.[0]?.trim() || 'Central',
          address: o.address || 'Bengaluru, Karnataka',
          phone: o.phone || '+91 80 4000 1100',
          email: o.email,
          hours: '10:00 AM – 9:30 PM (Open Today)',
          rating: 4.8,
          reviewsCount: 150,
          coordinates: {
            lat: 12.9716 + (index + 1) * 0.005,
            lng: 77.6412 + (index + 1) * 0.005,
          },
          image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80',
          amenities: ['Store Pickup', 'Live Demo', 'Verified Retailer'],
          inventory: {},
        });
      }
    });
  } catch {
    // fallback to default physical stores
  }
  return all;
}

function applyOwnerStoreInventory(store) {
  const items = getOwnerInventory();
  if (items.length === 0) return store;

  const relevantItems = items.filter(
    (item) => item.storeId === store.id || (!item.storeId && store.id === OWNER_STORE_ID)
  );
  if (relevantItems.length === 0) return store;

  const inventory = { ...(store.inventory || {}) };
  relevantItems.forEach((item) => {
    const meta = stockMeta(item.stock);
    inventory[item.productId] = {
      stock: meta.qty,
      status: meta.status,
      price: Number(item.price) || 0,
    };
  });
  return { ...store, inventory };
}

/**
 * Get all physical stores with calculated distance relative to user position
 * @param {{lat: number, lng: number}} [userLocation]
 * @returns {Array} stores sorted by distance
 */
export function getStoresWithDistance(userLocation = DEFAULT_CUSTOMER_COORDINATES) {
  const loc = userLocation || DEFAULT_CUSTOMER_COORDINATES;
  return getAllPhysicalStores().map(applyOwnerStoreInventory).map((store) => {
    const distKm = calculateDistance(
      loc.lat,
      loc.lng,
      store.coordinates.lat,
      store.coordinates.lng
    );
    return {
      ...store,
      distanceKm: distKm,
      formattedDistance: formatDistance(distKm),
    };
  }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
}

/**
 * Get nearby stores stocking a specific product
 * @param {string} productId
 * @param {{lat: number, lng: number}} [userLocation]
 * @returns {Array}
 */
export function getNearbyStoresForProduct(productId, userLocation = DEFAULT_CUSTOMER_COORDINATES) {
  const stores = getStoresWithDistance(userLocation);
  return stores
    .filter((store) => store.inventory && store.inventory[productId])
    .map((store) => {
      const itemInfo = store.inventory[productId];
      return {
        ...store,
        productStock: itemInfo.stock,
        productStatus: itemInfo.status,
        productPrice: itemInfo.price,
      };
    });
}

/**
 * Get single physical store by ID
 */
export function getStoreById(storeId) {
  return getAllPhysicalStores().find((s) => s.id === storeId) || null;
}
