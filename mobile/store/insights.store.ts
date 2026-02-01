import { create } from 'zustand';
import insightsService, { PatternInsight, SymptomHistoryItem } from '../services/insights.service';

interface InsightsState {
  // State
  patternInsights: PatternInsight[];
  symptomHistory: SymptomHistoryItem[];
  communityTrends: any[];
  isLoading: boolean;
  error: string | null;
  lastFetch: Date | null;
  selectedInsight: PatternInsight | null;
  
  // Actions
  fetchPatternInsights: (userId?: string) => Promise<void>;
  fetchSymptomHistory: (userId?: string) => Promise<void>;
  fetchCommunityTrends: (category?: string) => Promise<void>;
  selectInsight: (insight: PatternInsight | null) => void;
  clearInsights: () => void;
  resetError: () => void;
  refreshAll: (userId?: string) => Promise<void>;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  // Initial state
  patternInsights: [],
  symptomHistory: [],
  communityTrends: [],
  isLoading: false,
  error: null,
  lastFetch: null,
  selectedInsight: null,

  // Actions
  fetchPatternInsights: async (userId = 'default-user') => {
    set({ isLoading: true, error: null });
    try {
      const data = await insightsService.getPatternInsights(userId);
      const insights: PatternInsight[] = Array.isArray(data) ? data : (data as any).data || [];
      set({ 
        patternInsights: insights,
        isLoading: false,
        lastFetch: new Date()
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
      const history: SymptomHistoryItem[] = Array.isArray(data) ? data : (data as any).data || [];
      set({ 
        symptomHistory: history,
        isLoading: false,
        lastFetch: new Date()
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
      const trends: any[] = Array.isArray(data) ? data : (data as any).data || [];
      set({ 
        communityTrends: trends,
        isLoading: false,
        lastFetch: new Date()
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch trends',
        isLoading: false 
      });
    }
  },

  selectInsight: (insight: PatternInsight | null) => {
    set({ selectedInsight: insight });
  },

  clearInsights: () => {
    set({ 
      patternInsights: [],
      symptomHistory: [],
      communityTrends: [],
      selectedInsight: null,
      error: null,
      lastFetch: null
    });
  },

  resetError: () => {
    set({ error: null });
  },

  refreshAll: async (userId = 'default-user') => {
    set({ isLoading: true, error: null });
    try {
      const [patternData, historyData, trendsData] = await Promise.all([
        insightsService.getPatternInsights(userId),
        insightsService.getSymptomHistory(userId),
        insightsService.getCommunityTrends()
      ]);
      
      set({ 
        patternInsights: Array.isArray(patternData) ? patternData : (patternData as any).data || [],
        symptomHistory: Array.isArray(historyData) ? historyData : (historyData as any).data || [],
        communityTrends: Array.isArray(trendsData) ? trendsData : (trendsData as any).data || [],
        isLoading: false,
        lastFetch: new Date()
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to refresh data',
        isLoading: false 
      });
    }
  }
}));
