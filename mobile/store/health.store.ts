import { create } from 'zustand';
import { HealthDataPoint } from '../services/health.service';
import healthService from '../services/health.service';

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
  fetchHealthData: () => Promise<void>;
  clearHealthData: () => void;
}

export const useHealthStore = create<HealthState>((set, get) => ({
  // Initial state
  userId: 'default-user', // In production, this should come from auth
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
    const { userId, healthData } = get();
    if (healthData.length === 0) return;

    set({ isLoading: true, error: null });
    try {
      await healthService.storeHealthData(userId, healthData);
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

  fetchHealthData: async () => {
    const { userId } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await healthService.getHealthData(userId);
      if (response.success && response.data) {
        set({ 
          healthData: response.data,
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
