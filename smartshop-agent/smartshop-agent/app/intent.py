"""Rule-based understanding: extract budget/specs and detect what the user wants.
Used (a) as the offline fallback agent and (b) to fill the `requirements` field in LLM mode."""
import re
from typing import Optional

from .schemas import Requirements

_NO_UNIT = r"(?!\s*(?:gb|tb|inch|in\b|hours|hrs|kg))"


def extract_budget(text: str) -> Optional[float]:
    t = text.lower().replace(",", "")
    patterns = [
        r"(?:under|below|less than|within|upto|up to|budget(?: of| is)?|max(?:imum)?|around|about)\s*"
        r"(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(k|lakhs?|l)?\b" + _NO_UNIT,
        r"(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)\s*(k|lakhs?|l)?\b" + _NO_UNIT,
    ]
    for pat in patterns:
        m = re.search(pat, t)
        if m:
            value = float(m.group(1))
            unit = m.group(2) or ""
            if unit == "k":
                value *= 1_000
            elif unit.startswith("l"):
                value *= 100_000
            return value
    return None


def extract_requirements(text: str) -> Requirements:
    t = text.lower()
    req = Requirements(budget_max=extract_budget(text))

    m = re.search(r"(\d+)\s*gb\s*(?:of\s*)?ram", t) or re.search(r"ram\s*(?:of\s*)?(\d+)\s*gb", t)
    if m:
        req.min_ram_gb = int(m.group(1))

    m = re.search(r"(\d+(?:\.\d+)?)\s*(gb|tb)\s*(?:ssd|storage|hdd|nvme)", t)
    if m:
        size = float(m.group(1))
        req.min_storage_gb = int(size * 1000) if m.group(2) == "tb" else int(size)

    m = re.search(r"\b(i[3579]|ryzen\s*[3579])\b", t)
    if m:
        req.processor = m.group(1).replace("  ", " ")

    if re.search(r"\blaptops?\b", t):
        req.category = "laptop"
    elif re.search(r"\b(ram|memory)\s*(module|stick|upgrade)?\b", t) and "gb ram" not in t:
        req.category = "ram"
    elif re.search(r"\bssd\b", t) and not re.search(r"\d\s*(gb|tb)\s*ssd", t):
        req.category = "ssd"
    elif re.search(r"\b(bag|sleeve|backpack)\b", t):
        req.category = "bag"
    return req


_KEYWORDS = {
    "comparison": [r"\bcompar\w*", r"\bvs\b", r"\bversus\b", r"\bdifference\b", r"\bbetter than\b", r"\bwhich (one )?is better\b"],
    "compatibility_check": [r"\bcompatib\w*", r"\bwork(s)? with\b", r"\bfit(s)?\b", r"\bsupport(s)?\b.*\b(ram|ssd|ddr\d)\b", r"\bcan i (use|install|add|put)\b"],
    "stock_check": [r"\bin stock\b", r"\bstock\b", r"\bavailab\w*", r"\bnearby\b", r"\bnear (me|by)\b", r"\bstores?\b", r"\bquantity\b", r"\bhow many\b.*\b(left|available)\b"],
    "product_info": [r"\bbattery\b", r"\bwarranty\b", r"\bports?\b", r"\bmanual\b", r"\bweigh\w*", r"\bupgrad\w*", r"\bslots?\b", r"\bmax(imum)? ram\b", r"\bspecs?\b", r"\bhdmi\b", r"\busb\b"],
    "product_search": [r"\bfind\b", r"\bshow\b", r"\brecommend\w*", r"\bsuggest\w*", r"\blooking for\b", r"\bneed\b", r"\bwant\b", r"\bbest\b", r"\bbuy\b", r"\bbudget\b", r"\bunder\b", r"\bcheap\w*"],
}


def detect_intents(text: str, req: Requirements) -> list[str]:
    t = text.lower()
    found = [name for name, pats in _KEYWORDS.items() if any(re.search(p, t) for p in pats)]
    # budget/spec/category with no other signal -> they are searching
    if "product_search" not in found and (req.budget_max or req.min_ram_gb or req.min_storage_gb
                                          or req.processor or req.category):
        if not found:
            found.append("product_search")
    return found


def find_mentioned_products(text: str, catalog: list[dict]) -> list[dict]:
    t = text.lower()
    hits = []
    for p in sorted(catalog, key=lambda p: -len(p["name"])):
        name, pid = p["name"].lower(), p["id"].lower()
        if re.search(rf"\b{re.escape(name)}\b", t) or re.search(rf"(?<![a-z0-9-]){re.escape(pid)}(?![a-z0-9-])", t):
            hits.append(p)
    # keep order of appearance in the message
    return sorted(hits, key=lambda p: min(
        [i for i in (t.find(p["name"].lower()), t.find(p["id"].lower())) if i >= 0] or [10**6]))


def has_explicit_search(text: str) -> bool:
    """True if the user used search-style words (find/recommend/under/budget...), not just a category word."""
    t = text.lower()
    return any(re.search(p, t) for p in _KEYWORDS["product_search"])
