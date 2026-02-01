import { create } from 'zustand';
import insightsService, { PatternInsight, SymptomHistoryItem } from '../services/insights.service';

interface InsightsState {
  // State
  patternInsights: PatternInsight[];
  symptomHistory: SymptomHistoryItem[];
  communityTrends: any[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPatternInsights: (userId?: string) => Promise<void>;
  fetchSymptomHistory: (userId?: string) => Promise<void>;
  fetchCommunityTrends: (category?: string) => Promise<void>;
  clearInsights: () => void;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  // Initial state
  patternInsights: [],
  symptomHistory: [],
  communityTrends: [],
  isLoading: false,
  error: null,

  // Actions
  fetchPatternInsights: async (userId = 'default-user') => {
    set({ isLoading: true, error: null });
    try {
      const data = await insightsService.getPatternInsights(userId);
      set({ 
        patternInsights: data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch insights',
        isLoading: false 
      });
    }
  },

  fetchSymptomHistory: async (userId = 'default-user') => {
    set({ isLoading: true, error: null });
    try {
      const data = await insightsService.getSymptomHistory(userId);
      set({ 
        symptomHistory: data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch history',
        isLoading: false 
      });
    }
  },

  fetchCommunityTrends: async (category?: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await insightsService.getCommunityTrends(category);
      set({ 
        communityTrends: data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch trends',
        isLoading: false 
      });
    }
  },

  clearInsights: () => {
    set({ 
      patternInsights: [],
      symptomHistory: [],
      communityTrends: [],
      error: null 
    });
  },
}));
