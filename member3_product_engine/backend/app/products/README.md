# Member 3 – Product Intelligence Module

## Files
This module provides product search, details, comparison, basic compatibility checks, and evidence retrieval from sample manuals.

## Add the router to the shared FastAPI app
In the team's existing `backend/app/main.py`, add:

```python
from app.products import router as product_router
app.include_router(product_router)
```

Do not create a second FastAPI app. If the team's import structure differs, coordinate with Member 2.

Install in the shared backend environment:

```bash
pip install fastapi uvicorn pydantic
```

Run from the backend directory (adjust if your team uses a different app entry point):

```bash
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs`.

## Endpoints
- `GET /api/products`
- `GET /api/products/{product_id}`
- `POST /api/compare`
- `POST /api/compatibility`
- `POST /api/products/evidence`

### Example requests

Search:
`GET /api/products?max_price=60000&min_ram_gb=16`

Compare:
```json
{"product_ids":["LAP001","LAP004"]}
```

Compatibility:
```json
{
  "product_id":"LAP001",
  "device_name":"External monitor",
  "required_ports":["HDMI"],
  "min_ram_gb":8,
  "min_storage_gb":256,
  "required_os":"Windows 11"
}
```

Evidence:
```json
{
  "product_id":"LAP001",
  "question":"Can I connect an external monitor using HDMI?"
}
```

## Contract for other members
- Product IDs are strings such as `LAP001`.
- Prices are numeric INR values.
- RAM and storage are numeric GB values (`ram_gb`, `storage_gb`).
- `ports` is an array of strings.
- All endpoints return JSON.
- Member 4 must use the same product IDs in the inventory data.
- Member 2 can call these endpoints as AI-agent tools.

## Limitations
The products and manuals supplied here are fictional demo data. Compatibility checks only compare the requirements provided in the request with stored fields; they do not verify every hardware standard, driver, power requirement or software dependency. Label sample data clearly in the demo.
