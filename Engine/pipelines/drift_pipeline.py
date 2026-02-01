import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pyod.models.iforest import IForest
import pandas as pd
from data.synthetic.generate_lifestyle import generate_user
def detect_drift(df):
    baseline = df.iloc[:30][["sleep_hours", "steps"]]
    model = IForest(contamination=0.15)
    model.fit(baseline.values)

    scores = model.decision_function(df[["sleep_hours", "steps"]].values)

    df["drift_score"] = scores
    df["drift_flag"] = model.predict(df[["sleep_hours", "steps"]].values)

    return df

def drift_severity(df):
    recent = df.tail(7)
    score = abs(recent["drift_score"].mean())
    return min(round(score, 2), 1.0)

if __name__ == "__main__":
    df = generate_user()
    result = detect_drift(df)
    print(result.tail())
