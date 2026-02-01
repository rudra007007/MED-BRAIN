# MED-BRAIN Backend

Node.js backend server for the MED-BRAIN AI health monitoring system. This backend integrates with the Python-based AI models in the Engine directory to provide symptom extraction, health analytics, and drift detection.

## Features

- **Symptom Extraction**: Uses biomedical NER AI model to extract symptoms from natural language
- **Symptom Graph**: Analyzes relationships between symptoms
- **Drift Detection**: Monitors changes in health metrics over time
- **Health Analytics**: Provides insights from combined symptom and health data

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Python Integration** - Spawns Python processes to run AI models from Engine directory
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
```

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or the port specified in .env)

## API Endpoints

### Health Check
- **GET** `/api/status` - Check if server is running

### Symptom Analysis
- **POST** `/api/symptoms/extract` - Extract symptoms from text using AI
  ```json
  {
    "text": "I have a headache and feeling dizzy",
    "userId": "user123" // optional
  }
  ```

- **POST** `/api/symptoms/relationships` - Get related symptoms
  ```json
  {
    "symptom": "headache"
  }
  ```

### Health Data
- **POST** `/api/health/data` - Store health data
  ```json
  {
    "userId": "user123",
    "data": [
      {
        "date": "2026-01-15",
        "steps": 8000,
        "sleep_hours": 7.5,
        "heart_rate": 72,
        "hrv": 55
      }
    ]
  }
  ```

- **GET** `/api/health/data/:userId` - Retrieve health data for a user

### Analytics
- **POST** `/api/analytics/drift` - Analyze drift in health metrics
  ```json
  {
    "healthData": [
      {"date": "2026-01-01", "steps": 8000, "sleep_hours": 7},
      {"date": "2026-01-02", "steps": 7500, "sleep_hours": 6.5}
    ]
  }
  ```

- **POST** `/api/analytics/insights` - Generate health insights

### Insights (NEW)
- **GET** `/api/insights` - Get all pattern insights
- **GET** `/api/insights/:userId` - Get insights for specific user
- **GET** `/api/insights/symptom-history/:userId` - Get symptom extraction history

### Community (NEW)
- **GET** `/api/community/trends` - Get community health trends
- **GET** `/api/community/trends/:category` - Get trends by category (e.g., "Sleep Health")

## Python Integration

The backend communicates with the Python AI models in the `../Engine` directory through:

1. **PythonService** - Service class that spawns Python processes
2. **JSON Communication** - Data passed via stdin/stdout in JSON format
3. **Error Handling** - Proper error capture from Python scripts

### Python Scripts Used

- `Engine/pipelines/symptom_pipeline.py` - Symptom extraction using biomedical NER
- `Engine/pipelines/drift_pipeline.py` - Health metrics drift detection
- `Engine/models/symptom_graph.py` - Symptom relationship analysis

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `PYTHON_PATH` - Path to Python executable
- `PYTHON_ENGINE_PATH` - Path to Engine directory

## Architecture

```
backend/
├── server.js              # Main application entry point
├── routes/                # API route handlers
│   ├── symptom.routes.js
│   ├── health.routes.js
│   ├── analytics.routes.js
│   ├── insights.routes.js    # NEW: Pattern insights
│   └── community.routes.js   # NEW: Community trends
├── services/              # Business logic services
│   └── python.service.js  # Python integration service
├── data/                  # NEW: Sample/temp data
│   └── sample-data.js     # In-memory database with test data
├── package.json
└── .env
```

## Temporary Data

The backend includes an in-memory database (`data/sample-data.js`) with:
- **Sample health data**: 11 days of steps, sleep, heart rate, HRV
- **Pattern insights**: Pre-generated AI insights
- **Community trends**: Anonymized health trends
- **Symptom history**: Stored symptom extractions

This allows testing without a real database. Data persists only while the server runs.

## Next Steps

1. **Database Integration** - Add MongoDB/PostgreSQL for data persistence
2. **Authentication** - Implement JWT-based authentication
3. **Rate Limiting** - Add API rate limiting
4. **Caching** - Implement Redis caching for AI model results
5. **WebSocket Support** - Real-time health monitoring
6. **Testing** - Add unit and integration tests

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Test endpoints with curl
curl http://localhost:3000/api/status

# Test symptom extraction
curl -X POST http://localhost:3000/api/symptoms/extract \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache and feeling nauseous"}'
```

## License

ISC
