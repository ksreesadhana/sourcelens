import { create } from 'zustand';
import { AnalysisResults } from '../types';

interface AnalyzeStore {
  mode: string | null;
  url: string;
  isAnalyzing: boolean;
  results: AnalysisResults | null;
  error: string | null;

  setMode: (mode: string) => void;
  setUrl: (url: string) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setResults: (results: AnalysisResults | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalyzeStore = create<AnalyzeStore>((set) => ({
  mode: null,
  url: '',
  isAnalyzing: false,
  results: null,
  error: null,

  setMode: (mode) => set({ mode }),
  setUrl: (url) => set({ url }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setResults: (results) => set({ results }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      mode: null,
      url: '',
      isAnalyzing: false,
      results: null,
      error: null,
    }),
}));
