def anonymize_user_signal(user_id, region, drift_flag):
    return {
        "region": region,
        "drift_flag": int(drift_flag)
    }
