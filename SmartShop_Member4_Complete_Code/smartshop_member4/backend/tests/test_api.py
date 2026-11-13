from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

def setup_module():
    init_db()

def test_health():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

def test_product_availability():
    with TestClient(app) as client:
        response = client.get("/products/laptop-a/availability")
        assert response.status_code == 200
        data = response.json()
        assert data["available"] is True
        assert data["total_quantity"] == 8

def test_agent_inventory_check():
    with TestClient(app) as client:
        response = client.post("/agent/inventory-check", json={"product_id": "laptop-a"})
        assert response.status_code == 200
        assert response.json()["available"] is True

def test_unknown_product():
    with TestClient(app) as client:
        response = client.get("/products/not-real/availability")
        assert response.status_code == 404
