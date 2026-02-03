import { create } from 'zustand';
import { lifestyleApi } from '../services/api.service';

export interface DriftAnalysisResult {
  driftScore: number;
  riskTrend: 'increasing' | 'stable' | 'decreasing';
  consistencyScore: number;
  lifestyleState: 'healthy' | 'moderate' | 'needs_attention' | 'insufficient_data';
  topContributors: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    message: string;
  }>;
  summary?: {
    avgSleep: number;
    avgSteps: number;
    avgScreenTime: number;
    daysTracked: number;
  };
  message?: string;
}

interface AnalyticsState {
  // State
  driftAnalysis: DriftAnalysisResult | null;
  insights: any | null;
  isAnalyzing: boolean;
  error: string | null;
  lastCheck: Date | null;
  
  // Actions
  analyzeDrift: (days?: number) => Promise<void>;
  fetchInsights: () => Promise<void>;
  clearAnalytics: () => void;
  resetError: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Initial state
  driftAnalysis: null,
  insights: null,
  isAnalyzing: false,
  error: null,
  lastCheck: null,

  // Actions
  analyzeDrift: async (days = 30) => {
    set({ isAnalyzing: true, error: null });
    try {
      const response = await lifestyleApi.getAnalysis(days);
      if (response.success && response.data) {
        set({ 
          driftAnalysis: response.data,
          isAnalyzing: false,
          lastCheck: new Date()
        });
      } else {
        set({ 
          error: response.message || 'Analysis failed',
          isAnalyzing: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Analysis failed',
        isAnalyzing: false 
      });
    }
  },

  fetchInsights: async () => {
    set({ isAnalyzing: true, error: null });
    try {
      // For now, derive insights from drift analysis
      const driftResponse = await lifestyleApi.getAnalysis(30);
      if (driftResponse.success && driftResponse.data) {
        set({ 
          insights: {
            driftScore: driftResponse.data.driftScore,
            lifestyleState: driftResponse.data.lifestyleState,
            topContributors: driftResponse.data.topContributors,
          },
          isAnalyzing: false,
          lastCheck: new Date()
        });
      } else {
        set({ 
          error: driftResponse.message || 'Failed to fetch insights',
          isAnalyzing: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch insights',
        isAnalyzing: false 
      });
    }
  },

  clearAnalytics: () => {
    set({ 
      driftAnalysis: null,
      insights: null,
      error: null 
    });
  },

  resetError: () => {
    set({ error: null });
  },
}));
