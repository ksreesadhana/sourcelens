import { AnalysisResults, Mode } from '../types';

interface AnalyzePayload {
  mode: Mode;
  url: string;
  markdown: string;
  rawText: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Same prompts as OpenAI
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

# RESPONSE FORMAT
Return ONLY valid JSON with the ProductAnalysis structure.`,
    userTemplate: (markdown: string, url: string) => `Analyze this product page.\n\nSOURCE URL: ${url}\n\nPAGE CONTENT:\n${markdown}\n\nReturn ONLY valid JSON. No markdown formatting.`,
  },

  policy: {
    system: `You are a legal and policy analyst specializing in decoding terms of service, privacy policies, and legal documents for non-lawyers.

# CONTEXT
The user is reviewing a policy document and needs to understand key obligations, user rights, risks, and unusual clauses without reading dense legal text.

# OBJECTIVE
Extract clear, actionable insights from policy documents including obligations, rights, risks, and notable clauses.

# RESPONSE FORMAT
Return ONLY valid JSON with the PolicyAnalysis structure.`,
    userTemplate: (markdown: string, url: string) => `Analyze this policy document.\n\nSOURCE URL: ${url}\n\nPOLICY CONTENT:\n${markdown}\n\nReturn ONLY valid JSON.`,
  },

  competitive: {
    system: `You are a competitive intelligence analyst specializing in market positioning and strategic insights.

# CONTEXT
The user is analyzing a competitor's website or market position. They need strategic insights about positioning, target segments, differentiators, and potential weaknesses.

# OBJECTIVE
Extract competitive intelligence including positioning summary, target segments, differentiators, and strategic gaps.

# RESPONSE FORMAT
Return ONLY valid JSON with the CompetitiveAnalysis structure.`,
    userTemplate: (markdown: string, url: string) => `Analyze this for competitive intelligence.\n\nSOURCE URL: ${url}\n\nCONTENT:\n${markdown}\n\nReturn ONLY valid JSON.`,
  },
};

export async function analyzeWithGemini(payload: AnalyzePayload): Promise<AnalysisResults> {
  const { mode, url, markdown, rawText } = payload;
  const prompt = PROMPTS[mode];

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const fullPrompt = `${prompt.system}\n\n${prompt.userTemplate(markdown, url)}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content returned from Gemini');
    }

    console.log('Raw Gemini response:', content);

    // Parse JSON from response (same logic as OpenAI)
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1]);
      } else {
        // Try extracting raw JSON object
        const rawJsonMatch = content.match(/\{[\s\S]*\}/);
        if (rawJsonMatch) {
          parsed = JSON.parse(rawJsonMatch[0]);
        } else {
          throw new Error('Failed to parse JSON from Gemini response');
        }
      }
    }

    console.log('Parsed result:', parsed);

    return {
      brief_json: parsed,
      structured_json: parsed,
      raw_text: rawText,
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}
