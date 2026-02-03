import { create } from 'zustand';
import { useAuthStore } from './auth.store';

export interface AppUser {
  id: string;
  username: string;
  email: string;
}

interface AppState {
  // State
  isOnline: boolean;
  user: AppUser | null;
  
  // Actions
  setOnline: (status: boolean) => void;
  syncUserFromAuth: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isOnline: false,
  user: null,

  // Actions
  setOnline: (status: boolean) => {
    set({ isOnline: status });
  },

  syncUserFromAuth: () => {
    const authUser = useAuthStore.getState().user;
    
    if (authUser) {
      set({
        user: {
          id: authUser.id,
          username: authUser.username,
          email: authUser.email,
        },
      });
    } else {
      set({ user: null });
    }
  },
}));
