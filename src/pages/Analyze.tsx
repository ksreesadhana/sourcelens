import { useState } from 'react';
import ModeSelector from '../components/analyzer/ModeSelector';
import UrlInput from '../components/analyzer/UrlInput';
import { Mode } from '../types';
import { scrapeUrl, extractTextContent } from '../lib/firecrawl';
import { analyzeScraped } from '../lib/analysis';
import { saveAnalysis } from '../lib/supabase';
import ResultsTabs from '../components/results/ResultsTabs';
import { Loader, AlertCircle, CheckCircle, Moon, Sun, Save } from 'lucide-react';
import { useStore } from '../store';

export default function Analyze() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const aiProvider = useStore((state) => state.aiProvider);
  const setAIProvider = useStore((state) => state.setAIProvider);
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
    setAnalysisResults(null); // Clear previous results
    setSaveSuccess(false);
    setSaveError(null);

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

      // Send scraped data to the analysis function (OpenAI/Gemini-backed)
      try {
        const analysis = await analyzeScraped({
          mode: mode as any,
          url,
          markdown: response.data.markdown,
          rawText: cleanText,
          aiProvider, // Use selected AI provider
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-2 flex items-center justify-between`}>
          <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
            Let's Decode
          </h1>
          <div className="flex items-center gap-2">
            {/* AI Provider Toggle */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>AI:</span>
              <button
                onClick={() => setAIProvider(aiProvider === 'openai' ? 'gemini' : 'openai')}
                className={`px-2 py-0.5 text-xs font-semibold rounded transition-colors ${
                  aiProvider === 'openai'
                    ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                OpenAI
              </button>
              <button
                onClick={() => setAIProvider(aiProvider === 'openai' ? 'gemini' : 'openai')}
                className={`px-2 py-0.5 text-xs font-semibold rounded transition-colors ${
                  aiProvider === 'gemini'
                    ? isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                    : isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Gemini
              </button>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Two-pane layout: Left (inputs) and Right (results) */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANE: Inputs + scraped preview (no pane scroll) */}
          <div className={`w-full lg:w-[38%] border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex flex-col`}>
            <div className="p-4 space-y-4">
              {/* Error Alert */}
              {error && (
                <div className={`flex items-start gap-2 p-3 ${isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg`}>
                  <AlertCircle className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'} text-xs`}>Error</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-700'} mt-0.5 break-words overflow-wrap-anywhere`}>{error}</p>
                  </div>
                </div>
              )}

              {/* Success Alert */}
              {scrapedData && !isLoading && (
                <div className={`flex items-start gap-2 p-3 ${isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg`}>
                  <CheckCircle className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-900'} text-xs`}>Scraped</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-700'} mt-0.5 truncate`}>
                      {scrapedData.title}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-2`}>
                    Analysis Mode
                  </h2>
                  <ModeSelector selectedMode={mode} onModeSelect={setMode} />
                </div>

                <div>
                  <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} mb-2`}>
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
                <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Scraped Content Preview</h3>
                    <span className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{scrapedData.rawText.length} chars</span>
                  </div>
                  <div className={`max-h-48 overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded p-2`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap leading-snug`}>
                      {scrapedData.rawText.slice(0, 2000)}
                      {scrapedData.rawText.length > 2000 && '...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Results (no pane scroll) */}
          <div className={`w-full lg:w-[62%] ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="p-6 space-y-4">
              {/* Analysis Results Section */}
              {analysisResults && (
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
                  <div className={`px-4 py-2.5 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex items-center justify-between`}>
                    <h3 className={`font-semibold text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      Analysis Results
                    </h3>
                    <button
                      onClick={async () => {
                        setIsSaving(true);
                        setSaveError(null);
                        try {
                          const savedId = await saveAnalysis({
                            url,
                            mode,
                            results: analysisResults,
                            scraped_title: scrapedData?.title || url,
                            scraped_text: scrapedData?.rawText.substring(0, 5000) || '',
                          });
                          console.log('Analysis saved successfully:', savedId);
                          setSaveSuccess(true);
                          setSaveError(null);
                          setTimeout(() => setSaveSuccess(false), 3000);
                        } catch (error) {
                          const errMsg = error instanceof Error ? error.message : String(error);
                          console.error('Error saving analysis:', errMsg);
                          setSaveError(errMsg);
                          alert(errMsg);
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      title={saveError || ''}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
                        saveSuccess 
                          ? 'bg-green-600 text-white' 
                          : saveError
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : isDarkMode 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } disabled:opacity-50`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : saveError ? 'Sign in to Save' : 'Save'}
                    </button>
                  </div>
                  <div className="px-6 py-4">
                    <ResultsTabs results={analysisResults} mode={mode as any} />
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-12 text-center h-96 flex items-center justify-center`}>
                  <div className="w-full max-w-md space-y-6">
                    <div className="relative">
                      <Loader className={`w-16 h-16 mx-auto ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} animate-spin`} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Analyzing Content
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        AI is processing your request...
                      </p>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full space-y-2">
                      <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                        <div className={`h-full ${isDarkMode ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-full animate-pulse`} 
                             style={{width: '70%', animation: 'progress 2s ease-in-out infinite'}}></div>
                      </div>
                      <style>{`
                        @keyframes progress {
                          0%, 100% { width: 30%; }
                          50% { width: 90%; }
                        }
                      `}</style>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!scrapedData && !analysisResults && !isLoading && (
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-12 text-center h-96 flex items-center justify-center`}>
                  <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="text-lg font-semibold mb-4">Get Started</p>
                    <ul className="text-left inline-block space-y-2">
                      <li className="flex items-start gap-2">
                        <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>1.</span>
                        <span>Select your decode mode</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>2.</span>
                        <span>Enter a URL you would like to scrape</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>3.</span>
                        <span>Click on Analyze button</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
