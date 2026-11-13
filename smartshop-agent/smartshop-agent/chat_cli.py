"""Quick terminal chat to test the agent without the frontend:  python chat_cli.py"""
from app.agent import ShopAgent
from app.backend_clients import get_backend
from app.config import get_settings

settings = get_settings()
agent = ShopAgent(get_backend(settings), settings)
print(f"SmartShop AI  (mode: {'LLM' if settings.llm_enabled else 'rule-based'}, backend: {settings.backend_mode})")
print("Type 'quit' to exit.\n")
sid = None
while True:
    msg = input("You: ").strip()
    if msg.lower() in {"quit", "exit"}:
        break
    if not msg:
        continue
    r = agent.chat(msg, sid)
    sid = r.session_id
    print(f"\nBot: {r.reply}")
    print(f"     [intents={r.intents} | tools={[c.tool for c in r.tool_calls]} | answerable={r.answerable}]\n")
