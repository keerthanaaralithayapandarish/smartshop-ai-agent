import json
import re
from pathlib import Path
from typing import Any

# backend/app/products/service.py -> repository root
ROOT = Path(__file__).resolve().parents[3]
PRODUCTS_FILE = ROOT / "data" / "products.json"
MANUALS_DIR = ROOT / "documents" / "product_manuals"

class ProductNotFoundError(ValueError):
    pass

def _load_products() -> list[dict[str, Any]]:
    if not PRODUCTS_FILE.exists():
        raise FileNotFoundError(f"Missing product data: {PRODUCTS_FILE}")
    with PRODUCTS_FILE.open(encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("products.json must contain a JSON array.")
    return data

def get_all_products():
    return _load_products()

def get_product(product_id: str):
    for p in _load_products():
        if p["id"].lower() == product_id.lower():
            return p
    raise ProductNotFoundError(f"Product '{product_id}' was not found.")

def search_products(query=None, category=None, max_price=None,
                    min_ram_gb=None, min_storage_gb=None):
    results = _load_products()
    terms = (query or "").strip().lower().split()
    if terms:
        results = [p for p in results if all(
            term in " ".join(str(p.get(k, "")) for k in
            ("name", "brand", "category", "processor", "description")).lower()
            for term in terms)]
    if category:
        results = [p for p in results if p.get("category", "").lower() == category.lower()]
    if max_price is not None:
        results = [p for p in results if float(p.get("price", 0)) <= max_price]
    if min_ram_gb is not None:
        results = [p for p in results if int(p.get("ram_gb") or 0) >= min_ram_gb]
    if min_storage_gb is not None:
        results = [p for p in results if int(p.get("storage_gb") or 0) >= min_storage_gb]
    return sorted(results, key=lambda p: float(p.get("price", 0)))

def compare_products(product_ids):
    if len(product_ids) < 2:
        raise ValueError("Provide at least two product IDs.")
    if len(set(product_ids)) != len(product_ids):
        raise ValueError("Duplicate product IDs are not allowed.")
    products = [get_product(pid) for pid in product_ids]
    fields = ["name", "brand", "price", "processor", "ram_gb", "storage_gb",
              "graphics", "operating_system", "display", "ports", "weight_kg",
              "warranty_years"]
    return {
        "products": products,
        "comparison": [
            {"specification": field,
             "values": {p["id"]: p.get(field, "Not specified") for p in products}}
            for field in fields
        ],
        "note": "Choose based on your requirements; the lowest price is not automatically best."
    }

def check_compatibility(product_id, device_name=None, required_ports=None,
                        min_ram_gb=None, min_storage_gb=None, required_os=None):
    p = get_product(product_id)
    available_ports = {str(x).lower() for x in p.get("ports", [])}
    required_ports = required_ports or []
    port_checks = [{"required": x, "available": x.lower() in available_ports}
                   for x in required_ports]
    checks = []
    if required_ports:
        checks.append(all(x["available"] for x in port_checks))
    if min_ram_gb is not None:
        checks.append(int(p.get("ram_gb") or 0) >= min_ram_gb)
    if min_storage_gb is not None:
        checks.append(int(p.get("storage_gb") or 0) >= min_storage_gb)
    if required_os:
        checks.append(required_os.lower() in str(p.get("operating_system", "")).lower())
    compatible = all(checks) if checks else None
    summary = ("Meets all supplied requirements." if compatible is True else
               "Does not meet all supplied requirements." if compatible is False else
               "No requirements supplied; compatibility cannot be assessed.")
    return {
        "product_id": p["id"], "product_name": p["name"],
        "device_name": device_name, "compatible": compatible,
        "checks_passed": sum(checks), "checks_total": len(checks),
        "port_checks": port_checks,
        "requirements": {"required_ports": required_ports, "min_ram_gb": min_ram_gb,
                         "min_storage_gb": min_storage_gb, "required_os": required_os},
        "summary": summary,
        "caution": "Confirm connector versions, power needs and manufacturer guidance before purchase."
    }

def find_product_evidence(product_id, question):
    p = get_product(product_id)
    terms = {w for w in re.findall(r"[a-zA-Z0-9]+", question.lower()) if len(w) > 2}
    matches = []
    for name in p.get("manual_files", []):
        path = (MANUALS_DIR / name).resolve()
        if path.parent != MANUALS_DIR.resolve() or not path.is_file():
            continue
        paragraphs = [x.strip() for x in re.split(r"\n\s*\n", path.read_text(encoding="utf-8")) if x.strip()]
        for para in paragraphs:
            words = {w for w in re.findall(r"[a-zA-Z0-9]+", para.lower()) if len(w) > 2}
            overlap = sorted(terms & words)
            if overlap:
                matches.append({"source": path.name, "text": para[:700],
                                "matched_terms": overlap, "relevance_score": len(overlap)})
    matches.sort(key=lambda x: x["relevance_score"], reverse=True)
    return {"product_id": p["id"], "product_name": p["name"], "question": question,
            "evidence": matches[:5],
            "message": "Retrieved from supplied sample manuals." if matches else
                       "No matching manual passage found. Do not invent an answer."}
def combined_search_products(query=None, category=None, max_price=None,
                             min_ram_gb=None, min_storage_gb=None,
                             store="both"):
    """
    Search local products and online stores together.
    Existing local search functionality remains unchanged.
    """

    # 1. Search existing local database
    local_results = search_products(
        query=query,
        category=category,
        max_price=max_price,
        min_ram_gb=min_ram_gb,
        min_storage_gb=min_storage_gb
    )

    local_products = []

    for product in local_results:
        item = dict(product)
        item["source"] = "local"
        item["store"] = "Local Database"
        item["is_demo"] = False
        local_products.append(item)

    # 2. Search online stores
    from app.online_stores.service import search_online_stores

    online_response = search_online_stores(
        query=query or "",
        max_price=max_price,
        store=store
    )

    online_products = online_response.get("results", [])

    # 3. Combine both results
    combined_results = local_products + online_products

    # 4. Sort by price
    combined_results.sort(
        key=lambda p: float(p.get("price") or 0)
    )

    return {
        "query": query,
        "total_results": len(combined_results),
        "local_count": len(local_products),
        "online_count": len(online_products),
        "online_mode": online_response.get("mode"),
        "message": online_response.get("message"),
        "results": combined_results
    }