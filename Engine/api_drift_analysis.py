#!/usr/bin/env python3
"""
Drift analysis API wrapper for Node.js backend
Receives JSON input via stdin and outputs JSON to stdout
"""

import sys
import json
import pandas as pd
from pathlib import Path

# Add Engine directory to path
engine_path = Path(__file__).parent
sys.path.insert(0, str(engine_path))

from explainability.explain_alerts import explain_drift

def analyze_drift(health_data):
    """Analyze drift in health data"""
    # Convert to DataFrame
    df = pd.DataFrame(health_data)
    
    # Ensure required columns exist
    if 'steps' not in df.columns:
        df['steps'] = 0
    if 'sleep_hours' not in df.columns:
        df['sleep_hours'] = 0
    
    # Get explanations
    explanations = explain_drift(df)
    
    return {
        "explanations": explanations,
        "data_points": len(health_data),
        "metrics": {
            "avg_steps": df['steps'].mean(),
            "avg_sleep": df['sleep_hours'].mean()
        }
    }

def main():
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        health_data = input_data.get("healthData", [])
        
        if not health_data or len(health_data) < 7:
            raise ValueError("At least 7 days of health data required")
        
        # Analyze drift
        result = analyze_drift(health_data)
        
        # Output JSON to stdout
        output = {
            "success": True,
            "data": result
        }
        print(json.dumps(output))
        
    except Exception as e:
        # Output error as JSON
        error_output = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_output))
        sys.exit(1)

if __name__ == "__main__":
    main()
