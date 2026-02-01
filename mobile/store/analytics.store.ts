import { create } from 'zustand';
import analyticsService, { DriftAnalysisResult } from '../services/analytics.service';

interface AnalyticsState {
  // State
  driftAnalysis: DriftAnalysisResult | null;
  insights: any | null;
  isAnalyzing: boolean;
  error: string | null;
  backendStatus: boolean;
  
  // Actions
  analyzeDrift: (healthData: any[]) => Promise<void>;
  generateInsights: (symptoms: any[], healthMetrics: any) => Promise<void>;
  checkBackend: () => Promise<void>;
  clearAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  // Initial state
  driftAnalysis: null,
  insights: null,
  isAnalyzing: false,
  error: null,
  backendStatus: false,

  // Actions
  analyzeDrift: async (healthData: any[]) => {
    set({ isAnalyzing: true, error: null });
    try {
      const result = await analyticsService.analyzeDrift(healthData);
      set({ 
        driftAnalysis: result,
        isAnalyzing: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Analysis failed',
        isAnalyzing: false 
      });
    }
  },

  generateInsights: async (symptoms: any[], healthMetrics: any) => {
    set({ isAnalyzing: true, error: null });
    try {
      const result = await analyticsService.generateInsights(symptoms, healthMetrics);
      set({ 
        insights: result,
        isAnalyzing: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Insights generation failed',
        isAnalyzing: false 
      });
    }
  },

  checkBackend: async () => {
    try {
      const isOnline = await analyticsService.checkBackendStatus();
      set({ backendStatus: isOnline });
    } catch (error) {
      set({ backendStatus: false });
    }
  },

  clearAnalytics: () => {
    set({ 
      driftAnalysis: null,
      insights: null,
      error: null 
    });
  },
}));
