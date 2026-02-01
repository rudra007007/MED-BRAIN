#!/usr/bin/env python3
"""
Symptom extraction API wrapper for Node.js backend
Receives JSON input via stdin and outputs JSON to stdout
"""

import sys
import json
from pathlib import Path

# Add Engine directory to path
engine_path = Path(__file__).parent
sys.path.insert(0, str(engine_path))

from transformers import pipeline
from models.symptom_normalizer import normalize_symptom
from models.phrase_merger import merge_adjacent_entities

# Initialize NER model
ner = pipeline(
    "ner",
    model="d4data/biomedical-ner-all",
    aggregation_strategy="simple"
)

def extract_symptoms(text):
    """Extract symptoms from text using NER model"""
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

def main():
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        text = input_data.get("text", "")
        
        if not text:
            raise ValueError("No text provided")
        
        # Extract symptoms
        symptoms = extract_symptoms(text)
        
        # Output JSON to stdout
        output = {
            "success": True,
            "data": symptoms
        }
        print(json.dumps(output))
        
    except Exception as e:
        # Output error as JSON
        error_output = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_output))
        sys.exit(1)

if __name__ == "__main__":
    main()
