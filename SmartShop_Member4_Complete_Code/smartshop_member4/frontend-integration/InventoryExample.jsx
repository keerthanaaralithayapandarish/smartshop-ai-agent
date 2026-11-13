import { useState } from "react";

const API_BASE = import.meta.env.VITE_INVENTORY_API_URL || "http://127.0.0.1:8000";

export default function InventoryExample() {
  const [productId, setProductId] = useState("laptop-a");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkAvailability(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      const response = await fetch(
        `${API_BASE}/products/${encodeURIComponent(productId)}/availability`
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail || "Could not load inventory");
      setData(body);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-xl border p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Check store availability</h2>
      <form onSubmit={checkAvailability} className="mt-4 flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-lg border px-3 py-2"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          aria-label="Product ID"
          placeholder="Enter product ID"
        />
        <button className="rounded-lg bg-black px-4 py-2 text-white" disabled={loading}>
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {error && <p className="mt-3 text-red-600">{error}</p>}
      {data && (
        <div className="mt-4">
          <p className="font-medium">
            {data.available ? "Available" : "Currently unavailable"}
            {" — "}
            {data.total_quantity} unit(s) across listed stores
          </p>
          <ul className="mt-3 space-y-2">
            {data.stores.map((store) => (
              <li key={store.store_id} className="rounded-lg bg-gray-50 p-3">
                <div className="font-medium">{store.store_name}</div>
                <div className="text-sm text-gray-600">{store.address}, {store.city}</div>
                <div className="text-sm">
                  {store.quantity > 0 ? `${store.quantity} in stock` : "Out of stock"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
