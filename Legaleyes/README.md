# LegalEyes Backend — Setup Guide

## Architecture
```
React UI (port 5173)
  → [Vite proxy /api]
  → Spring Boot (port 8080)   — REST API + JWT Auth + Apache Tika
      → PostgreSQL (port 5432) — Users + Document metadata
      → FastAPI (port 8001)    — RAG: Embeddings + ChromaDB + GPT-4o-mini
          → ChromaDB (port 8000) — Vector store
          → OpenAI API           — text-embedding-3-small + gpt-4o-mini
```

## Step 1 — Create .env file
```
cd legaleyes-backend
echo OPENAI_API_KEY=sk-proj-your-key > .env
```

## Step 2 — Start backend (Docker)
```
docker compose up --build
```
Wait until all 4 containers show (healthy).

## Step 3 — Apply frontend changes
Copy files from frontend-updates/ into the team-builder-main project:

| Source (frontend-updates/)          | Destination (team-builder-main/)          |
|-------------------------------------|-------------------------------------------|
| src/contexts/AuthContext.tsx        | src/contexts/AuthContext.tsx    (REPLACE)  |
| src/pages/Login.tsx                 | src/pages/Login.tsx             (REPLACE)  |
| src/pages/Signup.tsx                | src/pages/Signup.tsx            (REPLACE)  |
| src/pages/AIAnalyser.tsx            | src/pages/AIAnalyser.tsx        (REPLACE)  |
| vite.config.ts                      | vite.config.ts                  (REPLACE)  |

## Step 4 — Start frontend
```
cd team-builder-main
npm install
npm run dev
```
Open http://localhost:5173

## API Endpoints

### Auth (public)
POST /api/auth/register  { email, password, fullName }
POST /api/auth/login     { email, password }

### Documents (requires Bearer token)
POST   /api/documents/upload   multipart file
GET    /api/documents
DELETE /api/documents/{id}
POST   /api/chat               { messages, documentId?, action? }

### Health
GET /api/health

## Troubleshooting
- 401 errors: Token expired — log in again
- 422 from FastAPI: Pydantic alias issue — check Field(alias=...) in models
- Build failure: docker compose build --no-cache springboot
