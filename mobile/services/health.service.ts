import { API_ENDPOINTS } from '../constants/api';

export interface HealthDataPoint {
  date: string;
  steps?: number;
  sleep_hours?: number;
  heart_rate?: number;
  hrv?: number;
}

export interface DriftAnalysisResponse {
  success: boolean;
  data: {
    explanations?: string[];
    metrics?: any;
  };
  timestamp: string;
}

export interface InsightsResponse {
  success: boolean;
  data: any;
  message?: string;
}

class HealthService {
  async storeHealthData(userId: string, data: HealthDataPoint[]): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH_DATA, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to store health data:', error);
      throw error;
    }
  }

  async getHealthData(userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_ENDPOINTS.HEALTH_DATA}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get health data:', error);
      throw error;
    }
  }
}

export default new HealthService();
