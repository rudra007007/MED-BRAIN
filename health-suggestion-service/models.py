"""
Pydantic models for Health Suggestion Microservice.
Defines request/response schemas for the /analyze endpoint.
"""

from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field


class MetricData(BaseModel):
    """
    Single metric data point for a specific date.
    
    Attributes:
        date: Date of the metric entry (YYYY-MM-DD format)
        sleep_duration: Hours of sleep (float)
        screen_time: Hours of screen time (float)
        activity_minutes: Minutes of physical activity (int)
    """
    date: date
    sleep_duration: float = Field(..., ge=0, le=24, description="Hours of sleep")
    screen_time: float = Field(..., ge=0, le=24, description="Hours of screen time")
    activity_minutes: int = Field(..., ge=0, le=1440, description="Minutes of activity")


class AnalyzeRequest(BaseModel):
    """
    Request body for the /analyze endpoint.
    
    Attributes:
        user_id: Unique identifier for the user (UUID string)
        metrics: List of daily metric entries
    """
    user_id: str = Field(..., description="User UUID")
    metrics: List[MetricData] = Field(..., min_length=1, description="List of daily metrics")


class AnalysisStats(BaseModel):
    """
    Statistical summary of user's metrics.
    
    Attributes:
        avg_sleep: Average sleep duration in hours
        avg_screen: Average screen time in hours
        avg_activity: Average activity in minutes
    """
    avg_sleep: float
    avg_screen: float
    avg_activity: float


class AnalyzeResponse(BaseModel):
    """
    Response from the /analyze endpoint containing analysis results and suggestions.
    
    Attributes:
        phase: User phase (0=cold start, 1=warm-up, 2=personalized)
        confidence: Confidence score based on data availability (0-1)
        suggestions: List of personalized suggestion strings
        stats: Statistical summary of user's metrics
    """
    phase: int = Field(..., ge=0, le=2, description="User phase: 0=cold start, 1=warm-up, 2=personalized")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score based on data availability")
    suggestions: List[str] = Field(..., description="Personalized health suggestions")
    stats: AnalysisStats = Field(..., description="Statistical summary of user metrics")


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str
    service: str
    version: str
