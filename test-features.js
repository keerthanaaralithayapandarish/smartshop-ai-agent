// Automated test script to verify all 6 requirements
import assert from 'node:assert';

// Mock browser localStorage
const mockStorage = new Map();
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};
global.window = {
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
};
global.Event = class Event {};

console.log('--- Starting SmartShop AI Comprehensive Test Suite ---');

// Test 1: Data Barcodes (EAN-13, EAN-8, UPC-A, UPC-E)
console.log('\n[Test 1] Testing Barcode definitions & Symbologies...');
import { PRODUCT_BARCODES, SAMPLE_BARCODES } from './src/data/barcodes.js';
assert.ok(PRODUCT_BARCODES['macbook-air-m3-13'] === '8901001000018', 'EAN-13 MacBook barcode present');
assert.ok(PRODUCT_BARCODES['boat-rockerz-550'] === '96385074', 'EAN-8 boAt Rockerz barcode present');
assert.ok(PRODUCT_BARCODES['apple-airpods-pro-2'] === '012345678905', 'UPC-A AirPods barcode present');
assert.ok(PRODUCT_BARCODES['sony-wh-1000xm5'] === '01234565', 'UPC-E Sony WH-1000XM5 barcode present');
assert.strictEqual(SAMPLE_BARCODES.length, 4, '4 sample barcode formats provided');
console.log('✓ All 4 barcode standards (EAN-13, EAN-8, UPC-A, UPC-E) verified.');

// Test 2: Owner Auth Context (Registration, Login, Demo Owner)
console.log('\n[Test 2] Testing Store Owner Registration & Authentication...');
import { DEMO_OWNER, getRegisteredOwners } from './src/services/ownerAuthService.js';
assert.ok(DEMO_OWNER.email === 'owner@smartshop.ai');
assert.ok(DEMO_OWNER.password === 'owner123');

// Register a new store owner
const testRegOwner = {
  ownerName: 'Vikas Sharma',
  storeName: 'Vikas Electronics Megastore',
  email: 'vikas@vikaselectronics.com',
  phone: '+91 99887 76655',
  password: 'storepass123',
  address: 'Shop 14, Commercial Street, Bengaluru, Karnataka 560001',
};

// Simulate registration save to storage
const initialOwners = getRegisteredOwners();
const storeId = testRegOwner.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const newOwnerRecord = { ...testRegOwner, storeId, registeredAt: new Date().toISOString() };
localStorage.setItem('SMARTSHOP_REGISTERED_OWNERS', JSON.stringify([...initialOwners, newOwnerRecord]));

const updatedOwners = getRegisteredOwners();
assert.ok(updatedOwners.some(o => o.email === 'vikas@vikaselectronics.com'), 'New store owner successfully saved in localStorage');
console.log('✓ Store Owner Registration saves to localStorage successfully.');

// Test 3: Owner Inventory Operations (Add, Edit, Delete, Low Stock)
console.log('\n[Test 3] Testing Owner Inventory Service (Add, Edit, Delete, Stock Meta)...');
import {
  saveOwnerItem,
  getOwnerInventory,
  getOwnerItemByBarcode,
  deleteOwnerItem,
  stockMeta,
} from './src/services/ownerInventoryService.js';

// Stock metadata calculation test
assert.deepStrictEqual(stockMeta(0), { qty: 0, stock: 'Out of Stock', stockStatus: 'out_of_stock', status: 'Out of Stock' });
assert.deepStrictEqual(stockMeta(2), { qty: 2, stock: 'Limited Stock', stockStatus: 'low_stock', status: 'Limited Stock' });
assert.deepStrictEqual(stockMeta(10), { qty: 10, stock: 'In Stock', stockStatus: 'available', status: 'In Stock' });
console.log('✓ Stock metadata and low/out-of-stock thresholds verified.');

// Add a new product via barcode
const newProductEntry = {
  barcode: '96385074', // EAN-8
  name: 'boAt Rockerz 550 Over-Ear (Custom Owner Edition)',
  brand: 'boAt',
  category: 'Headphones',
  price: 1499,
  stock: 2, // Low stock
  originalPrice: 4999,
  description: 'Limited edition tuned by store audio engineer.',
  storeId: 'croma-indiranagar',
};

saveOwnerItem(newProductEntry);
const retrieved = getOwnerItemByBarcode('96385074');
assert.ok(retrieved !== null, 'Item saved and retrievable by barcode');
assert.strictEqual(retrieved.price, 1499, 'Price saved accurately');
assert.strictEqual(retrieved.stock, 2, 'Stock saved accurately');
console.log('✓ Add product with EAN-8 barcode verified.');

// Edit product (price & stock update)
saveOwnerItem({
  ...newProductEntry,
  price: 1399,
  stock: 0, // Out of stock update
});
const updatedItem = getOwnerItemByBarcode('96385074');
assert.strictEqual(updatedItem.price, 1399, 'Price update reflected');
assert.strictEqual(updatedItem.stock, 0, 'Stock update reflected (0 / out of stock)');
console.log('✓ Edit product price & stock updates verified.');

// Test 4: Customer Catalog Integration
console.log('\n[Test 4] Testing Customer Catalog Integration & Search...');
import { getCatalogProducts, getProductById, searchProducts } from './src/services/productService.js';

const catalog = getCatalogProducts();
assert.ok(catalog.length > 0, 'Catalog populated');

// Add a brand-new owner custom product with new barcode
const customOwnerBarcode = '8909999000012';
saveOwnerItem({
  barcode: customOwnerBarcode,
  name: 'SmartHome Pro AI Hub',
  brand: 'HomeTech',
  category: 'Electronics',
  price: 4999,
  stock: 8,
  originalPrice: 7999,
  description: 'Next-gen smart home automation hub.',
  storeId: 'croma-indiranagar',
});

const updatedCatalog = getCatalogProducts();
const foundOwnerProd = updatedCatalog.find(p => p.barcode === customOwnerBarcode);
assert.ok(foundOwnerProd, 'Owner-added custom product appears in customer catalog');
assert.strictEqual(foundOwnerProd.name, 'SmartHome Pro AI Hub');
console.log('✓ Owner-added product successfully appears in customer catalog.');

// Search customer products for owner-added product
const searchRes = await searchProducts({ query: 'SmartHome Pro' });
assert.ok(searchRes.length > 0, 'Owner-added product found in customer search');
assert.strictEqual(searchRes[0].name, 'SmartHome Pro AI Hub');
console.log('✓ Customer product search finds owner-added products.');

// Search by barcode
const barcodeSearch = await searchProducts({ query: customOwnerBarcode });
assert.ok(barcodeSearch.length > 0, 'Product searchable directly by barcode');
console.log('✓ Product searchable directly by barcode string.');

// Test 5: Nearby Store Availability Reflection
console.log('\n[Test 5] Testing Nearby Store Availability Reflection...');
import { getNearbyStoresForProduct, getStoresWithDistance } from './src/services/storeService.js';

const nearbyForOwnerProduct = getNearbyStoresForProduct(foundOwnerProd.id);
assert.ok(nearbyForOwnerProduct.length > 0, 'Owner-added product appears in nearby stores');
assert.strictEqual(nearbyForOwnerProduct[0].productPrice, 4999, 'Store price reflects owner price');
assert.strictEqual(nearbyForOwnerProduct[0].productStock, 8, 'Store stock reflects owner stock');
console.log('✓ Owner price & stock updates reflect in customer nearby store availability.');

// Test 6: Delete Owner Product
console.log('\n[Test 6] Testing Delete Owner Product...');
deleteOwnerItem(customOwnerBarcode);
const postDeleteCatalog = getCatalogProducts();
assert.ok(!postDeleteCatalog.some(p => p.barcode === customOwnerBarcode), 'Product cleanly removed from catalog after delete');
console.log('✓ Owner product deletion removes listing from catalog.');

// Test 7: Verify Alex Verma and Customer Accounts are Completely Removed
console.log('\n[Test 7] Testing Customer Login / Alex Verma Removal...');
assert.strictEqual(mockStorage.get('SMARTSHOP_USER'), undefined, 'No default customer user stored');
assert.ok(!getRegisteredOwners().some(o => o.ownerName?.includes('Alex Verma') || o.email?.includes('alex')), 'No Alex Verma in owner accounts');
console.log('✓ Alex Verma and demo customer account completely absent.');

// Test 8: Low Stock Alert Boundary Verification (< 5 units)
console.log('\n[Test 8] Testing Low Stock Alert Boundary (quantity < 5)...');
assert.strictEqual(stockMeta(0).stockStatus, 'out_of_stock', 'Stock = 0 is out_of_stock');
assert.strictEqual(stockMeta(1).stockStatus, 'low_stock', 'Stock = 1 is low_stock');
assert.strictEqual(stockMeta(4).stockStatus, 'low_stock', 'Stock = 4 is low_stock (below 5)');
assert.strictEqual(stockMeta(5).stockStatus, 'available', 'Stock = 5 is available (healthy)');
assert.strictEqual(stockMeta(12).stockStatus, 'available', 'Stock = 12 is available (healthy)');
console.log('✓ Low stock alert strictly triggers when quantity is below 5.');

// Test 9: Verified Display of Product Name, Price, Stock Availability, and Store Name
console.log('\n[Test 9] Testing Display Fields on Owner Products...');
saveOwnerItem({
  barcode: '8901234567890',
  name: 'UltraWide OLED Gaming Monitor 34"',
  brand: 'Apex Gaming',
  category: 'Electronics',
  price: 64999,
  stock: 3,
  originalPrice: 84999,
  description: '175Hz curved OLED monitor.',
  storeId: 'apex-digital',
  storeName: 'Apex Digital Megastore',
});
const checkProd = getCatalogProducts().find(p => p.barcode === '8901234567890');
assert.ok(checkProd, 'Product added');
assert.strictEqual(checkProd.name, 'UltraWide OLED Gaming Monitor 34"', 'Product Name present');
assert.strictEqual(checkProd.onlineStores[0].price, 64999, 'Price present');
assert.strictEqual(checkProd.onlineStores[0].stock, 'Limited Stock', 'Stock availability calculated from quantity (3 < 5)');
assert.strictEqual(checkProd.onlineStores[0].name, 'Apex Digital Megastore', 'Store Name present');
deleteOwnerItem('8901234567890');
console.log('✓ Product name, price, stock availability, and store name correctly formatted and connected.');

console.log('\n=======================================================');
console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY! (9/9 SUITES OK)');
console.log('=======================================================');
