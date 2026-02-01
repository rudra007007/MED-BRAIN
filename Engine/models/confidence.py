def symptom_confidence(symptoms):
    if not symptoms:
        return 0.0

    return round(
        sum(s["confidence"] for s in symptoms) / len(symptoms),
        2
    )

def alert_confidence(symptom_conf, drift_sev):
    return round(
        0.5 * symptom_conf + 0.5 * drift_sev,
        2
    )

def uncertainty_state(confidence):
    if confidence < 0.4:
        return "LOW_CONFIDENCE_MONITOR"
    elif confidence < 0.7:
        return "MODERATE_CONFIDENCE"
    else:
        return "HIGH_CONFIDENCE"
