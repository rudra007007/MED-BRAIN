import numpy as np
import pandas as pd

def generate_user(days=60, drift=False):
    sleep = np.random.normal(7, 0.5, days)
    steps = np.random.normal(7000, 800, days)

    if drift:
        sleep[35:] -= np.linspace(0, 2.5, days-35)
        steps[35:] -= np.linspace(0, 4000, days-35)

    return pd.DataFrame({
        "day": range(days),
        "sleep_hours": sleep,
        "steps": steps
    })
