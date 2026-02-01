import { create } from 'zustand';
import { ExtractedSymptom } from '../services/symptom.service';
import symptomService from '../services/symptom.service';

interface SymptomState {
  // State
  symptoms: ExtractedSymptom[];
  currentInput: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentInput: (text: string) => void;
  extractSymptoms: (text: string) => Promise<void>;
  clearSymptoms: () => void;
  addSymptom: (symptom: ExtractedSymptom) => void;
}

export const useSymptomStore = create<SymptomState>((set, get) => ({
  // Initial state
  symptoms: [],
  currentInput: '',
  isLoading: false,
  error: null,

  // Actions
  setCurrentInput: (text: string) => {
    set({ currentInput: text, error: null });
  },

  extractSymptoms: async (text: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await symptomService.extractSymptoms(text);
      if (response.success) {
        set({ 
          symptoms: response.data,
          isLoading: false 
        });
      } else {
        throw new Error('Failed to extract symptoms');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },

  clearSymptoms: () => {
    set({ symptoms: [], currentInput: '', error: null });
  },

  addSymptom: (symptom: ExtractedSymptom) => {
    set((state) => ({
      symptoms: [...state.symptoms, symptom]
    }));
  },
}));
