from fastapi import APIRouter, Query
from app.online_stores.service import search_online_stores

router = APIRouter(prefix="/api", tags=["Online Stores"])


@router.get("/online-search")
def online_search(
    query: str = Query(..., min_length=1),
    max_price: float = Query(None, gt=0),
    store: str = Query("both")
):

    if store.lower() not in ["amazon", "flipkart", "both"]:
        return {
            "error": "Invalid store. Choose amazon, flipkart or both."
        }

    return search_online_stores(
        query=query,
        max_price=max_price,
        store=store
    )