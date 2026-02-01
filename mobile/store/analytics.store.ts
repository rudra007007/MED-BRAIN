import { create } from 'zustand';
import analyticsService, { DriftAnalysisResult } from '../services/analytics.service';

interface AnalyticsState {
  // State
  driftAnalysis: DriftAnalysisResult | null;
  insights: any | null;
  isAnalyzing: boolean;
  error: string | null;
  backendStatus: boolean;
  lastCheck: Date | null;
  checkInterval: number | null;
  
  // Actions
  analyzeDrift: (healthData: any[]) => Promise<void>;
  generateInsights: (symptoms: any[], healthMetrics: any) => Promise<void>;
  checkBackend: () => Promise<void>;
  startBackendMonitoring: (intervalMs?: number) => void;
  stopBackendMonitoring: () => void;
  clearAnalytics: () => void;
  resetError: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Initial state
  driftAnalysis: null,
  insights: null,
  isAnalyzing: false,
  error: null,
  backendStatus: false,
  lastCheck: null,
  checkInterval: null,

  // Actions
  analyzeDrift: async (healthData: any[]) => {
    if (!healthData || healthData.length === 0) {
      set({ error: 'No health data provided for analysis' });
      return;
    }

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
      set({ 
        backendStatus: isOnline,
        lastCheck: new Date()
      });
    } catch (error) {
      set({ 
        backendStatus: false,
        lastCheck: new Date()
      });
    }
  },

  startBackendMonitoring: (intervalMs = 30000) => {
    const { checkInterval, checkBackend } = get();
    
    // Clear existing interval if any
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    
    // Initial check
    checkBackend();
    
    // Set up monitoring
    const interval = setInterval(() => {
      checkBackend();
    }, intervalMs) as unknown as number;
    
    set({ checkInterval: interval });
  },

  stopBackendMonitoring: () => {
    const { checkInterval } = get();
    if (checkInterval) {
      clearInterval(checkInterval);
      set({ checkInterval: null });
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
