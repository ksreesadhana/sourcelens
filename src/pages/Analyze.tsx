import { useState } from 'react';
import ModeSelector from '../components/analyzer/ModeSelector';
import UrlInput from '../components/analyzer/UrlInput';
import { Mode } from '../types';
import { scrapeUrl, extractTextContent } from '../lib/firecrawl';
import { analyzeScraped } from '../lib/analysis';
import ResultsTabs from '../components/results/ResultsTabs';
import { Loader, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

export default function Analyze() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<{
    title: string;
    rawText: string;
    markdown: string;
  } | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  const [expandedSection, setExpandedSection] = useState<'scraped' | 'analysis' | null>(
    null
  );

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    if (newUrl.trim() === '') {
      setUrlError(null);
      return;
    }

    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(newUrl)) {
      setUrlError('Please enter a valid URL starting with http:// or https://');
    } else {
      setUrlError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!mode || !url || urlError) {
      setError('Please select a mode and enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScrapedData(null);

    try {
      // Scrape the URL using Firecrawl
      const response = await scrapeUrl(url);

      // Extract clean text from markdown
      const cleanText = extractTextContent(response.data.markdown);
      const title = response.data.metadata?.title || new URL(url).hostname;

      setScrapedData({
        title,
        rawText: cleanText,
        markdown: response.data.markdown,
      });

      // Log success with next steps
      console.log('✓ Successfully scraped:', {
        url,
        mode,
        title,
        textLength: cleanText.length,
      });

      // Send scraped data to the analysis function (OpenAI-backed)
      try {
        const analysis = await analyzeScraped({
          mode: mode as any,
          url,
          markdown: response.data.markdown,
          rawText: cleanText,
        });

        setAnalysisResults(analysis);
        console.log('✓ Analysis complete', analysis);
      } catch (analysisErr) {
        const msg = analysisErr instanceof Error ? analysisErr.message : String(analysisErr);
        setError(`Analysis failed: ${msg}`);
        console.error('Analysis failed:', msg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Scraping failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !mode || url.trim() === '' || urlError !== null || isLoading;

  const toggleSection = (section: 'scraped' | 'analysis') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            Let's Decode
          </h1>
        </div>

        {/* Two-pane layout: Left (inputs) and Right (results) */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANE: Inputs + scraped preview (no pane scroll) */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 text-xs">Error</h3>
                    <p className="text-xs text-red-700 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Alert */}
              {scrapedData && !isLoading && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 text-xs">Scraped</h3>
                    <p className="text-xs text-green-700 mt-0.5 truncate">
                      {scrapedData.title}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">
                    Analysis Mode
                  </h2>
                  <ModeSelector selectedMode={mode} onModeSelect={setMode} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">
                    Enter URL
                  </h2>
                  <UrlInput
                    value={url}
                    onChange={handleUrlChange}
                    error={urlError}
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isButtonDisabled}
                  className={`w-full py-2 px-4 rounded-lg font-semibold text-sm text-white transition-colors flex items-center justify-center gap-2 ${
                    isButtonDisabled
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </button>
              </div>

              {/* Scraped Content Preview (scrolls inside itself only) */}
              {scrapedData && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-900">Scraped Content</h3>
                    <span className="text-[11px] text-gray-500">{scrapedData.rawText.length} chars</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto bg-white border border-gray-200 rounded p-2">
                    <p className="text-xs text-gray-700 whitespace-pre-wrap leading-snug">
                      {scrapedData.rawText.slice(0, 2000)}
                      {scrapedData.rawText.length > 2000 && '...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Results (no pane scroll) */}
          <div className="w-full lg:w-2/3 bg-gray-50">
            <div className="p-6 space-y-4">
              {/* Analysis Results Section */}
              {analysisResults && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-200">
                    <h3 className="font-semibold text-base text-gray-900">
                      Analysis Results
                    </h3>
                  </div>
                  <div className="px-6 py-4">
                    <ResultsTabs results={analysisResults} mode={mode as any} />
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!scrapedData && !analysisResults && !isLoading && (
                <div className="bg-white rounded-lg shadow p-12 text-center h-96 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">
                    Enter a URL and click "Analyze" to see results here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
