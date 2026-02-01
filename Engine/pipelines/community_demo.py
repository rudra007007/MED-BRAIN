import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from data.synthetic.generate_population import generate_population
from pipelines.drift_pipeline import detect_drift
from pipelines.anonymize import anonymize_user_signal
from pipelines.community_pipeline import (
    aggregate_signals,
    detect_weak_signal
)

population = generate_population(num_users=30, region="Zone-A")

signals = []
for user in population:
    df = detect_drift(user["data"])

    recent = df.tail(10)

    sleep_drop = (
        df.sleep_hours.iloc[:30].mean()
        - recent.sleep_hours.mean()
    )
    
    steps_drop = (
        df.steps.iloc[:30].mean()
        - recent.steps.mean()
    )
    
    drift_detected = (
        recent.drift_flag.sum() >= 3 and
        sleep_drop > 1.0 and
        steps_drop > 1500
    )


    signals.append(
        anonymize_user_signal(
            user["user_id"],
            user["region"],
            drift_detected
        )
    )

summary = aggregate_signals(signals)
alerts = detect_weak_signal(summary)

print("Community summary:")
print(summary)
print("\nAlerts:")
print(alerts)
