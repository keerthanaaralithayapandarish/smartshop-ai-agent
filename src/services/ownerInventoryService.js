/**
 * Store-owner inventory for the hackathon demo.
 * Kept in localStorage and fully separate from the customer session.
 */

import { PRODUCT_BARCODES } from '../data/barcodes.js';

export const OWNER_INVENTORY_KEY = 'SMARTSHOP_OWNER_INVENTORY';
export const OWNER_STORE_ID = 'croma-indiranagar';
export const CATALOG_EVENT = 'smartshop-catalog-change';

export function stockMeta(stock) {
  const qty = Math.max(0, Number(stock) || 0);
  if (qty <= 0) {
    return { qty: 0, stock: 'Out of Stock', stockStatus: 'out_of_stock', status: 'Out of Stock' };
  }
  if (qty < 5) {
    return { qty, stock: 'Limited Stock', stockStatus: 'low_stock', status: 'Limited Stock' };
  }
  return { qty, stock: 'In Stock', stockStatus: 'available', status: 'In Stock' };
}

function readItems() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OWNER_INVENTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function notifyCatalogChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CATALOG_EVENT));
}

function writeItems(items) {
  localStorage.setItem(OWNER_INVENTORY_KEY, JSON.stringify(items));
  notifyCatalogChange();
}

export function getOwnerInventory() {
  return readItems();
}

export function getOwnerItemByBarcode(barcode) {
  const code = String(barcode || '').trim();
  return readItems().find((item) => item.barcode === code) || null;
}

export function saveOwnerItem(input) {
  const barcode = String(input.barcode || '').trim();
  const name = String(input.name || '').trim();
  const price = Number(input.price);
  const stock = Number(input.stock);

  if (!barcode) throw new Error('Enter or scan a barcode.');
  if (!name) throw new Error('Product name is required.');
  if (!Number.isFinite(price) || price < 0) throw new Error('Enter a valid price.');
  if (!Number.isFinite(stock) || stock < 0) throw new Error('Enter a valid stock quantity.');

  const items = readItems();
  const existing = items.find((item) => item.barcode === barcode);
  const catalogMatchId = Object.keys(PRODUCT_BARCODES).find((id) => PRODUCT_BARCODES[id] === barcode) || null;
  const linkedProductId = input.linkedProductId || catalogMatchId || existing?.linkedProductId || null;
  const productId = linkedProductId || input.productId || existing?.productId || `owner-${barcode}`;

  const next = {
    barcode,
    productId,
    linkedProductId,
    storeId: input.storeId || existing?.storeId || OWNER_STORE_ID,
    storeName: input.storeName || existing?.storeName || 'Croma Megastore - Indiranagar',
    name,
    brand: String(input.brand || 'Store Brand').trim(),
    category: input.category || 'Electronics',
    price,
    stock: Math.round(stock),
    originalPrice: Number(input.originalPrice) > 0 ? Number(input.originalPrice) : price,
    description: String(input.description || '').trim(),
    image: input.image || '',
    updatedAt: new Date().toISOString(),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  const index = items.findIndex((item) => item.barcode === barcode);
  if (index >= 0) items[index] = next;
  else items.unshift(next);

  writeItems(items);
  return next;
}

export function deleteOwnerItem(barcode) {
  const code = String(barcode || '').trim();
  const items = readItems().filter((item) => item.barcode !== code);
  writeItems(items);
}
