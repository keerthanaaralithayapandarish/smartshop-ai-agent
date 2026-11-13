from pydantic import BaseModel, Field

class AgentInventoryRequest(BaseModel):
    product_id: str = Field(min_length=1)
    latitude: float | None = None
    longitude: float | None = None
    radius_km: float = Field(default=25, ge=0, le=500)

class InventoryUpdate(BaseModel):
    store_id: str
    product_id: str
    quantity: int = Field(ge=0)

