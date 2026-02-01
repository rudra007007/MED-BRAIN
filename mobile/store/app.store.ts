import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  // State
  isOnline: boolean;
  user: User | null;
  
  // Actions
  setOnline: (status: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isOnline: false,
  user: {
    id: 'default-user',
    name: 'Alex',
    email: 'alex@example.com',
  },

  // Actions
  setOnline: (status: boolean) => {
    set({ isOnline: status });
  },

  setUser: (user: User | null) => {
    set({ user });
  },
}));
