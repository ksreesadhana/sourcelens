import { create } from 'zustand'
import { Mode, AnalysisResults } from '../types'

export type AIProvider = 'openai' | 'gemini';

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
  
  // AI Provider state
  aiProvider: AIProvider;

  // Actions
  setMode: (mode: Mode) => void;
  setUrl: (url: string) => void;
  setUrlError: (error: string | null) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisStep: (step: AnalyzeState['analysisStep']) => void;
  setResults: (results: AnalysisResults | null) => void;
  setError: (error: string | null) => void;
  toggleDarkMode: () => void;
  setAIProvider: (provider: AIProvider) => void;
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
  aiProvider: 'openai',

  setMode: (mode) => set({ mode }),
  setUrl: (url) => set({ url }),
  setUrlError: (urlError) => set({ urlError }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalysisStep: (analysisStep) => set({ analysisStep }),
  setResults: (results) => set({ results }),
  setError: (error) => set({ error }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setAIProvider: (aiProvider) => set({ aiProvider }),
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
