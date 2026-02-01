import { API_ENDPOINTS } from '../constants/api';

export interface PatternInsight {
  id: string;
  title: string;
  description: string;
  signals: string[];
  riskChange: number;
  timeframe: string;
  confidence: number;
  recommendations?: string[];
}

export interface SymptomHistoryItem {
  id: string;
  date: string;
  text?: string;
  symptoms: Array<{
    raw: string;
    normalized: string;
    confidence: number;
  }>;
  timestamp: string;
}

class InsightsService {
  async getPatternInsights(userId: string = 'default-user'): Promise<PatternInsight[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.PATTERN_INSIGHTS}/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get pattern insights:', error);
      throw error;
    }
  }

  async getSymptomHistory(userId: string = 'default-user'): Promise<SymptomHistoryItem[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SYMPTOM_HISTORY}/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get symptom history:', error);
      throw error;
    }
  }

  async getCommunityTrends(category?: string): Promise<any[]> {
    try {
      const url = category 
        ? `${API_ENDPOINTS.COMMUNITY_TRENDS}/${category}`
        : API_ENDPOINTS.COMMUNITY_TRENDS;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get community trends:', error);
      throw error;
    }
  }
}

export default new InsightsService();
