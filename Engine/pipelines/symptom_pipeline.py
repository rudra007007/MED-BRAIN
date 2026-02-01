import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from transformers import pipeline
from models.symptom_normalizer import normalize_symptom
from models.phrase_merger import merge_adjacent_entities

ner = pipeline(
    "ner",
    model="d4data/biomedical-ner-all",
    aggregation_strategy="simple"
)

def extract_symptoms(text):
    entities = ner(text)
    entities = merge_adjacent_entities(entities)

    symptoms = []
    for e in entities:
        if e["score"] < 0.6:
            continue

        if e["word"].lower() in ["today", "now", "yesterday"]:
            continue

        normalized = normalize_symptom(e["word"])

        symptoms.append({
            "raw": e["word"],
            "normalized": normalized,
            "confidence": round(e["score"], 2)
        })

    return symptoms