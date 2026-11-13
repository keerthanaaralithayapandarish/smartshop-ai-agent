# SmartShop AI – Member 2: AI Agent Service

FastAPI service that understands shopping questions, extracts budget/preferences, decides which
backend tool(s) to call (search, compare, compatibility, stock, manual evidence), and replies with
evidence-backed answers. Says so honestly when the data can't answer a question.

Works **standalone today** (built-in sample data) and switches to Member 3/4's real services with one
line in `.env`.

## 1. Setup

```bash
cd smartshop-agent
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
```

## 2. Run

```bash
python chat_cli.py                  # test in the terminal, no frontend needed
uvicorn app.main:app --reload --port 8000    # API server  -> http://localhost:8000/docs
pytest                              # run tests
```

Two modes (automatic):
| Mode | When | Behaviour |
|---|---|---|
| **LLM** | `ANTHROPIC_API_KEY` set in `.env` | The model chooses and chains tools (tool-calling loop) |
| **rule-based** | no key, or the LLM call fails | regex/keyword pipeline, fully offline, same response shape |

Try: `Laptop under 60k with 16GB RAM` · `Compare Laptop A and Laptop B` ·
`Is the DDR4 16GB RAM Module compatible with Laptop C?` · `Is Laptop A in stock?` ·
`What is the warranty of Laptop C?` · `What is the GPU of Laptop A?` (→ honest "can't answer")

## 3. API (for Member 1 – frontend)

`POST /chat`   body: `{"message": "...", "session_id": "optional, reuse it for follow-ups"}`

```jsonc
{
  "session_id": "uuid",            // send back on the next message
  "reply": "text to show in chat",
  "intents": ["product_search"],   // product_search | comparison | compatibility_check | stock_check | product_info
  "requirements": {"budget_max": 60000, "min_ram_gb": 16, "min_storage_gb": null, "processor": null, "category": "laptop"},
  "products": [ {product objects -> render as product cards} ],
  "comparison": {"products": [...], "rows": [{"field": "price", "values": {"L-A": 55000, "L-B": 45000}}]},
  "stock": [{"product_id": "L-A", "product_name": "Laptop A", "store": "Store A", "area": "Koramangala",
             "city": "Bengaluru", "distance_km": 2.1, "quantity": 5}],
  "evidence": [{"product_id": "L-C", "source": "Laptop C user manual, p.15", "text": "..."}],
  "tool_calls": [{"tool": "check_stock", "arguments": {...}, "result_summary": "..."}],
  "answerable": true,              // false => show a "couldn't find that" style message
  "mode": "llm"                    // or "rule-based"
}
```
Also: `GET /health`, `DELETE /chat/{session_id}` (reset a conversation). CORS origins: `CORS_ORIGINS` in `.env`.

## 4. Contract for Member 3 (product service, default `PRODUCT_API_URL=http://localhost:8001`)

Set `BACKEND_MODE=http` once these exist. Field names must match `app/mock_backend.py`
(`id, name, category, price, ram_gb, storage_gb, processor, ...`).

| Endpoint | Request | Response |
|---|---|---|
| `GET /products` | – | `[product, ...]` |
| `GET /products/{id}` | – | `product` (404 if unknown) |
| `POST /products/search` | `{query?, category?, max_price?, min_ram_gb?, min_storage_gb?, processor?, limit?}` | `[product, ...]` |
| `POST /products/compare` | `{product_ids: ["L-A","L-B"]}` | `{products: [...], rows: [{field, values: {id: value}}]}` |
| `POST /compatibility/check` | `{product_id, other_id}` | `{compatible: true/false/null, reason: "..."}` |
| `POST /evidence/search` | `{query, product_id?, top_k}` | `[{product_id, source, text}, ...]` |

## 5. Contract for Member 4 (inventory service, default `INVENTORY_API_URL=http://localhost:8002`)

`GET /inventory/{product_id}?city=Bengaluru` →
```json
{"product_id": "L-A", "in_stock": true,
 "stores": [{"store": "Store A", "area": "Koramangala", "city": "Bengaluru", "distance_km": 2.1, "quantity": 5}]}
```
Unknown product → `{"error": "..."}` (the agent then says it has no data).

## 6. Project layout

```
app/main.py             FastAPI endpoints
app/agent.py            LLM tool-calling loop + rule-based fallback, evidence/answerable logic
app/intent.py           budget/spec extraction, intent detection, product-name matching
app/tools.py            tool schemas given to the LLM + safe dispatcher
app/backend_clients.py  MockBackend (sample data) and HttpBackend (Members 3 & 4)
app/mock_backend.py     sample products, manuals, stores, stock
tests/test_agent.py     pytest suite
chat_cli.py             terminal chat for quick testing
```

## 7. Extending

* New capability: add a method in both backends, a schema in `TOOL_SCHEMAS`, a branch in `ToolRunner.run`,
  and (optional) a step in `ShopAgent._run_rules`.
* Tune LLM behaviour via `SYSTEM_PROMPT` in `app/agent.py`; change model with `LLM_MODEL`.
* Sessions are stored in memory (reset on restart); swap `ShopAgent.sessions` for Redis/SQLite if needed.
