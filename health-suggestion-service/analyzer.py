"""
Core analysis engine for Health Suggestion Microservice.
Handles statistical computation, phase detection, and suggestion generation.
"""

from datetime import date, timedelta
from typing import Dict, List, Optional, Tuple
import numpy as np
from dataclasses import dataclass


# Global priors for cold start phase
GLOBAL_SLEEP_LOW = 7.0
GLOBAL_SLEEP_HIGH = 9.0
GLOBAL_SCREEN_MAX = 8.0
GLOBAL_ACTIVITY_MIN = 30.0


@dataclass
class PersonalStats:
    """Personal statistics computed from user's metric history."""
    avg_sleep: float
    std_sleep: float
    avg_screen: float
    std_screen: float
    avg_activity: float
    std_activity: float
    sleep_pattern: str  # Typical bedtime pattern description


class HealthAnalyzer:
    """
    Core analyzer for personalized health suggestions.
    
    This class encapsulates all analysis logic including:
    - Phase detection based on data availability
    - Statistical computation (rolling averages, standard deviations)
    - Confidence scoring
    - Threshold blending between global priors and personal patterns
    - Suggestion generation
    """
    
    def __init__(self):
        """Initialize the health analyzer with default priors."""
        self.global_priors = {
            'sleep_low': GLOBAL_SLEEP_LOW,
            'sleep_high': GLOBAL_SLEEP_HIGH,
            'screen_max': GLOBAL_SCREEN_MAX,
            'activity_min': GLOBAL_ACTIVITY_MIN
        }
    
    def count_days(self, metrics: List[Dict]) -> int:
        """
        Count the number of unique days in the metrics.
        
        Args:
            metrics: List of metric dictionaries with 'date' keys
            
        Returns:
            Number of unique days
        """
        if not metrics:
            return 0
        dates = set()
        for m in metrics:
            if isinstance(m['date'], str):
                dates.add(date.fromisoformat(m['date']))
            else:
                dates.add(m['date'])
        return len(dates)
    
    def detect_phase(self, days_of_data: int) -> int:
        """
        Determine the user phase based on data availability.
        
        Phase definitions:
        - Phase 0 (Cold Start): < 7 days of data
        - Phase 1 (Warm-up): 7-29 days of data
        - Phase 2 (Personalized): 30+ days of data
        
        Args:
            days_of_data: Number of days with metric data
            
        Returns:
            Phase integer (0, 1, or 2)
        """
        if days_of_data < 7:
            return 0
        elif days_of_data < 30:
            return 1
        else:
            return 2
    
    def compute_confidence(self, days_of_data: int) -> float:
        """
        Calculate confidence score based on data availability.
        
        Confidence increases linearly from 0 at 0 days to 1 at 30 days.
        
        Args:
            days_of_data: Number of days with metric data
            
        Returns:
            Confidence score between 0 and 1
        """
        return min(days_of_data / 30.0, 1.0)
    
    def compute_stats(self, metrics: List[Dict]) -> PersonalStats:
        """
        Compute rolling personal statistics from metric data.
        
        Args:
            metrics: List of metric dictionaries with 'sleep_duration', 
                    'screen_time', 'activity_minutes' keys
            
        Returns:
            PersonalStats dataclass with computed statistics
        """
        if not metrics:
            return PersonalStats(
                avg_sleep=0.0, std_sleep=0.0,
                avg_screen=0.0, std_screen=0.0,
                avg_activity=0.0, std_activity=0.0,
                sleep_pattern="No data available"
            )
        
        # Extract values as numpy arrays
        sleep_values = np.array([m['sleep_duration'] for m in metrics], dtype=float)
        screen_values = np.array([m['screen_time'] for m in metrics], dtype=float)
        activity_values = np.array([m['activity_minutes'] for m in metrics], dtype=float)
        
        # Compute statistics
        avg_sleep = float(np.mean(sleep_values))
        std_sleep = float(np.std(sleep_values, ddof=1)) if len(sleep_values) > 1 else 0.0
        
        avg_screen = float(np.mean(screen_values))
        std_screen = float(np.std(screen_values, ddof=1)) if len(screen_values) > 1 else 0.0
        
        avg_activity = float(np.mean(activity_values))
        std_activity = float(np.std(activity_values, ddof=1)) if len(activity_values) > 1 else 0.0
        
        # Analyze sleep pattern (bedtime estimation based on sleep duration patterns)
        sleep_pattern = self._analyze_sleep_pattern(sleep_values)
        
        return PersonalStats(
            avg_sleep=avg_sleep,
            std_sleep=std_sleep,
            avg_screen=avg_screen,
            std_screen=std_screen,
            avg_activity=avg_activity,
            std_activity=std_activity,
            sleep_pattern=sleep_pattern
        )
    
    def _analyze_sleep_pattern(self, sleep_values: np.ndarray) -> str:
        """
        Analyze sleep duration pattern to infer typical sleep window.
        
        Args:
            sleep_values: Array of sleep duration values
            
        Returns:
            Description of sleep pattern
        """
        if len(sleep_values) == 0:
            return "No data available"
        
        avg_sleep = np.mean(sleep_values)
        
        if avg_sleep >= 7.5:
            return "Consistent good sleep (7.5+ hours)"
        elif avg_sleep >= 6.5:
            return "Moderate sleep (6.5-7.5 hours)"
        elif avg_sleep >= 5.5:
            return "Below average sleep (5.5-6.5 hours)"
        else:
            return "Insufficient sleep (< 5.5 hours)"
    
    def blend_thresholds(
        self, 
        stats: PersonalStats, 
        confidence: float
    ) -> Dict[str, float]:
        """
        Blend global priors with personal statistics based on confidence.
        
        The blending formula is:
            effective = (1 - confidence) * global_prior + confidence * personal_value
        
        Args:
            stats: Computed personal statistics
            confidence: Confidence score (0-1)
            
        Returns:
            Dictionary of effective thresholds for suggestions
        """
        # Sleep thresholds
        effective_sleep_low = (
            (1 - confidence) * self.global_priors['sleep_low'] +
            confidence * stats.avg_sleep
        )
        effective_sleep_high = (
            (1 - confidence) * self.global_priors['sleep_high'] +
            confidence * (stats.avg_sleep + stats.std_sleep)
        )
        
        # Screen time threshold
        effective_screen_max = (
            (1 - confidence) * self.global_priors['screen_max'] +
            confidence * stats.avg_screen
        )
        
        # Activity threshold
        effective_activity_min = (
            (1 - confidence) * self.global_priors['activity_min'] +
            confidence * stats.avg_activity
        )
        
        return {
            'sleep_low': effective_sleep_low,
            'sleep_high': effective_sleep_high,
            'screen_max': effective_screen_max,
            'activity_min': effective_activity_min
        }
    
    def generate_suggestions(
        self, 
        metrics: List[Dict], 
        stats: PersonalStats, 
        thresholds: Dict[str, float],
        phase: int
    ) -> List[str]:
        """
        Generate personalized health suggestions based on latest metrics.
        
        Args:
            metrics: List of metric dictionaries
            stats: Computed personal statistics
            thresholds: Effective thresholds after blending
            phase: Current user phase
            
        Returns:
            List of suggestion strings
        """
        if not metrics:
            return ["No metrics available for analysis."]
        
        # Get the latest metric entry
        latest = max(metrics, key=lambda m: m['date'])
        
        suggestions = []
        
        # Sleep suggestions
        if latest['sleep_duration'] < thresholds['sleep_low']:
            suggestions.append(
                f"You slept {latest['sleep_duration']:.1f} hours, which is less than your "
                f"{'typical' if phase >= 1 else 'recommended'} minimum of {thresholds['sleep_low']:.1f} hours. "
                "Consider resting more today."
            )
        elif latest['sleep_duration'] > thresholds['sleep_high']:
            suggestions.append(
                f"You slept {latest['sleep_duration']:.1f} hours, which is more than usual. "
                "Ensure you're maintaining a consistent sleep schedule."
            )
        
        # Screen time suggestions
        if latest['screen_time'] > thresholds['screen_max']:
            suggestions.append(
                f"Your screen time of {latest['screen_time']:.1f} hours exceeds the "
                f"{'average' if phase >= 1 else 'recommended'} limit of {thresholds['screen_max']:.1f} hours. "
                "Consider taking breaks to reduce eye strain."
            )
        
        # Activity suggestions
        if latest['activity_minutes'] < thresholds['activity_min']:
            suggestions.append(
                f"Your activity of {latest['activity_minutes']:.0f} minutes is below "
                f"{'your average' if phase >= 1 else 'the recommended'} {thresholds['activity_min']:.0f} minutes. "
                "Try increasing your activity today with a short walk or stretch."
            )
        
        # Day of week pattern suggestions
        day_suggestions = self._get_day_of_week_suggestion(metrics, latest)
        if day_suggestions:
            suggestions.append(day_suggestions)
        
        # Phase-specific context
        if phase == 0:
            suggestions.append(
                "Keep tracking your daily metrics to receive more personalized insights."
            )
        elif phase == 1:
            suggestions.append(
                "Your patterns are becoming clearer. Continue logging for better recommendations."
            )
        
        return suggestions
    
    def _get_day_of_week_suggestion(
        self, 
        metrics: List[Dict], 
        latest: Dict
    ) -> Optional[str]:
        """
        Generate suggestions based on day of week patterns.
        
        Args:
            metrics: All metric data
            latest: Latest metric entry
            
        Returns:
            Day-of-week suggestion or None
        """
        if isinstance(latest['date'], str):
            latest_date = date.fromisoformat(latest['date'])
        else:
            latest_date = latest['date']
        
        day_of_week = latest_date.weekday()  # 0=Monday, 6=Sunday
        
        # Weekend pattern analysis
        if day_of_week >= 5:  # Saturday or Sunday
            # Check if weekend sleep is significantly different
            weekend_metrics = [
                m for m in metrics 
                if (date.fromisoformat(m['date']) if isinstance(m['date'], str) else m['date']).weekday() >= 5
            ]
            if weekend_metrics:
                weekend_avg_sleep = np.mean([m['sleep_duration'] for m in weekend_metrics])
                weekday_avg_sleep = np.mean([
                    m['sleep_duration'] for m in metrics 
                    if (date.fromisoformat(m['date']) if isinstance(m['date'], str) else m['date']).weekday() < 5
                ])
                
                if weekend_avg_sleep - weekday_avg_sleep > 1.5:
                    return "Your sleep schedule shows significant weekend variation. " \
                           "Try to maintain a more consistent sleep pattern."
        
        # Monday motivation
        if day_of_week == 0:
            return "It's Monday! A great day to start with some physical activity."
        
        return None
    
    def analyze(self, request_data: Dict) -> Dict:
        """
        Main analysis method that orchestrates the complete analysis pipeline.
        
        Args:
            request_data: Raw request dictionary with 'user_id' and 'metrics'
            
        Returns:
            Complete analysis result dictionary
        """
        metrics = request_data.get('metrics', [])
        days_of_data = self.count_days(metrics)
        
        # Core computations
        phase = self.detect_phase(days_of_data)
        confidence = self.compute_confidence(days_of_data)
        stats = self.compute_stats(metrics)
        thresholds = self.blend_thresholds(stats, confidence)
        suggestions = self.generate_suggestions(metrics, stats, thresholds, phase)
        
        return {
            'phase': phase,
            'confidence': confidence,
            'suggestions': suggestions,
            'stats': {
                'avg_sleep': round(stats.avg_sleep, 2),
                'avg_screen': round(stats.avg_screen, 2),
                'avg_activity': round(stats.avg_activity, 2)
            }
        }
