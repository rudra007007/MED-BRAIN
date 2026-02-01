import { API_ENDPOINTS } from '../constants/api';

export interface ExtractedSymptom {
  raw: string;
  normalized: string;
  confidence: number;
}

export interface SymptomExtractionResponse {
  success: boolean;
  data: ExtractedSymptom[];
  timestamp: string;
}

export interface SymptomRelationshipResponse {
  success: boolean;
  data: any;
  timestamp: string;
}

class SymptomService {
  async extractSymptoms(text: string): Promise<SymptomExtractionResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.EXTRACT_SYMPTOMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to extract symptoms:', error);
      throw error;
    }
  }

  async getSymptomRelationships(symptom: string): Promise<SymptomRelationshipResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.SYMPTOM_RELATIONSHIPS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptom }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get symptom relationships:', error);
      throw error;
    }
  }
}

export default new SymptomService();
