import { create } from 'zustand';
import { lifestyleApi } from '../services/api.service';
import { useAuthStore } from './auth.store';

export interface HealthDataPoint {
  date: string;
  sleep: {
    hours: number;
    quality: string;
    bedtime?: string;
    wakeTime?: string;
  };
  activity: {
    steps: number;
    activeMinutes: number;
    intensity?: string;
  };
  screenTime: {
    totalHours: number;
    beforeBed: boolean;
  };
  nutrition?: {
    mealsSkipped?: number;
    waterIntake?: string;
    caffeineIntake?: number;
  };
  stress?: {
    level: string;
    mood?: string;
    relaxationActivities?: string[];
  };
  notes?: string;
  id?: string;
}

interface HealthState {
  // State
  userId: string;
  healthData: HealthDataPoint[];
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  
  // Actions
  setUserId: (userId: string) => void;
  addHealthData: (data: HealthDataPoint) => void;
  syncHealthData: () => Promise<void>;
  fetchHealthData: (days?: number) => Promise<void>;
  clearHealthData: () => void;
}

export const useHealthStore = create<HealthState>((set, get) => ({
  // Initial state
  userId: '',
  healthData: [],
  isLoading: false,
  error: null,
  lastSync: null,

  // Actions
  setUserId: (userId: string) => {
    set({ userId });
  },

  addHealthData: (data: HealthDataPoint) => {
    set((state) => ({
      healthData: [...state.healthData, data]
    }));
  },

  syncHealthData: async () => {
    const { healthData } = get();
    if (healthData.length === 0) return;

    set({ isLoading: true, error: null });
    try {
      // Sync unsynced data to backend
      for (const data of healthData) {
        if (!data.id) {
          await lifestyleApi.saveData(data);
        }
      }
      set({ 
        lastSync: new Date(),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sync failed',
        isLoading: false 
      });
    }
  },

  fetchHealthData: async (days?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await lifestyleApi.getData({ days });
      if (response.success && response.data) {
        set({ 
          healthData: response.data,
          isLoading: false 
        });
      } else {
        set({ 
          error: response.message || 'Failed to fetch health data',
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Fetch failed',
        isLoading: false 
      });
    }
  },

  clearHealthData: () => {
    set({ healthData: [], lastSync: null, error: null });
  },
}));
