import re

TEMPORAL_WORDS = ["today", "now", "yesterday", "tonight", "morning", "evening"]

def normalize_symptom(text):
    text = text.lower()

    # remove temporal words
    for w in TEMPORAL_WORDS:
        text = re.sub(rf"\b{w}\b", "", text)

    # clean punctuation & extra spaces
    text = re.sub(r"[^a-z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    synonyms = {
        "chest tightness": "chest discomfort",
        "tight chest": "chest discomfort",
        "pressure in chest": "chest discomfort",
        "chest pressure": "chest discomfort",
        "shortness of breath": "breathing difficulty",
        "breathing difficulty": "breathing difficulty",
        "fatigue": "fatigue",
        "tired": "fatigue"
    }

    return synonyms.get(text, text)
