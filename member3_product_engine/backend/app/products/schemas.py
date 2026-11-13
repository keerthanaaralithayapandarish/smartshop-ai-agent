from typing import Any
from pydantic import BaseModel, Field

class ProductSearchResponse(BaseModel):
    products: list[dict[str, Any]]
    count: int

class CompareRequest(BaseModel):
    product_ids: list[str] = Field(min_length=2, max_length=4)

class CompatibilityRequest(BaseModel):
    product_id: str
    device_name: str | None = None
    required_ports: list[str] = Field(default_factory=list)
    min_ram_gb: int | None = Field(default=None, ge=1)
    min_storage_gb: int | None = Field(default=None, ge=1)
    required_os: str | None = None

class EvidenceRequest(BaseModel):
    product_id: str
    question: str = Field(min_length=3, max_length=500)
