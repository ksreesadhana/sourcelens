export type AnalysisMode = 'Article' | 'Product' | 'Policy' | 'Competitive';

export type TabType = 'Brief' | 'Structured' | 'Raw';

export interface AnalysisResults {
  title: string;
  structured_json: object;
  brief_json: object;
  raw_text: string;
}

export interface Analysis {
  id: string;
  url: string;
  mode: AnalysisMode;
  timestamp: string;
  brief?: string;
  structured?: unknown;
  raw?: string;
}
