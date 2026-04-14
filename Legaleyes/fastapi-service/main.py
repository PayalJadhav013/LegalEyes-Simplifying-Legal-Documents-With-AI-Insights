"""
LegalEyes — FastAPI AI Service
RAG pipeline: ingest -> embed -> ChromaDB -> retrieve -> GPT-4o-mini
"""
import os
import logging
from typing import Optional

import openai
import chromadb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("legaleyes.ai")

app = FastAPI(title="LegalEyes AI Service", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

EMBED_MODEL     = "text-embedding-3-small"
CHAT_MODEL      = "gpt-4o-mini"
COLLECTION_NAME = "legaleyes_docs"

_openai_client = None
_chroma_client = None


def get_openai_client():
    global _openai_client
    if _openai_client is None:
        key = os.environ.get("OPENAI_API_KEY", "")
        if not key:
            raise HTTPException(503, "OPENAI_API_KEY not set")
        _openai_client = openai.OpenAI(api_key=key)
        logger.info("OpenAI client initialised")
    return _openai_client


def get_collection():
    global _chroma_client
    if _chroma_client is None:
        host = os.getenv("CHROMA_HOST", "localhost")
        port = int(os.getenv("CHROMA_PORT", "8000"))
        _chroma_client = chromadb.HttpClient(host=host, port=port)
        logger.info("Chroma client initialised at %s:%s", host, port)
    return _chroma_client.get_or_create_collection(
        name=COLLECTION_NAME, metadata={"hnsw:space": "cosine"})


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 150) -> list[str]:
    if not text.strip():
        return []
    chunks, start = [], 0
    while start < len(text):
        chunks.append(text[start:start + chunk_size])
        start += chunk_size - overlap
    return chunks


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    resp = get_openai_client().embeddings.create(model=EMBED_MODEL, input=texts)
    return [item.embedding for item in resp.data]


# ── Pydantic Models ────────────────────────────────────────────────────────

class IngestRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    document_id: str           = Field(alias="documentId")
    file_name:   str           = Field(alias="fileName")
    content:     str
    user_id:     Optional[str] = Field(default="anonymous", alias="userId")


class ChatMessage(BaseModel):
    role:    str
    content: str


class ChatRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    messages:    list[ChatMessage]
    document_id: Optional[str] = Field(default=None, alias="documentId")
    action:      Optional[str] = None
    user_id:     Optional[str] = Field(default="anonymous", alias="userId")


# ── System prompts ─────────────────────────────────────────────────────────

SYSTEM_BASE = """You are LegalEyes, an expert Indian legal assistant. You:
- Explain legal documents in plain, simple language
- Identify key clauses, obligations, rights, and potential risks
- Guide citizens through Indian government procedures and documentation
- Answer questions about Indian law clearly and concisely
Always recommend consulting a qualified lawyer for critical decisions.
Respond in the same language the user uses."""

ACTION_PROMPTS = {
    "summarise": "Task: Provide a structured summary with sections: Overview, Key Parties, Main Obligations, Important Dates/Deadlines, and Risks or Red Flags.",
    "highlight": "Task: Identify (a) the most important clauses, (b) unusual or potentially risky terms, (c) what the user should negotiate or clarify before signing.",
    "simplify":  "Task: Explain the entire document in plain everyday language. No legal jargon. Short sentences. Anyone can understand it.",
    "risks":     "Task: Focus specifically on identifying potential risks, red flags, one-sided clauses, and anything that could be harmful to the user.",
}


# ── Endpoints ──────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status":      "ok",
        "service":     "LegalEyes AI Service",
        "embed_model": EMBED_MODEL,
        "chat_model":  CHAT_MODEL,
    }


@app.post("/api/ai/ingest")
async def ingest(req: IngestRequest):
    logger.info("Ingesting doc_id=%s file=%s", req.document_id, req.file_name)
    chunks = chunk_text(req.content)
    if not chunks:
        raise HTTPException(400, "No extractable text content")

    logger.info("Embedding %d chunks with %s", len(chunks), EMBED_MODEL)
    vectors = embed_texts(chunks)

    coll  = get_collection()
    ids   = [f"{req.document_id}_chunk_{i}" for i in range(len(chunks))]
    metas = [
        {"document_id": req.document_id, "file_name": req.file_name,
         "user_id": req.user_id or "anonymous", "chunk_index": i}
        for i in range(len(chunks))
    ]

    coll.upsert(ids=ids, embeddings=vectors, documents=chunks, metadatas=metas)
    logger.info("Stored %d vectors for doc_id=%s", len(chunks), req.document_id)
    return {"documentId": req.document_id, "chunksStored": len(chunks)}


@app.post("/api/ai/chat")
async def chat(req: ChatRequest):
    if not req.messages:
        raise HTTPException(400, "messages list is empty")

    last_user = next(
        (m.content for m in reversed(req.messages) if m.role == "user"), "")

    # Step 1: Semantic retrieval
    context_text, sources_count = "", 0
    if req.document_id and req.document_id.strip() and last_user:
        try:
            query_vec = embed_texts([last_user])[0]
            coll      = get_collection()
            results   = coll.query(
                query_embeddings=[query_vec],
                n_results=5,
                where={"document_id": req.document_id},
                include=["documents", "distances"],
            )
            hits = results["documents"][0] if results["documents"] else []
            if hits:
                context_text  = "\n\n---\n\n".join(hits)
                sources_count = len(hits)
                logger.info("Retrieved %d context chunks", sources_count)
        except Exception as e:
            logger.warning("Search failed, continuing without context: %s", e)

    # Step 2: Build system prompt
    system_prompt = SYSTEM_BASE
    if req.action and req.action in ACTION_PROMPTS:
        system_prompt += f"\n\n{ACTION_PROMPTS[req.action]}"
    if context_text:
        system_prompt += f"\n\n## Relevant Document Context\n\n{context_text}"

    # Step 3: Call GPT-4o-mini
    oai_messages = [{"role": "system", "content": system_prompt}]
    for msg in req.messages[-10:]:
        oai_messages.append({"role": msg.role, "content": msg.content})

    completion = get_openai_client().chat.completions.create(
        model=CHAT_MODEL,
        messages=oai_messages,
        max_tokens=1024,
        temperature=0.3,
    )

    reply = completion.choices[0].message.content or "Sorry, I could not generate a response."
    logger.info("Chat reply generated, sources_used=%d", sources_count)
    return {"reply": reply, "sourcesUsed": sources_count}


@app.delete("/api/ai/document/{document_id}")
async def delete_document(document_id: str):
    logger.info("Deleting vectors for doc_id=%s", document_id)
    coll = get_collection()
    coll.delete(where={"document_id": document_id})
    return {"message": f"Vectors for document {document_id} deleted successfully"}
