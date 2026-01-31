from transformers import pipeline

ner = pipeline(
    "ner",
    model="d4data/biomedical-ner-all",
    aggregation_strategy="simple"
)

def extract_symptoms(text):
    entities = ner(text)
    symptoms = []
    for e in entities:
        symptoms.append({
            "text": e["word"],
            "confidence": round(e["score"], 2)
        })
    return symptoms

if __name__ == "__main__":
    text = "I feel chest tightness and shortness of breath"
    print(extract_symptoms(text))
