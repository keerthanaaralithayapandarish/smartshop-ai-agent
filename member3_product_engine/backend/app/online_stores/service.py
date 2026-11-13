# backend/app/online_stores/service.py

import os

# Demo mode is used until authorized store API access is configured.
ONLINE_SEARCH_MODE = os.getenv("ONLINE_SEARCH_MODE", "demo")

# Clearly labelled demonstration products.
DEMO_PRODUCTS = [
    {
        "name": "Demo Laptop - Example Model",
        "price": 45000,
        "store": "Amazon (Demo)",
        "link": None,
        "source": "demo",
        "is_demo": True
    },
    {
        "name": "Demo Laptop - Example Model 2",
        "price": 48000,
        "store": "Flipkart (Demo)",
        "link": None,
        "source": "demo",
        "is_demo": True
    },
    {
        "name": "Demo Smartphone - Example Model",
        "price": 20000,
        "store": "Amazon (Demo)",
        "link": None,
        "source": "demo",
        "is_demo": True
    }
]


def normalize_product(product):
    """Convert products into a common format."""

    return {
        "name": product.get("name"),
        "price": product.get("price"),
        "store": product.get("store"),
        "link": product.get("link"),
        "source": product.get("source", "online"),
        "is_demo": product.get("is_demo", False)
    }


def search_online_stores(query, max_price=None, store="both"):

    if ONLINE_SEARCH_MODE == "demo":

        results = []

        for product in DEMO_PRODUCTS:

            if query.lower() not in product["name"].lower():
                continue

            if store != "both" and store.lower() not in product["store"].lower():
                continue

            if max_price is not None and product["price"] > max_price:
                continue

            results.append(normalize_product(product))

        return {
            "mode": "demo",
            "message": "Demo results only. These are not live store listings.",
            "results": results
        }

    # Live API integration will be added after authorized
    # Amazon or Flipkart API access is configured.
    return {
        "mode": "live",
        "message": "Live store API integration is not configured yet.",
        "results": []
    }