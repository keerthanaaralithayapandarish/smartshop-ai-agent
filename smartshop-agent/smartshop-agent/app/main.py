from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .agent import ShopAgent
from .backend_clients import get_backend
from .config import get_settings
from .schemas import ChatRequest, ChatResponse

settings = get_settings()
agent = ShopAgent(get_backend(settings), settings)

app = FastAPI(title="SmartShop AI – Agent Service")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins,
                   allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"status": "ok", "llm_enabled": settings.llm_enabled, "backend_mode": settings.backend_mode,
            "model": settings.llm_model if settings.llm_enabled else None}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        return agent.chat(req.message, req.session_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Agent error: {exc}")


@app.delete("/chat/{session_id}")
def reset(session_id: str):
    agent.reset(session_id)
    return {"status": "reset"}
