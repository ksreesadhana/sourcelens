import { create } from 'zustand'
import { Mode, AnalysisResults } from '../types'

interface AnalyzeState {
  // Analysis state
  mode: Mode | null;
  url: string;
  urlError: string | null;
  isAnalyzing: boolean;
  analysisStep: 'idle' | 'scraping' | 'analyzing' | 'structuring' | 'complete';
  results: AnalysisResults | null;
  error: string | null;
  
  // Theme state
  isDarkMode: boolean;

  // Actions
  setMode: (mode: Mode) => void;
  setUrl: (url: string) => void;
  setUrlError: (error: string | null) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisStep: (step: AnalyzeState['analysisStep']) => void;
  setResults: (results: AnalysisResults | null) => void;
  setError: (error: string | null) => void;
  toggleDarkMode: () => void;
  reset: () => void;
}

export const useStore = create<AnalyzeState>((set) => ({
  mode: null,
  url: '',
  urlError: null,
  isAnalyzing: false,
  analysisStep: 'idle',
  results: null,
  error: null,
  isDarkMode: false,

  setMode: (mode) => set({ mode }),
  setUrl: (url) => set({ url }),
  setUrlError: (urlError) => set({ urlError }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysisStep: (analysisStep) => set({ analysisStep }),
  setResults: (results) => set({ results }),
  setError: (error) => set({ error }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  reset: () => set({
    mode: null,
    url: '',
    urlError: null,
    isAnalyzing: false,
    analysisStep: 'idle',
    results: null,
    error: null,
  }),
}))
