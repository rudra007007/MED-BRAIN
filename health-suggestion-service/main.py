"""
Health Suggestion Microservice - FastAPI Application.

This microservice provides personalized health suggestions based on user metrics
including sleep duration, screen time, and physical activity.

Features:
- POST /analyze: Analyze user metrics and generate health suggestions
- GET /health: Health check endpoint for service monitoring
- CORS support for frontend integration
- Modular architecture with separated concerns

Author: MED-BRAIN Team
Version: 1.0.0
"""

import logging
from contextlib import asynccontextmanager
from typing import Dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import config
from models import AnalyzeRequest, AnalyzeResponse, HealthResponse
from analyzer import HealthAnalyzer


# Configure logging
logging.basicConfig(
    level=getattr(logging, config.log_level.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize analyzer
analyzer = HealthAnalyzer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler for startup and shutdown events.
    
    Initializes resources on startup and cleans up on shutdown.
    """
    # Startup
    logger.info("Health Suggestion Microservice starting up...")
    logger.info(f"Debug mode: {config.debug}")
    logger.info(f"Log level: {config.log_level}")
    
    yield
    
    # Shutdown
    logger.info("Health Suggestion Microservice shutting down...")


# Create FastAPI application
app = FastAPI(
    title="Health Suggestion Service",
    description="""
    ## Personalized Health Suggestion Engine
    
    This microservice analyzes user health metrics and provides personalized 
    suggestions to improve sleep, reduce screen time, and increase physical activity.
    
    ### Features:
    - **Phase Detection**: Cold start (0), Warm-up (1), Personalized (2)
    - **Confidence Scoring**: Based on data availability
    - **Smart Blending**: Combines global health priors with personal patterns
    - **Actionable Suggestions**: Specific, context-aware recommendations
    
    ### Integration:
    - Accepts JSON payloads with user_id and metrics array
    - Returns structured JSON responses
    - Ready for Node.js backend integration
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.
    
    Returns a generic error response without exposing internal details.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please try again later."}
    )


@app.get("/", include_in_schema=False)
async def root():
    """
    Root endpoint - redirects to API documentation.
    """
    return {
        "service": "Health Suggestion Microservice",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    """
    Health check endpoint for service monitoring.
    
    Use this endpoint to verify the service is running and healthy.
    Returns service status, name, and version information.
    """
    return HealthResponse(
        status="healthy",
        service="health-suggestion-service",
        version="1.0.0"
    )


@app.post(
    "/analyze",
    response_model=AnalyzeResponse,
    tags=["Analysis"],
    summary="Analyze user health metrics",
    description="""
    Analyze user health metrics and generate personalized suggestions.
    
    This endpoint:
    1. Computes statistical analysis of user metrics
    2. Determines user phase based on data availability
    3. Calculates confidence score
    4. Generates personalized suggestions
    
    **Request body:**
    - user_id: Unique identifier for the user
    - metrics: Array of daily metric entries (date, sleep_duration, screen_time, activity_minutes)
    
    **Response:**
    - phase: User phase (0=cold start, 1=warm-up, 2=personalized)
    - confidence: Confidence score based on data availability (0-1)
    - suggestions: List of personalized health suggestions
    - stats: Statistical summary of user metrics
    """
)
async def analyze_health(request: AnalyzeRequest) -> AnalyzeResponse:
    """
    Analyze health metrics and generate personalized suggestions.
    
    Args:
        request: AnalyzeRequest containing user_id and metrics
        
    Returns:
        AnalyzeResponse with phase, confidence, suggestions, and stats
        
    Raises:
        HTTPException: If metrics validation fails
    """
    logger.info(f"Received analysis request for user: {request.user_id}")
    logger.info(f"Number of metrics: {len(request.metrics)}")
    
    try:
        # Convert Pydantic models to dictionaries for analysis
        metrics_data = [
            {
                'date': m.date.isoformat() if hasattr(m.date, 'isoformat') else str(m.date),
                'sleep_duration': m.sleep_duration,
                'screen_time': m.screen_time,
                'activity_minutes': m.activity_minutes
            }
            for m in request.metrics
        ]
        
        request_data = {
            'user_id': request.user_id,
            'metrics': metrics_data
        }
        
        # Perform analysis
        result = analyzer.analyze(request_data)
        
        logger.info(f"Analysis complete for user {request.user_id}")
        logger.info(f"Phase: {result['phase']}, Confidence: {result['confidence']:.2f}")
        logger.info(f"Generated {len(result['suggestions'])} suggestions")
        
        return AnalyzeResponse(
            phase=result['phase'],
            confidence=result['confidence'],
            suggestions=result['suggestions'],
            stats=result['stats']
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Analysis failed")


def create_app() -> FastAPI:
    """
    Factory function to create the FastAPI application.
    
    Useful for testing and ASGI server deployment.
    
    Returns:
        Configured FastAPI application instance
    """
    return app


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=config.app_host,
        port=config.app_port,
        reload=config.debug
    )
