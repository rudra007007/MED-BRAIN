def explain_drift(df):
    recent = df.tail(7)
    baseline = df.iloc[:30]

    sleep_change = baseline.sleep_hours.mean() - recent.sleep_hours.mean()
    steps_change = baseline.steps.mean() - recent.steps.mean()

    explanation = []
    if sleep_change > 0.8:
        explanation.append("Sleep duration dropped compared to baseline")
    if steps_change > 2000:
        explanation.append("Daily activity significantly reduced")

    return explanation
