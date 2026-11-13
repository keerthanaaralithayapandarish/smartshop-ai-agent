import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Barcode,
  LogOut,
  Plus,
  Save,
  Trash2,
  Store,
  Package,
  Pencil,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { useOwnerAuth } from '../../context/OwnerAuthContext';
import { useToast } from '../../context/ToastContext';
import { getBaseProductByBarcode } from '../../services/productService';
import { getLowestPrice } from '../../data/products';
import { SAMPLE_BARCODES } from '../../data/barcodes';
import {
  deleteOwnerItem,
  getOwnerInventory,
  getOwnerItemByBarcode,
  saveOwnerItem,
} from '../../services/ownerInventoryService';
import { BarcodeScanner } from '../../components/owner/BarcodeScanner';
import { useCatalogVersion } from '../../hooks/useCatalogVersion';

const CATEGORIES = ['Laptops', 'Smartphones', 'Headphones', 'Smart Watches', 'Electronics'];

const EMPTY_FORM = {
  barcode: '',
  linkedProductId: null,
  name: '',
  brand: '',
  category: 'Electronics',
  price: '',
  stock: '1',
  originalPrice: '',
  description: '',
  image: '',
};

export function OwnerDashboardPage() {
  const { owner, logout } = useOwnerAuth();
  const toast = useToast();
  const catalogVersion = useCatalogVersion();
  const [form, setForm] = useState(EMPTY_FORM);
  const [identityLocked, setIdentityLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  const items = useMemo(() => {
    const all = getOwnerInventory();
    if (!owner?.storeId) return all;
    return all.filter(
      (item) => item.storeId === owner.storeId || (!item.storeId && owner.storeId === 'croma-indiranagar')
    );
  }, [catalogVersion, owner?.storeId]);

  // Inventory analysis & low-stock alerts (below 5 units)
  const lowStockItems = useMemo(
    () => items.filter((i) => Number(i.stock) < 5 && Number(i.stock) > 0),
    [items]
  );
  const outOfStockItems = useMemo(
    () => items.filter((i) => Number(i.stock) === 0),
    [items]
  );
  const healthyStockItems = useMemo(
    () => items.filter((i) => Number(i.stock) >= 5),
    [items]
  );

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const loadBarcode = (rawCode) => {
    const code = String(rawCode || '').trim();
    if (!code) return;
    const saved = getOwnerItemByBarcode(code);
    if (saved) {
      setForm({
        barcode: saved.barcode,
        linkedProductId: saved.linkedProductId,
        name: saved.name,
        brand: saved.brand,
        category: saved.category,
        price: String(saved.price),
        stock: String(saved.stock),
        originalPrice: String(saved.originalPrice || ''),
        description: saved.description || '',
        image: saved.image || '',
      });
      setIdentityLocked(Boolean(saved.linkedProductId));
      toast.info(saved.linkedProductId ? 'Existing catalog product loaded.' : 'Owner listing loaded.', 'Barcode found');
      return;
    }

    const base = getBaseProductByBarcode(code);
    if (base) {
      const croma = base.onlineStores?.find((store) => store.id === 'croma');
      const lowest = getLowestPrice(base);
      setForm({
        barcode: code,
        linkedProductId: base.id,
        name: base.name,
        brand: base.brand,
        category: base.category,
        price: String(croma?.price || lowest.price || ''),
        stock: '1',
        originalPrice: String(base.originalPrice || ''),
        description: base.description || '',
        image: base.image || '',
      });
      setIdentityLocked(true);
      toast.success('Matched a catalog product. Set this store’s price and stock.', 'Catalog match');
      return;
    }

    setForm({ ...EMPTY_FORM, barcode: code });
    setIdentityLocked(false);
    toast.info('New barcode. Fill in the product details so shoppers can discover it.', 'New product');
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      saveOwnerItem({
        ...form,
        storeId: owner?.storeId || 'croma-indiranagar',
        storeName: owner?.storeName || 'Croma Megastore - Indiranagar',
      });
      toast.success('Inventory saved! Customer search and store availability updated.', 'Inventory saved');
      setForm(EMPTY_FORM);
      setIdentityLocked(false);
    } catch (err) {
      toast.error(err.message || 'Could not save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setForm(EMPTY_FORM);
    setIdentityLocked(false);
    toast.info('Form cleared for new entry.');
  };

  const handleEdit = (item) => {
    setForm({
      barcode: item.barcode,
      linkedProductId: item.linkedProductId,
      name: item.name,
      brand: item.brand,
      category: item.category,
      price: String(item.price),
      stock: String(item.stock),
      originalPrice: String(item.originalPrice || ''),
      description: item.description || '',
      image: item.image || '',
    });
    setIdentityLocked(Boolean(item.linkedProductId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickStock = (item, delta) => {
    const nextStock = Math.max(0, Number(item.stock) + delta);
    saveOwnerItem({
      ...item,
      stock: nextStock,
    });
    toast.success(`Stock for "${item.name}" updated to ${nextStock}.`, 'Stock updated');
  };

  const handleDelete = (item) => {
    deleteOwnerItem(item.barcode);
    if (form.barcode === item.barcode) {
      setForm(EMPTY_FORM);
      setIdentityLocked(false);
    }
    toast.success(
      item.linkedProductId
        ? 'Store price reset to the original catalog listing.'
        : 'Product removed from the customer catalog.',
      'Inventory updated'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-navy-950">{owner?.storeName}</div>
              <div className="text-[11px] text-slate-500">{owner?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/products" className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">
              View shop
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Low Stock & Out of Stock Alert Banner */}
        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-start gap-3.5 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-bold block text-amber-950">
                Low Stock Alert: {lowStockItems.length + outOfStockItems.length} product(s) require inventory attention
              </span>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                {outOfStockItems.length > 0 && (
                  <span className="font-semibold text-rose-700">
                    {outOfStockItems.length} product(s) are Out of Stock.
                  </span>
                )}{' '}
                {lowStockItems.length > 0 && (
                  <span className="font-semibold">
                    {lowStockItems.length} product(s) have Low Stock (quantity below 5 units).
                  </span>
                )}{' '}
                Restock or update quantities below so customer product details and nearby store radar reflect immediate live availability.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <section className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-navy-950 tracking-tight">
                  {form.linkedProductId || items.some((i) => i.barcode === form.barcode)
                    ? 'Edit Store Product'
                    : 'Barcode Product Entry'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Updates price and stock for <span className="font-bold text-navy-950">{owner?.storeName}</span> in real-time.
                </p>
              </div>
              {(form.barcode || form.name) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors w-fit"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>New Product / Clear</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Barcode (EAN-13, EAN-8, UPC-A, UPC-E)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Barcode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      value={form.barcode}
                      onChange={(event) => setField('barcode', event.target.value)}
                      onBlur={() => form.barcode && loadBarcode(form.barcode)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          loadBarcode(form.barcode);
                        }
                      }}
                      placeholder="Scan with camera, upload image, or type barcode"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-electric-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => loadBarcode(form.barcode)}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Look up
                  </button>
                </div>

                {/* Quick Test Demo Barcodes */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400">Quick Test Samples:</span>
                  {SAMPLE_BARCODES.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => {
                        setField('barcode', s.code);
                        loadBarcode(s.code);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-electric-50 hover:text-electric-700 text-slate-700 border border-slate-200 transition-colors"
                    >
                      <span className="px-1 py-0.2 rounded text-[9px] font-black bg-electric-600 text-white">
                        {s.format}
                      </span>
                      <span>{s.code}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-2.5">
                  <BarcodeScanner onDetected={loadBarcode} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Field
                  label="Product name"
                  value={form.name}
                  disabled={identityLocked}
                  onChange={(value) => setField('name', value)}
                />
                <Field
                  label="Brand"
                  value={form.brand}
                  disabled={identityLocked}
                  onChange={(value) => setField('brand', value)}
                />
                <label className="block">
                  <span className="block text-xs font-bold text-slate-700 mb-1.5">Category</span>
                  <select
                    value={form.category}
                    disabled={identityLocked}
                    onChange={(event) => setField('category', event.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm bg-white disabled:bg-slate-50"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Store price (₹)"
                  type="number"
                  value={form.price}
                  onChange={(value) => setField('price', value)}
                />
                <Field
                  label="Stock quantity"
                  type="number"
                  value={form.stock}
                  onChange={(value) => setField('stock', value)}
                />
                <Field
                  label="MRP (₹)"
                  type="number"
                  value={form.originalPrice}
                  disabled={identityLocked}
                  onChange={(value) => setField('originalPrice', value)}
                />
              </div>

              {!identityLocked && (
                <div className="space-y-3">
                  <Field
                    label="Image URL (optional)"
                    value={form.image}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(value) => setField('image', value)}
                  />
                  <label className="block">
                    <span className="block text-xs font-bold text-slate-700 mb-1.5">Description</span>
                    <textarea
                      value={form.description}
                      onChange={(event) => setField('description', event.target.value)}
                      rows={3}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm"
                      placeholder="Shown on the product detail page"
                    />
                  </label>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-sm font-bold disabled:opacity-60 transition-all shadow-md"
                >
                  {form.linkedProductId || items.some((item) => item.barcode === form.barcode) ? (
                    <Save className="w-4 h-4 text-electric-300" />
                  ) : (
                    <Plus className="w-4 h-4 text-electric-300" />
                  )}
                  <span>Save to store inventory</span>
                </button>

                {(form.barcode || form.name) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <aside className="bg-white rounded-3xl border border-slate-200 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-navy-950">
                <Package className="w-4 h-4 text-electric-600" />
                <span>Store Inventory ({items.length})</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Live Updates</span>
            </div>

            {/* Inventory Status Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                <span className="text-sm font-black text-navy-950">{items.length}</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Low</span>
                <span className="text-sm font-black text-amber-900">{lowStockItems.length}</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Out</span>
                <span className="text-sm font-black text-rose-900">{outOfStockItems.length}</span>
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {items.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Package className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <span>No store items yet. Scan a demo barcode above to list products at your store.</span>
                </div>
              )}
              {items.map((item) => {
                const qty = Number(item.stock);
                return (
                  <div key={item.barcode} className="p-3.5 rounded-2xl border border-slate-200 hover:border-electric-300 transition-colors bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-bold text-navy-950 line-clamp-2">{item.name}</div>
                      {qty === 0 ? (
                        <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : qty < 5 ? (
                        <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Low Stock: {qty}
                        </span>
                      ) : (
                        <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Stock: {qty}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">{item.barcode}</div>
                    <div className="text-xs font-black text-navy-950 mt-1">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400">Qty:</span>
                        <button
                          type="button"
                          onClick={() => handleQuickStock(item, -1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition-colors"
                          title="Decrease stock"
                        >
                          -
                        </button>
                        <span className="font-bold text-navy-950 font-mono text-xs px-0.5">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickStock(item, 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs transition-colors"
                          title="Increase stock"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-electric-600 hover:text-electric-700"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', disabled = false }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
      <input
        type={type}
        min={type === 'number' ? '0' : undefined}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-500"
      />
    </label>
  );
}
