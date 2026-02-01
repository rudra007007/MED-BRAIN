import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pipelines.symptom_pipeline import extract_symptoms
from models.symptom_graph import SymptomGraph

graph = SymptomGraph()

texts = [
    "I have chest tightness and shortness of breath",
    "Breathing difficulty and fatigue today",
    "Chest pressure with fatigue"
]

for day, t in enumerate(texts):
    symptoms = extract_symptoms(t)
    graph.update_graph(symptoms, day)

print(graph.graph.edges(data=True))
