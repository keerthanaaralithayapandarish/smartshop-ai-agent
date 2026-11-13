from typing import Any, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: Optional[str] = None


class Requirements(BaseModel):
    budget_max: Optional[float] = None
    min_ram_gb: Optional[int] = None
    min_storage_gb: Optional[int] = None
    processor: Optional[str] = None
    category: Optional[str] = None


class ToolCallLog(BaseModel):
    tool: str
    arguments: dict[str, Any]
    result_summary: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    intents: list[str] = []
    requirements: Requirements = Requirements()
    products: list[dict[str, Any]] = []           # product cards for the frontend
    comparison: Optional[dict[str, Any]] = None   # table data for comparison UI
    stock: list[dict[str, Any]] = []              # store availability rows
    evidence: list[dict[str, Any]] = []           # supporting snippets (manuals/specs)
    tool_calls: list[ToolCallLog] = []
    answerable: bool = True
    mode: str = "rule-based"                      # "llm" or "rule-based"
