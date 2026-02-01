import pandas as pd

def aggregate_signals(anonymized_signals):
    df = pd.DataFrame(anonymized_signals)

    summary = df.groupby("region").agg(
        total_users=("drift_flag", "count"),
        drift_users=("drift_flag", "sum")
    ).reset_index()

    summary["drift_ratio"] = (
        summary["drift_users"] / summary["total_users"]
    )

    return summary

def detect_weak_signal(summary_df):
    alerts = []

    for _, row in summary_df.iterrows():
        if row["drift_ratio"] > 0.2:
            alerts.append({
                "region": row["region"],
                "signal": "EARLY_WARNING",
                "confidence": round(row["drift_ratio"], 2)
            })

    return alerts
