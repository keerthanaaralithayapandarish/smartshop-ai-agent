"""The SmartShop AI agent: understands the question, picks tools, builds an evidence-backed answer.

Two modes:
  * LLM mode      (ANTHROPIC_API_KEY set)  -> Claude decides which tools to call (tool-calling loop)
  * rule-based    (no key / LLM error)     -> keyword + regex pipeline, no external calls
Both use the same ToolRunner, so the frontend always receives the same response shape."""
import json
import uuid
from typing import Any, Optional

from .config import Settings
from .intent import detect_intents, extract_requirements, find_mentioned_products, has_explicit_search
from .schemas import ChatResponse, Requirements, ToolCallLog
from .tools import TOOL_SCHEMAS, TOOL_TO_INTENT, ToolRunner, summarize

UNANSWERABLE_MARKER = "[[UNANSWERABLE]]"

SYSTEM_PROMPT = f"""You are SmartShop AI, a shopping assistant for an electronics store.

Your job:
1. Understand what the customer needs: budget, RAM, storage, processor, category, use-case.
2. Decide what is needed: product search, comparison, compatibility checking, stock checking, or detailed
   product info. Use the provided tools. You may call several tools in one turn.
3. Answer ONLY from tool results. Never invent products, prices, specs, stock numbers or compatibility facts.
4. Support claims with evidence: mention product names, concrete spec values, and manual/spec-sheet sources
   returned by get_evidence (cite the 'source' field). When recommending or comparing, call get_evidence if
   a manual could confirm the claim.
5. Prices are in INR (₹). Stock answers should name the store, area and quantity, nearest first.
6. If the tools do not return enough data to answer (unknown product, no manual text, question unrelated to
   shopping, request for something not in the catalogue), say so plainly, do not guess, suggest what you CAN
   help with, and begin your reply with the exact marker {UNANSWERABLE_MARKER}.
7. If key info is missing (e.g. which laptop for a compatibility check), ask ONE short clarifying question.

Style: friendly, concise, plain text (no markdown tables). Product ids look like L-A, ACC-RAM.
Resolve product names to ids via search_products if you only have a name."""


class Ctx:
    """Collects everything the frontend needs from the tool calls of one turn."""

    def __init__(self):
        self.calls: list[ToolCallLog] = []
        self.intents: list[str] = []
        self.products: dict[str, dict] = {}
        self.comparison: Optional[dict] = None
        self.stock: list[dict] = []
        self.evidence: list[dict] = []
        self.compat: list[dict] = []
        self.had_error = False

    def absorb(self, name: str, args: dict, result: Any):
        self.calls.append(ToolCallLog(tool=name, arguments=args, result_summary=summarize(result)))
        intent = TOOL_TO_INTENT.get(name)
        if intent and intent not in self.intents:
            self.intents.append(intent)
        if isinstance(result, dict) and "error" in result:
            self.had_error = True
            return
        if name == "search_products" and isinstance(result, list):
            for p in result:
                self.products[p["id"]] = p
        elif name == "compare_products" and isinstance(result, dict):
            self.comparison = result
            for p in result.get("products", []):
                self.products[p["id"]] = p
        elif name == "check_stock" and isinstance(result, dict):
            pid = result.get("product_id", args.get("product_id"))
            pname = self.products.get(pid, {}).get("name", pid)
            for row in result.get("stores", []):
                self.stock.append({"product_id": pid, "product_name": pname, **row})
        elif name == "get_evidence" and isinstance(result, list):
            self.evidence.extend(result)
        elif name == "check_compatibility" and isinstance(result, dict):
            self.compat.append(result)


class ShopAgent:
    def __init__(self, backend, settings: Settings):
        self.backend = backend
        self.settings = settings
        self.tools = ToolRunner(backend)
        self.sessions: dict[str, dict] = {}
        self._client = None
        if settings.llm_enabled:
            import anthropic
            self._client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    # ------------------------------------------------------------------ public
    def chat(self, message: str, session_id: Optional[str] = None) -> ChatResponse:
        sid = session_id or str(uuid.uuid4())
        s = self.sessions.setdefault(sid, {"history": [], "last_products": [], "req": Requirements()})

        new_req = extract_requirements(message)
        s["req"] = self._merge_req(s["req"], new_req)

        ctx = Ctx()
        mode = "rule-based"
        reply, answerable = None, True
        if self._client:
            try:
                reply, answerable = self._run_llm(s, message, ctx)
                mode = "llm"
            except Exception as exc:  # network/auth/etc -> degrade gracefully
                print(f"[agent] LLM failed, falling back to rules: {exc}")
                ctx = Ctx()
        if reply is None:
            reply, answerable = self._run_rules(s, message, ctx)

        if ctx.products:
            s["last_products"] = list(ctx.products.values())[:3]
        # in rule mode intents come from keywords; in LLM mode from tools actually called
        intents = ctx.intents or detect_intents(message, new_req)
        if len(intents) > 1 and "product_info" in intents and ctx.evidence:
            # evidence lookups often just back up another intent; keep the primary ones
            intents = [i for i in intents if i != "product_info"] or intents

        return ChatResponse(
            session_id=sid, reply=reply, intents=intents, requirements=s["req"],
            products=list(ctx.products.values()), comparison=ctx.comparison, stock=ctx.stock,
            evidence=ctx.evidence, tool_calls=ctx.calls, answerable=answerable, mode=mode,
        )

    def reset(self, session_id: str):
        self.sessions.pop(session_id, None)

    # --------------------------------------------------------------- LLM mode
    def _run_llm(self, s: dict, message: str, ctx: Ctx) -> tuple[str, bool]:
        history = s["history"]
        history.append({"role": "user", "content": message})
        text = ""
        for _ in range(self.settings.max_tool_steps):
            resp = self._client.messages.create(
                model=self.settings.llm_model, max_tokens=1024, system=SYSTEM_PROMPT,
                tools=TOOL_SCHEMAS, messages=history,
            )
            blocks = []
            for b in resp.content:
                if b.type == "text":
                    blocks.append({"type": "text", "text": b.text})
                elif b.type == "tool_use":
                    blocks.append({"type": "tool_use", "id": b.id, "name": b.name, "input": b.input})
            history.append({"role": "assistant", "content": blocks})

            if resp.stop_reason != "tool_use":
                text = "".join(b["text"] for b in blocks if b["type"] == "text").strip()
                break

            results = []
            for b in blocks:
                if b["type"] != "tool_use":
                    continue
                out = self.tools.run(b["name"], b["input"])
                ctx.absorb(b["name"], b["input"], out)
                results.append({"type": "tool_result", "tool_use_id": b["id"],
                                "content": json.dumps(out, default=str)})
            history.append({"role": "user", "content": results})
        else:
            text = "Sorry, I couldn't finish working that out. Could you rephrase or narrow your question?"

        answerable = UNANSWERABLE_MARKER not in text
        text = text.replace(UNANSWERABLE_MARKER, "").strip()
        # keep history bounded
        if len(history) > 30:
            del history[:-30]
            while history and not (history[0]["role"] == "user" and isinstance(history[0]["content"], str)):
                history.pop(0)
        return text or "Sorry, I didn't get a response. Please try again.", answerable

    # -------------------------------------------------------- rule-based mode
    def _call(self, ctx: Ctx, name: str, **args):
        args = {k: v for k, v in args.items() if v is not None}
        out = self.tools.run(name, args)
        ctx.absorb(name, args, out)
        return out

    def _run_rules(self, s: dict, message: str, ctx: Ctx) -> tuple[str, bool]:
        req = s["req"]
        msg_req = extract_requirements(message)
        intents = detect_intents(message, msg_req)
        capabilities = ("I can help you find products within your budget, compare them, check compatibility "
                        "(e.g. RAM/SSD with a laptop), and see which stores have them in stock.")
        try:
            catalog = self.backend.list_products()
        except Exception:
            return "I can't reach the product catalogue right now. Please try again in a moment.", False

        mentioned = find_mentioned_products(message, catalog)
        follow_up = False
        if not mentioned and s["last_products"] and set(intents) & {"stock_check", "product_info", "compatibility_check"}:
            mentioned, follow_up = list(s["last_products"]), True

        if not intents and not mentioned:
            return ("I'm not sure how to help with that. " + capabilities +
                    " Try something like: 'Laptop under 60000 with 16GB RAM'."), False

        # "What is the GPU of Laptop A?" -> a question about a named product, not a catalogue search
        if mentioned and intents == ["product_search"] and not has_explicit_search(message):
            intents = ["product_info"]

        lines: list[str] = []
        answerable = True

        # 1) search
        if "product_search" in intents or (not mentioned and set(intents) & {"comparison", "stock_check"}):
            found = self._call(ctx, "search_products", max_price=msg_req.budget_max or req.budget_max,
                               min_ram_gb=msg_req.min_ram_gb or req.min_ram_gb,
                               min_storage_gb=msg_req.min_storage_gb or req.min_storage_gb,
                               processor=msg_req.processor or req.processor,
                               category=msg_req.category or req.category)
            if isinstance(found, list) and found:
                if not mentioned:
                    mentioned = found[:3] if "comparison" not in intents else found[:2]
                lines.append("Here is what matches your requirements:")
                for p in found[:5]:
                    lines.append("- " + self._describe(p))
            else:
                lines.append("I couldn't find any products matching those requirements in our catalogue. "
                             "Try raising the budget or relaxing a spec.")
                answerable = False
                mentioned = []

        # 2) comparison
        if "comparison" in intents:
            ids = [p["id"] for p in mentioned][:3]
            if len(ids) >= 2:
                cmp_ = self._call(ctx, "compare_products", product_ids=ids)
                if isinstance(cmp_, dict) and "rows" in cmp_:
                    names = {p["id"]: p["name"] for p in cmp_["products"]}
                    lines.append("Comparison:")
                    for row in cmp_["rows"]:
                        vals = "; ".join(f"{names[i]}: {v}" for i, v in row["values"].items())
                        lines.append(f"- {row['field']}: {vals}")
                else:
                    lines.append("I couldn't compare those products from the available data.")
                    answerable = False
            elif answerable:
                lines.append("Which two products would you like me to compare? For example: 'Compare Laptop A and Laptop B'.")

        # 3) compatibility
        if "compatibility_check" in intents:
            laptops = [p for p in mentioned if p["category"] == "laptop"]
            accs = [p for p in mentioned if p["category"] != "laptop"]
            if laptops and accs:
                for lp in laptops:
                    for acc in accs:
                        r = self._call(ctx, "check_compatibility", product_id=lp["id"], other_id=acc["id"])
                        if isinstance(r, dict) and r.get("compatible") is not None:
                            verdict = "compatible" if r["compatible"] else "NOT compatible"
                            lines.append(f"{acc['name']} is {verdict} with {lp['name']}. {r['reason']}")
                        else:
                            lines.append(f"I can't confirm compatibility of {acc['name']} with {lp['name']}.")
                            answerable = False
                    self._call(ctx, "get_evidence", query=f"{' '.join(a['category'] for a in accs)} memory slots support",
                               product_id=lp["id"])
            else:
                lines.append("Tell me which laptop and which accessory (RAM, SSD, bag...) to check. "
                             "For example: 'Is the DDR4 16GB RAM Module compatible with Laptop C?'")

        # 4) stock
        if "stock_check" in intents:
            targets = mentioned[:3]
            if targets:
                for p in targets:
                    r = self._call(ctx, "check_stock", product_id=p["id"])
                    if isinstance(r, dict) and "stores" in r:
                        avail = [x for x in r["stores"] if x["quantity"] > 0]
                        if avail:
                            where = "; ".join(f"{x['store']} ({x['area']}, {x['distance_km']} km): {x['quantity']} in stock"
                                              for x in avail)
                            lines.append(f"{p['name']} is available at: {where}.")
                        else:
                            lines.append(f"{p['name']} is currently out of stock at all stores.")
                    else:
                        lines.append(f"I don't have inventory data for {p['name']}.")
                        answerable = False
            else:
                lines.append("Which product should I check stock for?")

        # 5) product info / evidence
        info_needed = "product_info" in intents
        if info_needed:
            pid = mentioned[0]["id"] if len(mentioned) == 1 else None
            ev = self._call(ctx, "get_evidence", query=message, product_id=pid)
            if isinstance(ev, list) and ev:
                lines.append("From the product documents:")
                for d in ev[:3]:
                    lines.append(f"- {d['text']} (source: {d['source']})")
            else:
                lines.append("I couldn't find that in the available product manuals or specifications, "
                             "so I'd rather not guess.")
                answerable = False

        # evidence footer for search/compare answers
        if ctx.evidence and "product_info" not in intents:
            lines.append("Supporting evidence:")
            seen = set()
            for d in ctx.evidence:
                if d["source"] not in seen:
                    seen.add(d["source"])
                    lines.append(f"- {d['text']} (source: {d['source']})")

        if not lines:
            return capabilities, False
        if follow_up and mentioned:
            lines.insert(0, f"(Talking about {', '.join(p['name'] for p in mentioned)})")
        return "\n".join(lines), answerable

    @staticmethod
    def _describe(p: dict) -> str:
        bits = [f"{p['name']} (₹{p['price']:,.0f})"]
        for key, label in (("processor", ""), ("ram_gb", "GB RAM"), ("storage_gb", "GB storage")):
            if p.get(key) is not None:
                bits.append(f"{p[key]} {label}".strip())
        return ", ".join(bits)

    @staticmethod
    def _merge_req(old: Requirements, new: Requirements) -> Requirements:
        merged = old.model_copy()
        for k, v in new.model_dump().items():
            if v is not None:
                setattr(merged, k, v)
        return merged
