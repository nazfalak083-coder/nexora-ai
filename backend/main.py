
import os
import json
import sqlite3
import time
import asyncio
from pathlib import Path
from typing import List

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

load_dotenv()

DB_PATH = Path(__file__).with_name("nexora.db")

app = FastAPI(title="NEXORA AI API", version="1.0.0")

origins = [
    x.strip()
    for x in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173"
    ).split(",")
    if x.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


with db() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            message TEXT,
            created_at INTEGER NOT NULL
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at INTEGER NOT NULL
        )
    """)


class Message(BaseModel):
    role: str
    content: str = Field(max_length=12000)


class ChatRequest(BaseModel):
    messages: List[Message] = Field(min_length=1, max_length=30)


class LeadRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=254)
    message: str = Field(default="", max_length=2000)


def system_prompt():
    name = os.getenv("BUSINESS_NAME", "Your Business")
    desc = os.getenv("BUSINESS_DESCRIPTION", "")
    context = os.getenv("BUSINESS_CONTEXT", "")

    return f"""You are the helpful, accurate customer assistant for {name}.

Business description:
{desc}

Approved business information:
{context}

Rules:
- Answer clearly, warmly, and concisely.
- Use only the approved business information for business-specific facts.
- Never invent prices, policies, stock, delivery dates, guarantees, or contact details.
- If information is missing, say so and offer to connect the customer with the team.
- Ask one question at a time when clarification is needed.
- Do not claim an order, booking, refund, or account change was completed unless a connected system confirms it.
- You may help visitors understand services and invite them to leave contact details.
"""


@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "NEXORA AI",
        "model": os.getenv("LLM_MODEL", "not-configured")
    }


@app.post("/api/chat")
async def chat(payload: ChatRequest):

    api_key = os.getenv("LLM_API_KEY", "").strip()

    if not api_key or api_key == "put_your_provider_key_here":
        raise HTTPException(
            status_code=503,
            detail="Add your LLM_API_KEY to backend/.env to enable live AI replies."
        )

    clean = []

    for m in payload.messages:
        if m.role not in ("user", "assistant"):
            raise HTTPException(
                status_code=400,
                detail="Invalid message role."
            )

        clean.append({
            "role": m.role,
            "content": m.content
        })

    body = {
        "model": os.getenv("LLM_MODEL", "gpt-4o-mini"),
        "messages": [
            {"role": "system", "content": system_prompt()}
        ] + clean,
        "temperature": 0.4,
        "stream": True
    }

    base = os.getenv(
        "LLM_BASE_URL",
        "https://api.openai.com/v1"
    ).rstrip("/")

    retry_statuses = (429, 500, 502, 503, 504)

    async def stream():

        async with httpx.AsyncClient(
            timeout=httpx.Timeout(60.0, connect=15.0)
        ) as client:

            for attempt in range(3):

                try:
                    async with client.stream(
                        "POST",
                        base + "/chat/completions",
                        headers={
                            "Authorization": f"Bearer {api_key}",
                            "Content-Type": "application/json"
                        },
                        json=body
                    ) as response:

                        if response.status_code >= 400:

                            detail = (
                                (await response.aread())
                                .decode("utf-8", "ignore")[:500]
                            )

                            if (
                                response.status_code in retry_statuses
                                and attempt < 2
                            ):
                                await asyncio.sleep(attempt + 1)
                                continue

                            yield "data: " + json.dumps({
                                "error": (
                                    f"LLM provider error "
                                    f"({response.status_code}): {detail}"
                                )
                            }) + "\n\n"

                            return

                        async for line in response.aiter_lines():

                            if not line.startswith("data:"):
                                continue

                            raw = line[5:].strip()

                            if raw == "[DONE]":
                                yield "data: [DONE]\n\n"
                                return

                            try:
                                obj = json.loads(raw)

                                delta = (
                                    obj.get("choices", [{}])[0]
                                    .get("delta", {})
                                    .get("content")
                                )

                                if delta:
                                    yield "data: " + json.dumps({
                                        "content": delta
                                    }) + "\n\n"

                            except (json.JSONDecodeError, IndexError, KeyError):
                                continue

                        yield "data: [DONE]\n\n"
                        return

                except httpx.HTTPError:

                    if attempt < 2:
                        await asyncio.sleep(attempt + 1)
                        continue

                    yield "data: " + json.dumps({
                        "error": "Could not reach the LLM provider. Please try again."
                    }) + "\n\n"

                    return

    with db() as conn:
        conn.execute(
            "INSERT INTO conversations(created_at) VALUES(?)",
            (int(time.time()),)
        )

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )


@app.post("/api/leads")
def create_lead(payload: LeadRequest):

    if (
        "@" not in payload.email
        or "." not in payload.email.split("@")[-1]
    ):
        raise HTTPException(
            status_code=422,
            detail="Please enter a valid email address."
        )

    with db() as conn:
        conn.execute(
            """
            INSERT INTO leads(name, email, message, created_at)
            VALUES(?,?,?,?)
            """,
            (
                payload.name.strip(),
                payload.email.strip(),
                payload.message.strip(),
                int(time.time())
            )
        )

    return {
        "ok": True,
        "message": "Thanks — your details have been received."
    }


@app.get("/api/admin/summary")
def admin_summary():

    # Protect this endpoint with authentication before public deployment.

    with db() as conn:
        leads = conn.execute(
            "SELECT COUNT(*) n FROM leads"
        ).fetchone()["n"]

        chats = conn.execute(
            "SELECT COUNT(*) n FROM conversations"
        ).fetchone()["n"]

    return {
        "leads": leads,
        "conversations": chats
    }