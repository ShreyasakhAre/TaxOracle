from __future__ import annotations

import math
import re
from collections import Counter


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9_]+", text.lower())


def build_chunks(text: str, chunk_size: int = 450, overlap: int = 60) -> list[str]:
    normalized = " ".join(text.split())
    if not normalized:
        return []

    chunks: list[str] = []
    start = 0
    while start < len(normalized):
        end = min(len(normalized), start + chunk_size)
        chunks.append(normalized[start:end])
        if end == len(normalized):
            break
        start = max(0, end - overlap)
    return chunks


def _cosine(a: Counter[str], b: Counter[str]) -> float:
    if not a or not b:
        return 0.0
    dot = sum(a[t] * b[t] for t in a.keys() & b.keys())
    na = math.sqrt(sum(v * v for v in a.values()))
    nb = math.sqrt(sum(v * v for v in b.values()))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def answer_question(question: str, chunks: list[str]) -> dict:
    qvec = Counter(_tokenize(question))
    if not qvec or not chunks:
        return {
            "answer": "No indexed content is available for answering this question yet.",
            "confidence": 0.0,
            "source_excerpt": "",
        }

    best_chunk = ""
    best_score = 0.0
    for c in chunks:
        score = _cosine(qvec, Counter(_tokenize(c)))
        if score > best_score:
            best_score = score
            best_chunk = c

    if best_score < 0.03:
        return {
            "answer": "I could not find a strong match in the processed document for this question.",
            "confidence": round(best_score, 3),
            "source_excerpt": best_chunk[:240],
        }

    return {
        "answer": f"Based on the processed document, this is the most relevant section: {best_chunk[:300]}",
        "confidence": round(best_score, 3),
        "source_excerpt": best_chunk[:300],
    }
