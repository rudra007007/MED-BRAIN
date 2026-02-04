"""
Unit tests for Health Suggestion Microservice.
Tests cover analyzer logic, model validation, and API endpoints.
"""

import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient

from main import app
from analyzer import HealthAnalyzer, PersonalStats
from models import AnalyzeRequest, MetricData


# Initialize test client
client = TestClient(app)


class TestHealthAnalyzer:
    """Test cases for the HealthAnalyzer class."""
    
    @pytest.fixture
    def analyzer(self):
        """Create analyzer instance for testing."""
        return HealthAnalyzer()
    
    def test_count_days_single_date(self, analyzer):
        """Test counting days with single date entry."""
        metrics = [
            {'date': '2024-01-01', 'sleep_duration': 7.0, 'screen_time': 5.0, 'activity_minutes': 30}
        ]
        assert analyzer.count_days(metrics) == 1
    
    def test_count_days_multiple_dates(self, analyzer):
        """Test counting unique days with multiple entries."""
        metrics = [
            {'date': '2024-01-01', 'sleep_duration': 7.0, 'screen_time': 5.0, 'activity_minutes': 30},
            {'date': '2024-01-02', 'sleep_duration': 8.0, 'screen_time': 6.0, 'activity_minutes': 45},
            {'date': '2024-01-01', 'sleep_duration': 6.5, 'screen_time': 4.0, 'activity_minutes': 20},  # Duplicate date
        ]
        assert analyzer.count_days(metrics) == 2
    
    def test_count_days_empty(self, analyzer):
        """Test counting days with empty metrics."""
        assert analyzer.count_days([]) == 0
    
    def test_detect_phase_cold_start(self, analyzer):
        """Test phase 0 (cold start) detection."""
        assert analyzer.detect_phase(0) == 0
        assert analyzer.detect_phase(1) == 0
        assert analyzer.detect_phase(6) == 0
    
    def test_detect_phase_warm_up(self, analyzer):
        """Test phase 1 (warm-up) detection."""
        assert analyzer.detect_phase(7) == 1
        assert analyzer.detect_phase(15) == 1
        assert analyzer.detect_phase(29) == 1
    
    def test_detect_phase_personalized(self, analyzer):
        """Test phase 2 (personalized) detection."""
        assert analyzer.detect_phase(30) == 2
        assert analyzer.detect_phase(45) == 2
        assert analyzer.detect_phase(100) == 2
    
    def test_compute_confidence(self, analyzer):
        """Test confidence score computation."""
        assert analyzer.compute_confidence(0) == 0.0
        assert analyzer.compute_confidence(15) == 0.5
        assert analyzer.compute_confidence(30) == 1.0
        assert analyzer.compute_confidence(45) == 1.0  # Capped at 1.0
    
    def test_compute_stats_basic(self, analyzer):
        """Test basic statistics computation."""
        metrics = [
            {'date': '2024-01-01', 'sleep_duration': 7.0, 'screen_time': 5.0, 'activity_minutes': 30},
            {'date': '2024-01-02', 'sleep_duration': 8.0, 'screen_time': 6.0, 'activity_minutes': 45},
            {'date': '2024-01-03', 'sleep_duration': 6.5, 'screen_time': 4.0, 'activity_minutes': 35},
        ]
        
        stats = analyzer.compute_stats(metrics)
        
        assert stats.avg_sleep == pytest.approx(7.17, rel=0.01)
        assert stats.avg_screen == pytest.approx(5.0, rel=0.01)
        assert stats.avg_activity == pytest.approx(36.67, rel=0.01)
    
    def test_compute_stats_empty(self, analyzer):
        """Test statistics computation with empty metrics."""
        stats = analyzer.compute_stats([])
        
        assert stats.avg_sleep == 0.0
        assert stats.avg_screen == 0.0
        assert stats.avg_activity == 0.0
        assert stats.sleep_pattern == "No data available"
    
    def test_blend_thresholds_cold_start(self, analyzer):
        """Test threshold blending with low confidence (cold start)."""
        stats = PersonalStats(
            avg_sleep=6.0, std_sleep=1.0,
            avg_screen=10.0, std_screen=2.0,
            avg_activity=15.0, std_activity=5.0,
            sleep_pattern="Test"
        )
        confidence = 0.0  # Cold start
        
        thresholds = analyzer.blend_thresholds(stats, confidence)
        
        # Should use global priors when confidence is 0
        assert thresholds['sleep_low'] == pytest.approx(7.0, rel=0.01)
        assert thresholds['sleep_high'] == pytest.approx(9.0, rel=0.01)
        assert thresholds['screen_max'] == pytest.approx(8.0, rel=0.01)
        assert thresholds['activity_min'] == pytest.approx(30.0, rel=0.01)
    
    def test_blend_thresholds_high_confidence(self, analyzer):
        """Test threshold blending with high confidence (personalized)."""
        stats = PersonalStats(
            avg_sleep=7.5, std_sleep=0.5,
            avg_screen=5.0, std_screen=1.0,
            avg_activity=45.0, std_activity=10.0,
            sleep_pattern="Test"
        )
        confidence = 1.0  # Full personalization
        
        thresholds = analyzer.blend_thresholds(stats, confidence)
        
        # Should use personal stats when confidence is 1
        assert thresholds['sleep_low'] == pytest.approx(7.5, rel=0.01)
        assert thresholds['sleep_high'] == pytest.approx(8.0, rel=0.01)  # avg + std
        assert thresholds['screen_max'] == pytest.approx(5.0, rel=0.01)
        assert thresholds['activity_min'] == pytest.approx(45.0, rel=0.01)
    
    def test_generate_suggestions_low_sleep(self, analyzer):
        """Test suggestion generation for low sleep."""
        metrics = [
            {'date': '2024-01-01', 'sleep_duration': 5.0, 'screen_time': 5.0, 'activity_minutes': 30},
        ]
        stats = PersonalStats(
            avg_sleep=7.0, std_sleep=1.0,
            avg_screen=5.0, std_screen=1.0,
            avg_activity=30.0, std_activity=5.0,
            sleep_pattern="Test"
        )
        thresholds = {'sleep_low': 6.0, 'sleep_high': 8.0, 'screen_max': 8.0, 'activity_min': 30.0}
        
        suggestions = analyzer.generate_suggestions(metrics, stats, thresholds, phase=1)
        
        assert len(suggestions) > 0
        assert any("slept" in s.lower() for s in suggestions)
    
    def test_generate_suggestions_high_screen_time(self, analyzer):
        """Test suggestion generation for high screen time."""
        metrics = [
            {'date': '2024-01-01', 'sleep_duration': 8.0, 'screen_time': 10.0, 'activity_minutes': 30},
        ]
        stats = PersonalStats(
            avg_sleep=8.0, std_sleep=1.0,
            avg_screen=6.0, std_screen=1.0,
            avg_activity=30.0, std_activity=5.0,
            sleep_pattern="Test"
        )
        thresholds = {'sleep_low': 6.0, 'sleep_high': 8.0, 'screen_max': 8.0, 'activity_min': 30.0}
        
        suggestions = analyzer.generate_suggestions(metrics, stats, thresholds, phase=1)
        
        assert len(suggestions) > 0
        assert any("screen" in s.lower() for s in suggestions)
    
    def test_generate_suggestions_low_activity(self, analyzer):
        """Test suggestion generation for low activity."""
        metrics = [
            {'date': '2024-01-01', 'sleep_duration': 8.0, 'screen_time': 5.0, 'activity_minutes': 10},
        ]
        stats = PersonalStats(
            avg_sleep=8.0, std_sleep=1.0,
            avg_screen=5.0, std_screen=1.0,
            avg_activity=30.0, std_activity=5.0,
            sleep_pattern="Test"
        )
        thresholds = {'sleep_low': 6.0, 'sleep_high': 8.0, 'screen_max': 8.0, 'activity_min': 30.0}
        
        suggestions = analyzer.generate_suggestions(metrics, stats, thresholds, phase=1)
        
        assert len(suggestions) > 0
        assert any("activity" in s.lower() or "walk" in s.lower() for s in suggestions)
    
    def test_analyze_full_pipeline(self, analyzer):
        """Test complete analysis pipeline."""
        request_data = {
            'user_id': 'test-user-123',
            'metrics': [
                {'date': '2024-01-01', 'sleep_duration': 7.0, 'screen_time': 5.0, 'activity_minutes': 30},
                {'date': '2024-01-02', 'sleep_duration': 8.0, 'screen_time': 6.0, 'activity_minutes': 45},
                {'date': '2024-01-03', 'sleep_duration': 6.5, 'screen_time': 4.0, 'activity_minutes': 35},
            ]
        }
        
        result = analyzer.analyze(request_data)
        
        assert 'phase' in result
        assert 'confidence' in result
        assert 'suggestions' in result
        assert 'stats' in result
        assert result['phase'] == 0  # 3 unique days = cold start (< 7 days)
        assert 0.0 <= result['confidence'] <= 1.0
        assert isinstance(result['suggestions'], list)
        assert isinstance(result['stats'], dict)


class TestAPIEndpoints:
    """Test cases for API endpoints."""
    
    def test_health_check(self):
        """Test health check endpoint."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
        assert data['service'] == 'health-suggestion-service'
        assert data['version'] == '1.0.0'
    
    def test_analyze_endpoint_cold_start(self):
        """Test analyze endpoint with cold start data."""
        request_data = {
            'user_id': 'test-user-456',
            'metrics': [
                {'date': '2024-01-01', 'sleep_duration': 7.0, 'screen_time': 5.0, 'activity_minutes': 30},
                {'date': '2024-01-02', 'sleep_duration': 8.0, 'screen_time': 6.0, 'activity_minutes': 45},
            ]
        }
        
        response = client.post("/analyze", json=request_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data['phase'] == 0  # Cold start (< 7 days)
        assert 'suggestions' in data
        assert 'stats' in data
    
    def test_analyze_endpoint_personalized(self):
        """Test analyze endpoint with personalized data (30+ days)."""
        # Generate 35 days of data
        metrics = []
        base_date = date(2024, 1, 1)
        for i in range(35):
            metrics.append({
                'date': (base_date + timedelta(days=i)).isoformat(),
                'sleep_duration': 7.5,
                'screen_time': 5.0,
                'activity_minutes': 45
            })
        
        request_data = {
            'user_id': 'test-user-789',
            'metrics': metrics
        }
        
        response = client.post("/analyze", json=request_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data['phase'] == 2  # Personalized (30+ days)
        assert data['confidence'] == 1.0  # Full confidence
    
    def test_analyze_endpoint_missing_user_id(self):
        """Test analyze endpoint with missing user_id."""
        request_data = {
            'metrics': [
                {'date': '2024-01-01', 'sleep_duration': 7.0, 'screen_time': 5.0, 'activity_minutes': 30}
            ]
        }
        
        response = client.post("/analyze", json=request_data)
        
        assert response.status_code == 422  # Validation error
    
    def test_analyze_endpoint_empty_metrics(self):
        """Test analyze endpoint with empty metrics list."""
        request_data = {
            'user_id': 'test-user-empty',
            'metrics': []
        }
        
        response = client.post("/analyze", json=request_data)
        
        assert response.status_code == 422  # Validation error
    
    def test_analyze_endpoint_invalid_sleep_duration(self):
        """Test analyze endpoint with invalid sleep duration."""
        request_data = {
            'user_id': 'test-user-invalid',
            'metrics': [
                {'date': '2024-01-01', 'sleep_duration': 25.0, 'screen_time': 5.0, 'activity_minutes': 30}
            ]
        }
        
        response = client.post("/analyze", json=request_data)
        
        assert response.status_code == 422  # Validation error
    
    def test_analyze_endpoint_negative_activity(self):
        """Test analyze endpoint with negative activity minutes."""
        request_data = {
            'user_id': 'test-user-negative',
            'metrics': [
                {'date': '2024-01-01', 'sleep_duration': 7.0, 'screen_time': 5.0, 'activity_minutes': -10}
            ]
        }
        
        response = client.post("/analyze", json=request_data)
        
        assert response.status_code == 422  # Validation error


class TestModels:
    """Test cases for Pydantic models."""
    
    def test_metric_data_creation(self):
        """Test MetricData model creation."""
        metric = MetricData(
            date=date(2024, 1, 15),
            sleep_duration=7.5,
            screen_time=5.0,
            activity_minutes=30
        )
        
        assert metric.date == date(2024, 1, 15)
        assert metric.sleep_duration == 7.5
        assert metric.screen_time == 5.0
        assert metric.activity_minutes == 30
    
    def test_analyze_request_creation(self):
        """Test AnalyzeRequest model creation."""
        metrics = [
            MetricData(date=date(2024, 1, 1), sleep_duration=7.0, screen_time=5.0, activity_minutes=30),
            MetricData(date=date(2024, 1, 2), sleep_duration=8.0, screen_time=6.0, activity_minutes=45),
        ]
        
        request = AnalyzeRequest(user_id='test-123', metrics=metrics)
        
        assert request.user_id == 'test-123'
        assert len(request.metrics) == 2
    
    def test_metric_data_validation(self):
        """Test MetricData field validation."""
        with pytest.raises(ValueError):
            # Sleep duration must be >= 0
            MetricData(
                date=date(2024, 1, 1),
                sleep_duration=-1.0,
                screen_time=5.0,
                activity_minutes=30
            )
        
        with pytest.raises(ValueError):
            # Activity minutes must be <= 1440
            MetricData(
                date=date(2024, 1, 1),
                sleep_duration=7.0,
                screen_time=5.0,
                activity_minutes=1500
            )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
