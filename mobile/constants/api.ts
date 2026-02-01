<<<<<<< Updated upstream
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
=======
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const resolveHost = () => {
  const hostUri = Constants.expoConfig?.hostUri ?? (Constants as any).manifest?.hostUri ?? '';
  const host = hostUri.split(':')[0];

  if (host) {
    return host;
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${resolveHost()}:3000/api`;
>>>>>>> Stashed changes

export const API_ENDPOINTS = {
  // Symptom endpoints
  EXTRACT_SYMPTOMS: `${API_BASE_URL}/symptoms/extract`,
  SYMPTOM_RELATIONSHIPS: `${API_BASE_URL}/symptoms/relationships`,
  
  // Health data endpoints
  HEALTH_DATA: `${API_BASE_URL}/health/data`,
  
  // Analytics endpoints
  DRIFT_ANALYSIS: `${API_BASE_URL}/analytics/drift`,
  INSIGHTS: `${API_BASE_URL}/analytics/insights`,
  
  // Insights endpoints
  PATTERN_INSIGHTS: `${API_BASE_URL}/insights`,
  SYMPTOM_HISTORY: `${API_BASE_URL}/insights/symptom-history`,
  
  // Community endpoints
  COMMUNITY_TRENDS: `${API_BASE_URL}/community/trends`,
  
  // Status
  STATUS: `${API_BASE_URL}/status`,
};
