import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from pyod.models.iforest import IForest
import pandas as pd
from data.synthetic.generate_lifestyle import generate_user
def detect_drift(df):
    baseline = df.iloc[:30][["sleep_hours", "steps"]]
    model = IForest(contamination=0.15)
    model.fit(baseline)

    df["drift"] = model.predict(df[["sleep_hours", "steps"]])
    return df

if __name__ == "__main__":
    df = generate_user()
    result = detect_drift(df)
    print(result.tail())
