from fastapi import FastAPI

from app.products import router as product_router
from app.online_stores import router as online_router

app = FastAPI(title="SmartShop AI Backend")

# Existing local product APIs
app.include_router(product_router)

# New online store API
app.include_router(online_router.router)


@app.get("/")
def home():
    return {
        "message": "SmartShop AI Backend is running"
    }