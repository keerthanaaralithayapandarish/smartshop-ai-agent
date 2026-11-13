# SmartShop AI — Member 4: Inventory, Store Availability & Integration

A runnable starter module for Member 4. It provides:
- SQLite store and inventory database
- Sample stores and product stock
- Product availability and quantity APIs
- Nearby-store lookup using sample latitude/longitude coordinates
- Integration endpoints intended for the AI agent (Member 2)
- React `fetch()` examples for Member 1
- Basic API tests

## Requirements
- Python 3.10+
- pip

## Run the backend (Windows)
Open a terminal in the `backend` folder:

```powershell
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

On macOS/Linux, activate with:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open:
- API docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

The SQLite database is created and seeded automatically on first run at `backend/smartshop.db`.

## Main API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Backend health |
| GET | `/stores` | List sample stores |
| GET | `/inventory` | List inventory; optional `product_id`, `store_id` |
| GET | `/products/{product_id}/availability` | Availability across all stores |
| GET | `/stores/{store_id}/inventory/{product_id}` | Stock at one store |
| GET | `/nearby-stores?latitude=...&longitude=...` | Nearby stores, sorted by distance |
| POST | `/agent/inventory-check` | Agent-friendly inventory tool |
| POST | `/admin/inventory` | Update stock quantity |

## Sample product IDs
- `laptop-a`
- `laptop-b`
- `laptop-c`

## Example requests

Check all store stock for Laptop A:
```bash
curl http://127.0.0.1:8000/products/laptop-a/availability
```

Check nearby stores around Bengaluru coordinates:
```bash
curl "http://127.0.0.1:8000/nearby-stores?latitude=12.9716&longitude=77.5946&radius_km=15"
```

Agent tool request:
```bash
curl -X POST http://127.0.0.1:8000/agent/inventory-check \
  -H "Content-Type: application/json" \
  -d '{"product_id":"laptop-a","latitude":12.9716,"longitude":77.5946,"radius_km":15}'
```

Update stock:
```bash
curl -X POST http://127.0.0.1:8000/admin/inventory \
  -H "Content-Type: application/json" \
  -d '{"store_id":"store-a","product_id":"laptop-a","quantity":7}'
```

## Connect with other members

### Member 2 (AI agent / FastAPI)
The agent can call:
`POST http://127.0.0.1:8000/agent/inventory-check`

If the agent runs in another service/container, replace `127.0.0.1` with the inventory server's reachable host/IP. Do not use `localhost` across separate containers.

### Member 1 (React frontend)
See `frontend-integration/InventoryExample.jsx`. Set `VITE_INVENTORY_API_URL` to the backend URL, for example:
```env
VITE_INVENTORY_API_URL=http://127.0.0.1:8000
```

### Member 3 (product database)
This module uses product IDs as stable identifiers. Agree with Member 3 on the exact IDs and fields. If their product API owns product data, keep only `product_id` in this inventory database and fetch product names/specifications from their service.

## Important notes
- This is a demo database with fictional store names, stock counts, and sample coordinates—not live retailer inventory.
- The `/admin/inventory` endpoint is intentionally simple for a college project. Before real deployment, add authentication, authorization, validation, logging, and rate limiting.
- Nearby lookup uses straight-line distance (Haversine), not road distance.
