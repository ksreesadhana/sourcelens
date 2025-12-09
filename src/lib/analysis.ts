import { AnalysisResults, Mode } from '../types';

  interface AnalyzePayload {
    mode: Mode;
    url: string;
    markdown: string;
    rawText: string;
  }

  const PROMPTS: Record<Mode, { system: string; userTemplate: (markdown: string, url: string) => string }> = {
    article: {
      system: `You are an expert research analyst specializing in extracting academic and argumentative value from articles, essays, and opinion pieces.

  # CONTEXT
  You will analyze web content that the user is reading for research, study, or intellectual understanding. The user needs to quickly grasp the author's thesis, supporting arguments, evidence quality, and potential counterpoints without reading the full text.

  # OBJECTIVE
  Extract structured intelligence from the article that enables:
  1. Quick comprehension of the main argument
  2. Identification of key supporting evidence
  3. Understanding of counterarguments or limitations
  4. Citation of specific passages for future reference

  # STYLE
  - Academic but accessible
  - Objective and analytical
  - Concise without losing nuance
  - Every claim must be traceable to source text

  # TONE
  Neutral, analytical, scholarly

  # AUDIENCE
  Students, researchers, journalists, analysts who need to process articles efficiently while maintaining intellectual rigor.

  # RESPONSE FORMAT
  Return ONLY valid JSON (no markdown, no preamble) with the ArticleAnalysis structure and confidence scores.`,
      userTemplate: (markdown: string, url: string) => `Analyze this article and extract structured intelligence.\n\nSOURCE URL: ${url}\n\nARTICLE CONTENT:\n${markdown}\n\nRemember: Return ONLY valid JSON. No explanations, no markdown formatting, just the JSON object.`,
    },

    product: {
      system: `You are a product marketing analyst specializing in competitive intelligence and go-to-market strategy extraction.

  # CONTEXT
  You will analyze product pages, landing pages, or SaaS websites. The user is evaluating this product for competitive research, market analysis, or purchase consideration. They need to quickly understand positioning, features, target users, and differentiation.

  # OBJECTIVE
  Extract actionable product intelligence including value proposition, features, target users, differentiators, pricing signals, and brief summary.

  # STYLE/TONE
  Strategic, business-focused, objective.

  # RESPONSE FORMAT
  Return ONLY valid JSON matching ProductAnalysis and brief_json.`,
      userTemplate: (markdown: string, url: string) => `Analyze this product page and extract GTM intelligence.\n\nSOURCE URL: ${url}\n\nPRODUCT PAGE CONTENT:\n${markdown}\n\nFocus on: Value prop, ICP signals, feature capabilities, differentiation claims, and any pricing indicators. Return ONLY valid JSON.`,
    },

    policy: {
      system: `You are a privacy and legal compliance analyst specializing in interpreting policies, terms of service, and legal documents for non-lawyers.

  # CONTEXT
  You will analyze privacy policies, terms of service, cookie policies, or other legal/compliance documents. The user needs to understand obligations, risks, and key provisions without reading dense legal text.

  # OBJECTIVE
  Extract scope, obligations, restrictions, risks, actionable checklist, and brief summary.

  # STYLE/TONE
  Plain language translation of legal text; risk-aware and practical.

  # RESPONSE FORMAT
  Return ONLY valid JSON matching PolicyAnalysis and brief_json.`,
      userTemplate: (markdown: string, url: string) => `Analyze this policy document and extract compliance/risk intelligence.\n\nSOURCE URL: ${url}\n\nPOLICY CONTENT:\n${markdown}\n\nFocus on: What users are agreeing to, what data is collected/shared, what rights are granted/waived, and any unusual provisions. Return ONLY valid JSON.`,
    },

    competitive: {
      system: `You are a competitive intelligence analyst specializing in extracting strategic insights from competitor public materials.

  # CONTEXT
  You will analyze competitor websites, landing pages, or public materials. The user is conducting competitive research to understand positioning, messaging, target markets, and potential weaknesses.

  # OBJECTIVE
  Extract positioning, target segments, differentiators, feature signals, pricing indicators, weaknesses/gaps, and brief summary.

  # STYLE/TONE
  Strategic, analytical, opportunity-seeking.

  # RESPONSE FORMAT
  Return ONLY valid JSON matching CompetitiveAnalysis and brief_json.`,
      userTemplate: (markdown: string, url: string) => `Analyze this competitor and extract strategic intelligence.\n\nSOURCE URL: ${url}\n\nCOMPETITOR CONTENT:\n${markdown}\n\nFocus on: Positioning, target segments, differentiation claims, feature maturity, pricing strategy, and observable gaps/weaknesses. Return ONLY valid JSON.`,
    },
  };

  export async function analyzeScraped(payload: AnalyzePayload): Promise<AnalysisResults> {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

    if (!openaiKey) {
      throw new Error('VITE_OPENAI_API_KEY environment variable is not set');
    }

    const promptDef = PROMPTS[payload.mode];
    if (!promptDef) throw new Error(`No prompt defined for mode: ${payload.mode}`);

    const system = promptDef.system;

    // Ensure we never send more than 2000 words to the model
    function truncateToWordLimit(text: string, limit: number) {
      if (!text) return '';
      const words = text.split(/\s+/).filter(Boolean);
      if (words.length <= limit) return text;
      return words.slice(0, limit).join(' ');
    }

    const WORD_LIMIT = 2000;
    const truncatedMarkdown = truncateToWordLimit(payload.markdown, WORD_LIMIT);
    const truncatedNote = truncatedMarkdown.length < (payload.markdown || '').length ? `\n\n[Content truncated to ${WORD_LIMIT} words]` : '';
      // Append a concise JSON skeleton example to encourage the model to follow the exact shape
      function getSkeletonForMode(mode: Mode) {
        if (mode === 'article') {
          return `{
    "title": "string",
    "structured_json": {
      "thesis": "string",
      "key_arguments": ["string"],
      "evidence_or_examples": ["string"],
      "counterpoints_if_any": ["string"]
    },
    "brief_json": {
      "tldr": ["string"],
      "key_points": ["string"],
      "citations": ["string"]
    },
    "raw_text": "string"
  }`;
        }
        if (mode === 'product') {
          return `{
    "title": "string",
    "structured_json": { "value_proposition": "string", "features": [{ "feature": "string", "description": "string" }], "target_users": ["string"], "differentiators": ["string"] },
    "brief_json": { "tldr": ["string"], "key_points": ["string"], "citations": ["string"] },
    "raw_text": "string"
  }`;
        }
        if (mode === 'policy') {
          return `{
    "title": "string",
    "structured_json": { "scope": "string", "obligations": [{ "party": "string", "obligation": "string" }], "restrictions": [{ "restriction": "string" }] },
    "brief_json": { "tldr": ["string"], "key_points": ["string"], "citations": ["string"] },
    "raw_text": "string"
  }`;
        }
        // competitive
        return `{
    "title": "string",
    "structured_json": { "positioning_summary": "string", "target_segment_signals": [{ "segment": "string", "evidence": "string" }], "differentiators": ["string"] },
    "brief_json": { "tldr": ["string"], "key_points": ["string"], "citations": ["string"] },
    "raw_text": "string"
  }`;
      }

      const skeleton = getSkeletonForMode(payload.mode);
      const userContent = promptDef.userTemplate(truncatedMarkdown + truncatedNote, payload.url) + `\n\nReturn JSON matching this example exactly (no markdown, no explanations):\n${skeleton}`;

    const body = {
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userContent },
      ],
      temperature: 0.0,
      max_tokens: 2000,
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI API error: ${res.status} - ${text}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error('OpenAI returned no content');

    console.log('Raw model response:', content);

    // Try to parse JSON directly; if not, extract JSON block
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      // Try to extract JSON from markdown code blocks
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        try {
          parsed = JSON.parse(codeBlockMatch[1]);
        } catch (_) {
          // Fall through to next attempt
        }
      }
      
      // If still not parsed, try to find raw JSON object
      if (!parsed) {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch (_) {
            console.error('Failed to parse extracted JSON:', match[0]);
            throw new Error('Failed to parse JSON from model response. The model may have returned invalid JSON.');
          }
        } else {
          console.error('No JSON object found in response:', content);
          throw new Error('Model response did not contain valid JSON. Please try again.');
        }
      }
    }

    console.log('Parsed result:', parsed);

    // If key pieces are missing, attempt a single repair: ask model to return only the missing fields
    const hasBrief = parsed?.brief_json && (Array.isArray(parsed.brief_json.tldr) && parsed.brief_json.tldr.length > 0 || Array.isArray(parsed.brief_json.key_points) && parsed.brief_json.key_points.length > 0);
    const hasStructured = parsed?.structured_json && Object.keys(parsed.structured_json || {}).length > 0;

    if (!hasBrief || !hasStructured) {
      const missingFields: string[] = [];
      if (!hasStructured) missingFields.push('structured_json');
      if (!hasBrief) missingFields.push('brief_json');

      const repairUser = `The previous response was missing the following fields: ${missingFields.join(', ')}.\n\nPlease return ONLY a JSON object that contains those missing fields and matches this shape exactly (no markdown, no explanation):\n${missingFields.includes('structured_json') ? '"structured_json": { /* follow the structure expected for this mode */ },' : ''} ${missingFields.includes('brief_json') ? '"brief_json": { "tldr": ["string"], "key_points": ["string"], "citations": ["string"] }' : ''}`;

      const repairBody = {
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: repairUser },
        ],
        temperature: 0.0,
        max_tokens: 1500,
      };

      const repairRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(repairBody),
      });

      if (repairRes.ok) {
        const rjson = await repairRes.json();
        const rcontent = rjson.choices?.[0]?.message?.content;
        if (rcontent) {
          try {
            const rparsed = JSON.parse(rcontent.match(/\{[\s\S]*\}/)?.[0] ?? rcontent);
            // Merge missing fields into original parsed result
            if (rparsed.brief_json) parsed.brief_json = rparsed.brief_json;
            if (rparsed.structured_json) parsed.structured_json = rparsed.structured_json;
          } catch (e) {
            // if repair parse fails, leave original parsed as-is
            console.warn('Repair response could not be parsed', e);
          }
        }
      } else {
        console.warn('Repair call to OpenAI failed', await repairRes.text());
      }
    }

    return parsed as AnalysisResults;
  }
