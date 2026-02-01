import random
from data.synthetic.generate_lifestyle import generate_user

def generate_population(num_users=20, region="Zone-A"):
    users = []

    for uid in range(num_users):
        drift = random.choice([True, False, False]) 
        df = generate_user(drift=drift)

        users.append({
            "user_id": uid,
            "region": region,
            "data": df,
            "has_drift": drift
        })

    return users
