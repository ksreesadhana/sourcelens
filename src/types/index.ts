export type Mode = 'article' | 'product' | 'policy' | 'competitive';
export type Scope = 'single' | 'domain';

export interface AnalysisResults {
  title: string;
  structured_json: ArticleAnalysis | ProductAnalysis | PolicyAnalysis | CompetitiveAnalysis;
  brief_json: BriefJson;
  raw_text: string;
  confidence_scores?: ConfidenceScores;
}

export interface BriefJson {
  tldr: string[];
  key_points: string[];
  citations: string[];
}

export interface ConfidenceScores {
  overall: number;
  [key: string]: number;
}

export interface ArticleAnalysis {
  title: string;
  thesis: string;
  key_arguments: string[];
  evidence_or_examples: string[];
  counterpoints_if_any: string[];
  tldr: string[];
  key_points: string[];
  citations: string[];
  confidence_scores: ConfidenceScores;
}

export interface ProductAnalysis {
  title: string;
  value_proposition: string;
  features: Array<{
    feature: string;
    description: string;
    tier?: string;
  }>;
  target_users: string[];
  differentiators: string[];
  pricing_signals: string[];
  tldr: string[];
  key_points: string[];
  citations: string[];
  confidence_scores: ConfidenceScores;
}

export interface PolicyAnalysis {
  title: string;
  scope: string;
  obligations: Array<{
    party: string;
    obligation: string;
    significance: string;
  }>;
  restrictions: Array<{
    restriction: string;
    applies_to: string;
    consequence: string;
  }>;
  effective_dates_or_notes: string[];
  user_risks: Array<{
    risk: string;
    severity: 'high' | 'medium' | 'low';
    context: string;
  }>;
  action_checklist: string[];
  tldr: string[];
  key_points: string[];
  citations: string[];
  confidence_scores: ConfidenceScores;
}

export interface CompetitiveAnalysis {
  title: string;
  positioning_summary: string;
  target_segment_signals: Array<{
    segment: string;
    evidence: string;
    strength: string;
  }>;
  differentiators: Array<{
    claim: string;
    credibility: string;
    defensibility: string;
  }>;
  feature_signals: Array<{
    feature_area: string;
    maturity: string;
    emphasis: string;
  }>;
  pricing_signals: Array<{
    signal: string;
    strategy: string;
    notes: string;
  }>;
  weaknesses_or_gaps: Array<{
    gap: string;
    opportunity: string;
    confidence: string;
  }>;
  tldr: string[];
  key_points: string[];
  citations: string[];
  confidence_scores: ConfidenceScores;
}

export interface Source {
  id: string;
  user_id: string;
  mode: Mode;
  scope: Scope;
  url: string;
  urls?: string[];
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Snapshot {
  id: string;
  source_id: string;
  user_id: string;
  raw_text: string;
  raw_texts?: any;
  structured_json: any;
  brief_json: BriefJson;
  confidence_score?: number;
  created_at: string;
}
