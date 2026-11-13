import pytest
from fastapi.testclient import TestClient

from app.agent import ShopAgent
from app.backend_clients import MockBackend
from app.config import Settings
from app.intent import extract_budget, extract_requirements


@pytest.fixture
def agent():
    return ShopAgent(MockBackend(), Settings(anthropic_api_key=""))  # rule-based mode


def test_budget_parsing():
    assert extract_budget("laptop under 60k") == 60000
    assert extract_budget("budget of ₹55,000") == 55000
    assert extract_budget("below 1 lakh") == 100000
    assert extract_budget("with 16 GB RAM") is None


def test_requirements():
    r = extract_requirements("laptop under 60000 with 16GB RAM and 1TB SSD i5")
    assert (r.budget_max, r.min_ram_gb, r.min_storage_gb, r.processor, r.category) == (60000, 16, 1000, "i5", "laptop")


def test_search(agent):
    r = agent.chat("I need a laptop under 60k with 16GB RAM")
    assert "product_search" in r.intents
    assert [p["id"] for p in r.products] == ["L-A"]


def test_compare(agent):
    r = agent.chat("Compare Laptop A and Laptop B")
    assert r.comparison and len(r.comparison["products"]) == 2


def test_compatibility_negative_with_evidence(agent):
    r = agent.chat("Is the DDR4 16GB RAM Module compatible with Laptop C?")
    assert "NOT compatible" in r.reply
    assert r.evidence and "Laptop C" in r.evidence[0]["source"]


def test_stock(agent):
    r = agent.chat("Is Laptop A in stock?")
    assert {row["store"] for row in r.stock if row["quantity"] > 0} == {"Store A", "Store C"}


def test_unanswerable(agent):
    assert agent.chat("Tell me a joke").answerable is False
    assert agent.chat("What is the GPU of Laptop A?").answerable is False
    assert agent.chat("laptop under 20000").answerable is False


def test_follow_up_uses_session(agent):
    agent.chat("Show me a laptop under 56000", "s1")
    r = agent.chat("is it in stock?", "s1")
    assert r.stock


def test_api():
    from app.main import app
    c = TestClient(app)
    assert c.get("/health").json()["status"] == "ok"
    body = c.post("/chat", json={"message": "Compare Laptop A and Laptop C"}).json()
    assert body["session_id"] and body["comparison"]
