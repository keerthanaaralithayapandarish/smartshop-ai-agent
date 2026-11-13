from fastapi import APIRouter, HTTPException, Query

from .schemas import (
    CompareRequest,
    CompatibilityRequest,
    EvidenceRequest,
    ProductSearchResponse
)

from .service import (
    ProductNotFoundError,
    check_compatibility,
    compare_products,
    find_product_evidence,
    get_product,
    search_products,
    combined_search_products
)

router = APIRouter(tags=["Products"])


# EXISTING LOCAL PRODUCT SEARCH
@router.get("/api/products", response_model=ProductSearchResponse)
def products(
    query: str | None = None,
    category: str | None = None,
    max_price: float | None = Query(default=None, ge=0),
    min_ram_gb: int | None = Query(default=None, ge=1),
    min_storage_gb: int | None = Query(default=None, ge=1)
):
    result = search_products(
        query, category, max_price, min_ram_gb, min_storage_gb
    )
    return {"products": result, "count": len(result)}


# NEW COMBINED LOCAL + ONLINE SEARCH
@router.get("/api/products/combined-search")
def combined_search(
    query: str = Query(..., min_length=1),
    category: str | None = None,
    max_price: float | None = Query(default=None, ge=0),
    min_ram_gb: int | None = Query(default=None, ge=1),
    min_storage_gb: int | None = Query(default=None, ge=1),
    store: str = Query(default="both")
):
    if store.lower() not in ["amazon", "flipkart", "both"]:
        raise HTTPException(
            status_code=400,
            detail="Choose amazon, flipkart or both."
        )

    return combined_search_products(
        query=query,
        category=category,
        max_price=max_price,
        min_ram_gb=min_ram_gb,
        min_storage_gb=min_storage_gb,
        store=store
    )


# EXISTING PRODUCT DETAILS
@router.get("/api/products/{product_id}")
def product_detail(product_id: str):
    try:
        return get_product(product_id)
    except ProductNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


# EXISTING PRODUCT COMPARISON
@router.post("/api/compare")
def compare(request: CompareRequest):
    try:
        return compare_products(request.product_ids)
    except ProductNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# EXISTING COMPATIBILITY CHECK
@router.post("/api/compatibility")
def compatibility(request: CompatibilityRequest):
    try:
        return check_compatibility(
            request.product_id,
            request.device_name,
            request.required_ports,
            request.min_ram_gb,
            request.min_storage_gb,
            request.required_os
        )
    except ProductNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


# EXISTING PRODUCT EVIDENCE
@router.post("/api/products/evidence")
def product_evidence(request: EvidenceRequest):
    try:
        return find_product_evidence(
            request.product_id,
            request.question
        )
    except ProductNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))