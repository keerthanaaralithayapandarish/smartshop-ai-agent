"""Tool definitions the LLM can call + a safe dispatcher."""
from typing import Any

TOOL_SCHEMAS = [
    {
        "name": "search_products",
        "description": "Search the product catalogue by budget and specs. Use for recommendations or finding products.",
        "input_schema": {
            "type": "object",
            "properties": {
                "category": {"type": "string", "description": "laptop, ram, ssd, bag, ..."},
                "max_price": {"type": "number", "description": "Maximum budget in INR"},
                "min_ram_gb": {"type": "integer"},
                "min_storage_gb": {"type": "integer"},
                "processor": {"type": "string", "description": "e.g. 'i5', 'Ryzen 5'"},
            },
        },
    },
    {
        "name": "compare_products",
        "description": "Compare two or more products side by side using their product ids.",
        "input_schema": {
            "type": "object",
            "properties": {"product_ids": {"type": "array", "items": {"type": "string"}, "minItems": 2}},
            "required": ["product_ids"],
        },
    },
    {
        "name": "check_compatibility",
        "description": "Check whether an accessory/component (RAM, SSD, bag...) is compatible with a laptop.",
        "input_schema": {
            "type": "object",
            "properties": {"product_id": {"type": "string"}, "other_id": {"type": "string"}},
            "required": ["product_id", "other_id"],
        },
    },
    {
        "name": "get_evidence",
        "description": "Retrieve supporting text from product manuals/spec sheets. Use it to back up claims or answer "
                       "detailed questions (battery, ports, warranty, upgrade limits).",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}, "product_id": {"type": "string"}},
            "required": ["query"],
        },
    },
    {
        "name": "check_stock",
        "description": "Check store availability and quantities for a product, optionally filtered by city.",
        "input_schema": {
            "type": "object",
            "properties": {"product_id": {"type": "string"}, "city": {"type": "string"}},
            "required": ["product_id"],
        },
    },
]

TOOL_TO_INTENT = {
    "search_products": "product_search",
    "compare_products": "comparison",
    "check_compatibility": "compatibility_check",
    "check_stock": "stock_check",
    "get_evidence": "product_info",
}


class ToolRunner:
    def __init__(self, backend):
        self.backend = backend

    def run(self, name: str, args: dict[str, Any]) -> Any:
        try:
            if name == "search_products":
                return self.backend.search_products(**{k: v for k, v in args.items() if v is not None})
            if name == "compare_products":
                return self.backend.compare_products(args["product_ids"])
            if name == "check_compatibility":
                return self.backend.check_compatibility(args["product_id"], args["other_id"])
            if name == "get_evidence":
                return self.backend.get_evidence(args["query"], args.get("product_id"))
            if name == "check_stock":
                return self.backend.check_stock(args["product_id"], args.get("city"))
            return {"error": f"Unknown tool {name}"}
        except Exception as exc:  # backend down, bad args -> tell the model instead of crashing
            return {"error": f"Tool '{name}' failed: {exc}"}


def summarize(result: Any) -> str:
    if isinstance(result, list):
        return f"{len(result)} result(s)"
    if isinstance(result, dict):
        if "error" in result:
            return f"error: {result['error']}"
        return ", ".join(list(result.keys())[:5])
    return str(result)[:80]
