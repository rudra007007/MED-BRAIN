import { create } from 'zustand';
import { ExtractedSymptom } from '../services/symptom.service';
import symptomService from '../services/symptom.service';

interface SymptomState {
  // State
  symptoms: ExtractedSymptom[];
  currentInput: string;
  isLoading: boolean;
  error: string | null;
  lastAnalyzed: Date | null;
  retryCount: number;
  
  // Actions
  setCurrentInput: (text: string) => void;
  extractSymptoms: (text: string, retry?: boolean) => Promise<void>;
  clearSymptoms: () => void;
  addSymptom: (symptom: ExtractedSymptom) => void;
  retryExtract: () => Promise<void>;
  resetError: () => void;
}

export const useSymptomStore = create<SymptomState>((set, get) => ({
  // Initial state
  symptoms: [],
  currentInput: '',
  isLoading: false,
  error: null,
  lastAnalyzed: null,
  retryCount: 0,

  // Actions
  setCurrentInput: (text: string) => {
    set({ currentInput: text, error: null });
  },

  extractSymptoms: async (text: string, retry = false) => {
    if (!text.trim()) {
      set({ error: 'Please enter some symptoms to analyze' });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await symptomService.extractSymptoms(text);
      
      if (response.success) {
        set({ 
          symptoms: response.data,
          isLoading: false,
          lastAnalyzed: new Date(),
          retryCount: 0
        });
      } else {
        throw new Error('Failed to extract symptoms');
      }
    } catch (error) {
      const retryCount = get().retryCount;
      const maxRetries = 2;
      
      if (retryCount < maxRetries && !retry) {
        // Auto-retry once
        set({ retryCount: retryCount + 1 });
        await get().extractSymptoms(text, true);
        return;
      }
      
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred during analysis',
        isLoading: false,
        retryCount: 0
      });
    }
  },

  clearSymptoms: () => {
    set({ symptoms: [], currentInput: '', error: null, lastAnalyzed: null, retryCount: 0 });
  },

  addSymptom: (symptom: ExtractedSymptom) => {
    set((state) => ({
      symptoms: [...state.symptoms, symptom]
    }));
  },

  retryExtract: async () => {
    const { currentInput } = get();
    if (currentInput) {
      set({ retryCount: 0, error: null });
      await get().extractSymptoms(currentInput);
    }
  },

  resetError: () => {
    set({ error: null, retryCount: 0 });
  }
}));
