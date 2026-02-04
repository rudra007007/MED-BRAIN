# Health Suggestion Microservice

A FastAPI-based microservice for personalized health suggestions based on user metrics including sleep duration, screen time, and physical activity.

## Features

- **Phase Detection**: Automatically categorizes users into phases based on data availability
  - Phase 0 (Cold Start): < 7 days of data
  - Phase 1 (Warm-up): 7-29 days of data
  - Phase 2 (Personalized): 30+ days of data
- **Confidence Scoring**: Computes confidence based on data availability
- **Smart Threshold Blending**: Combines global health priors with personal patterns
- **Actionable Suggestions**: Generates context-aware health recommendations
- **CORS Enabled**: Ready for frontend integration

## Project Structure

```
health-suggestion-service/
├── __init__.py           # Package initialization
├── main.py               # FastAPI application entry point
├── config.py             # Configuration management
├── models.py             # Pydantic models for request/response
├── analyzer.py           # Core analysis engine
├── config.yaml           # Configuration file
├── requirements.txt      # Python dependencies
├── README.md            # Documentation
└── tests/
    ├── __init__.py       # Tests package initialization
    └── test_analyzer.py  # Unit tests
```

## Installation

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
```

## Running the Service

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### Health Check
```
GET /health
```
Returns service status and version information.

### Analyze Health Metrics
```
POST /analyze
Content-Type: application/json

{
  "user_id": "user-uuid",
  "metrics": [
    {
      "date": "2024-01-01",
      "sleep_duration": 7.5,
      "screen_time": 5.0,
      "activity_minutes": 30
    }
  ]
}
```

### Response Format
```json
{
  "phase": 1,
  "confidence": 0.5,
  "suggestions": [
    "You slept 6.5 hours, which is less than your recommended minimum of 7.0 hours. Consider resting more today."
  ],
  "stats": {
    "avg_sleep": 7.17,
    "avg_screen": 5.0,
    "avg_activity": 36.67
  }
}
```

## Algorithm Details

### Phase Detection
The user's phase is determined by the number of unique days with data:
- **Phase 0 (Cold Start)**: < 7 days - Uses global health priors
- **Phase 1 (Warm-up)**: 7-29 days - Begins blending with personal patterns
- **Phase 2 (Personalized)**: 30+ days - Fully personalized recommendations

### Confidence Score
```
confidence = min(days_of_data / 30, 1.0)
```

### Threshold Blending
Effective thresholds are computed using:
```
effective = (1 - confidence) * global_prior + confidence * personal_value
```

### Global Priors
- Recommended sleep: 7-9 hours
- Maximum screen time: 8 hours
- Minimum activity: 30 minutes

## Integration with Node.js Backend

### Python Service (Port 8000)
```python
import requests

response = requests.post(
    "http://localhost:8000/analyze",
    json={
        "user_id": "user-uuid",
        "metrics": [...]
    }
)
result = response.json()
```

### Node.js Service
```javascript
const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        user_id: userId,
        metrics: metricsData
    })
});
const result = await response.json();
```

## Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=. --cov-report=html
```

## Configuration

Edit `config.yaml` to customize:

```yaml
app:
  host: "0.0.0.0"
  port: 8000
  debug: false
  log_level: "INFO"

analysis:
  cold_start_days: 7
  warm_up_days: 30
  max_confidence_days: 30
```

## Dependencies

- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **pydantic**: Data validation
- **numpy**: Scientific computing
- **pyyaml**: Configuration parsing
- **pytest**: Testing framework

## License

Part of MED-BRAIN Project
