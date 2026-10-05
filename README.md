# NEXORA AI — Universal Business Assistant

A premium dark-mode, multi-business AI chatbot starter built with React + Vite and FastAPI.
It supports streamed LLM responses through an OpenAI-compatible API, business-specific system instructions,
lead capture, a simple admin analytics endpoint, and a configurable knowledge context.

## Requirements
- Node.js 18+
- Python 3.10+
- An API key for an OpenAI-compatible LLM provider

## Run locally

### 1) Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
# Edit .env and add your API key
uvicorn main:app --reload --port 8000
```

### 2) Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL (usually http://localhost:5173).

## Configure a client
Edit `backend/.env`:
- `BUSINESS_NAME`
- `BUSINESS_DESCRIPTION`
- `BUSINESS_CONTEXT` (paste approved FAQs, policies, products, service details)
- `LLM_BASE_URL` and `LLM_MODEL` for your chosen provider

The starter sends business context with each request. For large document collections, add a production RAG pipeline
(vector database + document chunking + retrieval) before selling document-grounded answers as a finished feature.

## API
- `GET /health`
- `POST /api/chat` — streamed Server-Sent Events response
- `POST /api/leads` — stores lead submissions in a local SQLite database
- `GET /api/admin/summary` — basic conversation and lead counts

## Important production checklist
This is a working starter, not a finished $2,000 enterprise deployment. Before client delivery:
- Add authentication and role-based admin access.
- Replace local SQLite with managed PostgreSQL.
- Add persistent conversation history, rate limiting, abuse controls, and monitoring.
- Add document upload + RAG retrieval and source citations.
- Add privacy policy, data retention controls, consent, and client-specific security review.
- Configure HTTPS, backups, error tracking, and provider billing limits.
- Never expose API keys in frontend code.
- Agree on scope, support, hosting, and usage costs with each customer.

A $2,000 price is a commercial target, not a guaranteed valuation or sale.
