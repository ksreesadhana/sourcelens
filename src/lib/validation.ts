import { AnalysisResults, Mode } from '../types';

function asString(value: any): string {
  return typeof value === 'string' ? value : '';
}

function asStringOrNull(value: any): string | null {
  if (typeof value === 'string') return value;
  return null;
}

function asStringArray(value: any): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
  if (typeof value === 'string') return [value];
  return [];
}

export function normalizeAnalysisResult(mode: Mode, parsed: any, payload: { url: string; rawText: string }): AnalysisResults {
  const title = asString(parsed?.title) || payload.url;
  const raw_text = asString(parsed?.raw_text) || payload.rawText || '';

  const brief = {
    tldr: asStringArray(parsed?.brief_json?.tldr ?? parsed?.brief?.tldr ?? parsed?.tldr),
    key_points: asStringArray(parsed?.brief_json?.key_points ?? parsed?.brief?.key_points ?? parsed?.key_points),
    citations: asStringArray(parsed?.brief_json?.citations ?? parsed?.brief?.citations ?? parsed?.citations),
  };

  let structured: any = parsed?.structured_json ?? parsed?.structured ?? {};

  // Normalize per mode with safe defaults
  if (mode === 'article') {
    structured = {
      title: asString(structured?.title) || title,
      thesis: asStringOrNull(structured?.thesis),
      key_arguments: asStringArray(structured?.key_arguments),
      evidence_or_examples: asStringArray(structured?.evidence_or_examples),
      counterpoints_if_any: asStringArray(structured?.counterpoints_if_any),
      tldr: asStringArray(structured?.tldr ?? brief.tldr),
      key_points: asStringArray(structured?.key_points ?? brief.key_points),
      citations: asStringArray(structured?.citations ?? brief.citations),
      confidence_scores: typeof structured?.confidence_scores === 'object' ? structured.confidence_scores : undefined,
    };
  } else if (mode === 'product') {
    structured = {
      title: asString(structured?.title) || title,
      value_proposition: asStringOrNull(structured?.value_proposition),
      features: Array.isArray(structured?.features) ? structured.features.map((f: any) => ({ feature: asString(f?.feature), description: asString(f?.description), tier: asString(f?.tier) || undefined })) : [],
      target_users: asStringArray(structured?.target_users),
      differentiators: asStringArray(structured?.differentiators),
      pricing_signals: asStringArray(structured?.pricing_signals),
      tldr: asStringArray(structured?.tldr ?? brief.tldr),
      key_points: asStringArray(structured?.key_points ?? brief.key_points),
      citations: asStringArray(structured?.citations ?? brief.citations),
      confidence_scores: typeof structured?.confidence_scores === 'object' ? structured.confidence_scores : undefined,
    };
  } else if (mode === 'policy') {
    structured = {
      title: asString(structured?.title) || title,
      scope: asStringOrNull(structured?.scope),
      obligations: Array.isArray(structured?.obligations) ? structured.obligations.map((o: any) => ({ party: asString(o?.party), obligation: asString(o?.obligation), significance: asString(o?.significance) })) : [],
      restrictions: Array.isArray(structured?.restrictions) ? structured.restrictions.map((r: any) => ({ restriction: asString(r?.restriction), applies_to: asString(r?.applies_to), consequence: asString(r?.consequence) })) : [],
      effective_dates_or_notes: asStringArray(structured?.effective_dates_or_notes),
      user_risks: Array.isArray(structured?.user_risks) ? structured.user_risks.map((u: any) => ({ risk: asString(u?.risk), severity: asString(u?.severity) || 'low', context: asString(u?.context) })) : [],
      action_checklist: asStringArray(structured?.action_checklist),
      tldr: asStringArray(structured?.tldr ?? brief.tldr),
      key_points: asStringArray(structured?.key_points ?? brief.key_points),
      citations: asStringArray(structured?.citations ?? brief.citations),
      confidence_scores: typeof structured?.confidence_scores === 'object' ? structured.confidence_scores : undefined,
    };
  } else if (mode === 'competitive') {
    structured = {
      title: asString(structured?.title) || title,
      positioning_summary: asStringOrNull(structured?.positioning_summary),
      target_segment_signals: Array.isArray(structured?.target_segment_signals) ? structured.target_segment_signals.map((s: any) => ({ segment: asString(s?.segment), evidence: asString(s?.evidence), strength: asString(s?.strength) })) : [],
      differentiators: Array.isArray(structured?.differentiators) ? structured.differentiators.map((d: any) => ({ claim: asString(d?.claim), credibility: asString(d?.credibility), defensibility: asString(d?.defensibility) })) : [],
      feature_signals: Array.isArray(structured?.feature_signals) ? structured.feature_signals.map((f: any) => ({ feature_area: asString(f?.feature_area), maturity: asString(f?.maturity), emphasis: asString(f?.emphasis) })) : [],
      pricing_signals: Array.isArray(structured?.pricing_signals) ? structured.pricing_signals.map((p: any) => ({ signal: asString(p?.signal), strategy: asString(p?.strategy), notes: asString(p?.notes) })) : [],
      weaknesses_or_gaps: Array.isArray(structured?.weaknesses_or_gaps) ? structured.weaknesses_or_gaps.map((w: any) => ({ gap: asString(w?.gap), opportunity: asString(w?.opportunity), confidence: asString(w?.confidence) })) : [],
      tldr: asStringArray(structured?.tldr ?? brief.tldr),
      key_points: asStringArray(structured?.key_points ?? brief.key_points),
      citations: asStringArray(structured?.citations ?? brief.citations),
      confidence_scores: typeof structured?.confidence_scores === 'object' ? structured.confidence_scores : undefined,
    };
  }

  const result: AnalysisResults = {
    title,
    structured_json: structured,
    brief_json: brief,
    raw_text,
    confidence_scores: parsed?.confidence_scores ?? undefined,
  };

  // telemetry warning
  if ((brief.tldr.length === 0 && brief.key_points.length === 0) || Object.keys(structured).length === 0) {
    console.warn('Model returned incomplete analysis result', { mode, title, briefEmpty: brief.tldr.length === 0 && brief.key_points.length === 0, structuredEmpty: Object.keys(structured).length === 0 });
  }

  return result;
}
