/**
 * Firecrawl API utility for web scraping
 * Wraps the Firecrawl REST API for scraping and markdown conversion
 */

interface FirecrawlScrapeResponse {
  success: boolean;
  data: {
    markdown: string;
    html?: string;
    rawHtml?: string;
    metadata?: {
      title?: string;
      description?: string;
      language?: string;
      sourceURL?: string;
      statusCode?: number;
    };
  };
}

interface FirecrawlScrapeOptions {
  pageOptions?: {
    headers?: Record<string, string>;
  };
  timeout?: number;
}

export async function scrapeUrl(
  url: string,
  options: FirecrawlScrapeOptions = {}
): Promise<FirecrawlScrapeResponse> {
  const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_FIRECRAWL_API_KEY environment variable is not set');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  // Try v2-style body first (newer API). If the API rejects the body format,
  // fall back to the legacy v1 payload.
  const tryV2 = async () => {
    // v2 expects a `url` top-level key (not `input`)
    const v2Payload = { url };
    const res = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers,
      body: JSON.stringify(v2Payload),
    });

    if (!res.ok) {
      // include raw body text for better debugging
      const text = await res.text();
      const bodyMsg = text ? ` - ${text}` : '';
      throw new Error(`Firecrawl v2 API error: ${res.status}${bodyMsg}`);
    }

    const json = await res.json();
    return json as FirecrawlScrapeResponse;
  };

  const tryV1 = async () => {
    // v1 appears to no longer accept `pageOptions` in body for some keys;
    // send minimal payload expected historically.
    const v1Payload: Record<string, any> = {
      url,
      timeout: options.timeout || 30000,
    };

    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers,
      body: JSON.stringify(v1Payload),
    });

    if (!res.ok) {
      const text = await res.text();
      const bodyMsg = text ? ` - ${text}` : '';
      throw new Error(`Firecrawl v1 API error: ${res.status}${bodyMsg}`);
    }

    const json = await res.json();
    return json as FirecrawlScrapeResponse;
  };

  // Attempt v2 then fallback to v1 when v2 returns a 400 or Unrecognized key message
  try {
    return await tryV2();
  } catch (v2Err) {
    const msg = v2Err instanceof Error ? v2Err.message : String(v2Err);
    // If v2 explicitly complains about the request body, try v1 format
    if (msg.includes('Unrecognized key') || msg.includes('v2') || msg.includes('400')) {
      try {
        return await tryV1();
      } catch (v1Err) {
        const v1msg = v1Err instanceof Error ? v1Err.message : String(v1Err);
        throw new Error(`Firecrawl v2 failed (${msg}); fallback v1 failed (${v1msg})`);
      }
    }

    throw v2Err;
  }
}

/**
 * Extract structured text from scraped markdown/html
 * Useful for cleaning up and preparing content for analysis
 */
export function extractTextContent(markdown: string): string {
  // Remove common markdown link patterns but keep text
  let text = markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // ![alt](url) -> alt
    .replace(/^#+\s+/gm, ''); // Remove markdown headers

  // Remove excessive whitespace
  text = text.replace(/\n\n+/g, '\n\n').trim();

  return text;
}
