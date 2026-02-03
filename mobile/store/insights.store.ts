import { create } from 'zustand';
import { communityApi } from '../services/api.service';
import { useAuthStore } from './auth.store';

export interface PatternInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
  severity?: 'info' | 'warning' | 'alert';
  recommendations?: string[];
  createdAt: string;
}

export interface SymptomHistoryItem {
  id: string;
  symptom: string;
  severity: string;
  timestamp: string;
  context?: string;
}

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
  fetchPatternInsights: () => Promise<void>;
  fetchSymptomHistory: () => Promise<void>;
  fetchCommunityTrends: (category?: string) => Promise<void>;
  selectInsight: (insight: PatternInsight | null) => void;
  clearInsights: () => void;
  resetError: () => void;
  refreshAll: () => Promise<void>;
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
  fetchPatternInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      // Get posts of type 'insight' for pattern insights
      const response = await communityApi.getFeed({ postType: 'insight' });
      if (response.success && response.data) {
        const insights: PatternInsight[] = response.data.map((post: any) => ({
          id: post._id || post.id,
          type: 'community_insight',
          title: post.postType,
          description: post.content,
          metric: post.optionalMetrics?.mood,
          recommendations: [],
          createdAt: post.createdAt,
        }));
        set({ 
          patternInsights: insights,
          isLoading: false,
          lastFetch: new Date()
        });
      } else {
        set({ 
          error: response.message || 'Failed to fetch insights',
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch insights',
        isLoading: false 
      });
    }
  },

  fetchSymptomHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      // This would need a dedicated endpoint in the future
      // For now, return empty array
      set({ 
        symptomHistory: [],
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
      const response = await communityApi.getFeed({ postType: category });
      if (response.success && response.data) {
        const trends: any[] = response.data.map((post: any) => ({
          id: post._id || post.id,
          content: post.content,
          type: post.postType,
          reactions: post.reactions?.length || 0,
          comments: post.comments?.length || 0,
          createdAt: post.createdAt,
        }));
        set({ 
          communityTrends: trends,
          isLoading: false,
          lastFetch: new Date()
        });
      } else {
        set({ 
          error: response.message || 'Failed to fetch trends',
          isLoading: false 
        });
      }
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

  refreshAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [postsResponse] = await Promise.all([
        communityApi.getFeed({}),
      ]);
      
      if (postsResponse.success && postsResponse.data) {
        const insights: PatternInsight[] = postsResponse.data
          .filter((post: any) => post.postType === 'insight')
          .map((post: any) => ({
            id: post._id || post.id,
            type: 'community_insight',
            title: post.postType,
            description: post.content,
            metric: post.optionalMetrics?.mood,
            recommendations: [],
            createdAt: post.createdAt,
          }));

        set({ 
          patternInsights: insights,
          isLoading: false,
          lastFetch: new Date()
        });
      } else {
        set({ 
          error: postsResponse.message || 'Failed to refresh data',
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to refresh data',
        isLoading: false 
      });
    }
  },
}));
