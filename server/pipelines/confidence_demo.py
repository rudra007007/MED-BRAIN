import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pipelines.symptom_pipeline import extract_symptoms
from data.synthetic.generate_lifestyle import generate_user
from pipelines.drift_pipeline import detect_drift, drift_severity
from models.confidence import (
    symptom_confidence,
    alert_confidence,
    uncertainty_state
)

# symptoms
symptoms = extract_symptoms(
    "I feel chest tightness and shortness of breath"
)

# lifestyle
df = generate_user()
df = detect_drift(df)

# confidence
symp_conf = symptom_confidence(symptoms)
drift_conf = drift_severity(df)
final_conf = alert_confidence(symp_conf, drift_conf)
state = uncertainty_state(final_conf)

print("Symptom confidence:", symp_conf)
print("Drift severity:", drift_conf)
print("Alert confidence:", final_conf)
print("State:", state)
