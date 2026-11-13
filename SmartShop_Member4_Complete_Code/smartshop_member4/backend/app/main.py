import math
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from .database import get_connection, init_db
from .schemas import AgentInventoryRequest, InventoryUpdate

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="SmartShop AI — Inventory Service",
    description="Sample store inventory, availability, nearby-store and agent integration APIs.",
    version="1.0.0",
    lifespan=lifespan,
)

# Development convenience. Restrict origins before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def row_to_dict(row):
    return dict(row) if row is not None else None

def haversine_km(lat1, lon1, lat2, lon2):
    radius = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlon / 2) ** 2
    return 2 * radius * math.asin(math.sqrt(a))

@app.get("/health")
def health():
    return {"status": "ok", "service": "smartshop-inventory"}

@app.get("/stores")
def list_stores():
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM stores ORDER BY name").fetchall()
    return {"stores": [row_to_dict(r) for r in rows]}

@app.get("/inventory")
def list_inventory(product_id: str | None = None, store_id: str | None = None):
    sql = """
        SELECT i.store_id, s.name AS store_name, i.product_id, i.quantity,
               s.address, s.city, s.latitude, s.longitude
        FROM inventory i JOIN stores s ON s.store_id = i.store_id
        WHERE 1=1
    """
    params = []
    if product_id:
        sql += " AND i.product_id = ?"
        params.append(product_id)
    if store_id:
        sql += " AND i.store_id = ?"
        params.append(store_id)
    sql += " ORDER BY s.name, i.product_id"
    with get_connection() as conn:
        rows = conn.execute(sql, params).fetchall()
    return {"items": [row_to_dict(r) for r in rows]}

@app.get("/products/{product_id}/availability")
def product_availability(product_id: str):
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT s.store_id, s.name AS store_name, s.address, s.city,
                   s.latitude, s.longitude, i.quantity
            FROM inventory i JOIN stores s ON s.store_id = i.store_id
            WHERE i.product_id = ?
            ORDER BY i.quantity DESC, s.name
        """, (product_id,)).fetchall()
    if not rows:
        raise HTTPException(status_code=404, detail="No inventory record found for this product ID")
    items = [row_to_dict(r) for r in rows]
    total = sum(item["quantity"] for item in items)
    return {
        "product_id": product_id,
        "total_quantity": total,
        "available": total > 0,
        "stores": items,
    }

@app.get("/stores/{store_id}/inventory/{product_id}")
def store_product_stock(store_id: str, product_id: str):
    with get_connection() as conn:
        row = conn.execute("""
            SELECT s.store_id, s.name AS store_name, s.address, s.city,
                   i.product_id, i.quantity
            FROM stores s LEFT JOIN inventory i
              ON i.store_id = s.store_id AND i.product_id = ?
            WHERE s.store_id = ?
        """, (product_id, store_id)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Store not found")
    result = row_to_dict(row)
    result["quantity"] = result["quantity"] or 0
    result["available"] = result["quantity"] > 0
    return result

@app.get("/nearby-stores")
def nearby_stores(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(25, ge=0, le=500),
):
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM stores").fetchall()
    results = []
    for row in rows:
        store = row_to_dict(row)
        distance = haversine_km(latitude, longitude, store["latitude"], store["longitude"])
        if distance <= radius_km:
            store["distance_km"] = round(distance, 2)
            results.append(store)
    results.sort(key=lambda x: x["distance_km"])
    return {"radius_km": radius_km, "stores": results}

@app.post("/agent/inventory-check")
def agent_inventory_check(request: AgentInventoryRequest):
    """Single response designed for Member 2's agent/tool-calling layer."""
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT s.store_id, s.name AS store_name, s.address, s.city,
                   s.latitude, s.longitude, i.quantity
            FROM inventory i JOIN stores s ON s.store_id = i.store_id
            WHERE i.product_id = ?
        """, (request.product_id,)).fetchall()

    stores = []
    for row in rows:
        item = row_to_dict(row)
        if request.latitude is not None and request.longitude is not None:
            item["distance_km"] = round(
                haversine_km(request.latitude, request.longitude, item["latitude"], item["longitude"]), 2
            )
        stores.append(item)

    if request.latitude is not None and request.longitude is not None:
        stores = [s for s in stores if s["distance_km"] <= request.radius_km]
        stores.sort(key=lambda s: (s["distance_km"], -s["quantity"]))
    else:
        stores.sort(key=lambda s: (-s["quantity"], s["store_name"]))

    total = sum(s["quantity"] for s in stores)
    return {
        "product_id": request.product_id,
        "available": total > 0,
        "total_quantity_in_matching_stores": total,
        "stores": stores,
        "evidence": {
            "source": "SmartShop sample SQLite inventory database",
            "checked_store_count": len(stores),
            "note": "Demo data only; confirm live stock with the store before purchase."
        }
    }

@app.post("/admin/inventory")
def update_inventory(payload: InventoryUpdate):
    with get_connection() as conn:
        store = conn.execute("SELECT store_id FROM stores WHERE store_id = ?", (payload.store_id,)).fetchone()
        if store is None:
            raise HTTPException(status_code=404, detail="Store not found")
        conn.execute("""
            INSERT INTO inventory(store_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON CONFLICT(store_id, product_id)
            DO UPDATE SET quantity = excluded.quantity
        """, (payload.store_id, payload.product_id, payload.quantity))
        conn.commit()
    return {"updated": True, "store_id": payload.store_id,
            "product_id": payload.product_id, "quantity": payload.quantity}
