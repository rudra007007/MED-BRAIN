import { API_ENDPOINTS } from '../constants/api';
import { HealthDataPoint } from './health.service';

export interface DriftAnalysisResult {
  explanations: string[];
  severity?: 'low' | 'medium' | 'high';
  metrics?: any;
}

class AnalyticsService {
  async analyzeDrift(healthData: HealthDataPoint[]): Promise<DriftAnalysisResult> {
    try {
      const response = await fetch(API_ENDPOINTS.DRIFT_ANALYSIS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ healthData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to analyze drift:', error);
      throw error;
    }
  }

  async generateInsights(symptoms: any[], healthMetrics: any): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.INSIGHTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms, healthMetrics }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to generate insights:', error);
      throw error;
    }
  }

  async checkBackendStatus(): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINTS.STATUS);
      const data = await response.json();
      return data.status === 'OK';
    } catch (error) {
      console.error('Backend is not reachable:', error);
      return false;
    }
  }
}

export default new AnalyticsService();
