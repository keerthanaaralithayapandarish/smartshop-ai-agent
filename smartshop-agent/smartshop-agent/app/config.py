import os
from dataclasses import dataclass, field

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:  # dotenv is optional
    pass


@dataclass
class Settings:
    anthropic_api_key: str = field(default_factory=lambda: os.getenv("ANTHROPIC_API_KEY", ""))
    llm_model: str = field(default_factory=lambda: os.getenv("LLM_MODEL", "claude-sonnet-5-5"))
    backend_mode: str = field(default_factory=lambda: os.getenv("BACKEND_MODE", "mock"))
    product_api_url: str = field(default_factory=lambda: os.getenv("PRODUCT_API_URL", "http://localhost:8001"))
    inventory_api_url: str = field(default_factory=lambda: os.getenv("INVENTORY_API_URL", "http://localhost:8002"))
    cors_origins: list = field(
        default_factory=lambda: [o.strip() for o in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",") if o.strip()]
    )
    max_tool_steps: int = 6

    @property
    def llm_enabled(self) -> bool:
        return bool(self.anthropic_api_key)


def get_settings() -> Settings:
    return Settings()
