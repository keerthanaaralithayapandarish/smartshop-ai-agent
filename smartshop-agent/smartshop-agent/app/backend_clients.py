"""Backend adapters. The agent only talks to the Backend interface, so you can swap
mock data (development) for Member 3 / Member 4 HTTP services (integration) via .env."""
import re
from typing import Optional

import httpx

from . import mock_backend as mb
from .config import Settings


class MockBackend:
    """In-process sample data implementing the same interface as HttpBackend."""

    def list_products(self) -> list[dict]:
        return list(mb.PRODUCTS)

    def get_product(self, product_id: str) -> Optional[dict]:
        return next((p for p in mb.PRODUCTS if p["id"] == product_id), None)

    def search_products(self, query: str = "", max_price: Optional[float] = None,
                        min_ram_gb: Optional[int] = None, min_storage_gb: Optional[int] = None,
                        processor: Optional[str] = None, category: Optional[str] = None,
                        limit: int = 5) -> list[dict]:
        results = []
        for p in mb.PRODUCTS:
            if category and p["category"] != category.lower():
                continue
            if max_price is not None and p["price"] > max_price:
                continue
            if min_ram_gb is not None and p.get("ram_gb", 0) < min_ram_gb:
                continue
            if min_storage_gb is not None and p.get("storage_gb", 0) < min_storage_gb:
                continue
            if processor and processor.lower() not in p.get("processor", "").lower():
                continue
            results.append(p)
        return sorted(results, key=lambda p: p["price"])[:limit]

    def compare_products(self, product_ids: list[str]) -> dict:
        prods = [self.get_product(i) for i in product_ids]
        prods = [p for p in prods if p]
        if len(prods) < 2:
            return {"error": "Need at least two valid product ids to compare."}
        fields = ["price", "ram_gb", "storage_gb", "processor", "screen_in", "battery_wh", "weight_kg"]
        rows = [{"field": f, "values": {p["id"]: p.get(f) for p in prods}} for f in fields
                if any(p.get(f) is not None for p in prods)]
        return {"products": prods, "rows": rows}

    def check_compatibility(self, product_id: str, other_id: str) -> dict:
        a, b = self.get_product(product_id), self.get_product(other_id)
        if not a or not b:
            return {"error": "Unknown product id."}
        laptop, acc = (a, b) if a["category"] == "laptop" else (b, a)
        if laptop["category"] != "laptop" or acc["category"] == "laptop":
            return {"compatible": None, "reason": "Compatibility is only defined between a laptop and an accessory."}
        if acc["category"] == "ram":
            ok = acc["ram_type"] == laptop["ram_type"]
            reason = f"{laptop['name']} uses {laptop['ram_type']}; the module is {acc['ram_type']}."
        elif acc["category"] == "ssd":
            ok = laptop["m2_slots"] > 0
            reason = f"{laptop['name']} has {laptop['m2_slots']} M.2 slot(s)."
        elif acc["category"] == "bag":
            ok = acc["max_screen_in"] >= laptop["screen_in"]
            reason = f"Sleeve fits up to {acc['max_screen_in']} inch; laptop screen is {laptop['screen_in']} inch."
        else:
            return {"compatible": None, "reason": "No compatibility rule for this accessory type."}
        return {"laptop_id": laptop["id"], "accessory_id": acc["id"], "compatible": ok, "reason": reason}

    def get_evidence(self, query: str, product_id: Optional[str] = None, top_k: int = 3) -> list[dict]:
        stop = {"the", "a", "is", "does", "what", "of", "for", "and", "how", "much", "has", "have", "with", "laptop"}
        words = set(re.findall(r"[a-z0-9]+", query.lower())) - stop
        scored = []
        for d in mb.DOCS:
            if product_id and d["product_id"] != product_id:
                continue
            score = len(words & set(re.findall(r"[a-z0-9]+", d["text"].lower())))
            if score:
                scored.append((score, d))
        scored.sort(key=lambda x: -x[0])
        return [d for _, d in scored[:top_k]]

    def check_stock(self, product_id: str, city: Optional[str] = None) -> dict:
        if product_id not in mb.STOCK:
            return {"error": f"No inventory data for {product_id}"}
        rows = []
        for sid, qty in mb.STOCK[product_id].items():
            s = mb.STORES[sid]
            if city and s["city"].lower() != city.lower():
                continue
            rows.append({"store": s["name"], "area": s["area"], "city": s["city"],
                         "distance_km": s["distance_km"], "quantity": qty})
        rows.sort(key=lambda r: r["distance_km"])
        return {"product_id": product_id, "in_stock": any(r["quantity"] > 0 for r in rows), "stores": rows}


class HttpBackend:
    """Calls Member 3 (product service) and Member 4 (inventory service). See README for the contract."""

    def __init__(self, settings: Settings):
        self.products = httpx.Client(base_url=settings.product_api_url, timeout=10)
        self.inventory = httpx.Client(base_url=settings.inventory_api_url, timeout=10)

    def list_products(self):
        return self.products.get("/products").raise_for_status().json()

    def get_product(self, product_id):
        r = self.products.get(f"/products/{product_id}")
        return None if r.status_code == 404 else r.raise_for_status().json()

    def search_products(self, **params):
        body = {k: v for k, v in params.items() if v is not None}
        return self.products.post("/products/search", json=body).raise_for_status().json()

    def compare_products(self, product_ids):
        return self.products.post("/products/compare", json={"product_ids": product_ids}).raise_for_status().json()

    def check_compatibility(self, product_id, other_id):
        return self.products.post("/compatibility/check",
                                  json={"product_id": product_id, "other_id": other_id}).raise_for_status().json()

    def get_evidence(self, query, product_id=None, top_k=3):
        body = {"query": query, "product_id": product_id, "top_k": top_k}
        return self.products.post("/evidence/search", json=body).raise_for_status().json()

    def check_stock(self, product_id, city=None):
        r = self.inventory.get(f"/inventory/{product_id}", params={"city": city} if city else None)
        return r.raise_for_status().json()


def get_backend(settings: Settings):
    return HttpBackend(settings) if settings.backend_mode == "http" else MockBackend()
