import { useState } from 'react';
import ModeSelector from '../components/analyzer/ModeSelector';
import UrlInput from '../components/analyzer/UrlInput';
import { AnalysisMode } from '../types';

export default function Analyze() {
  const [mode, setMode] = useState<AnalysisMode | null>(null);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

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

  const handleAnalyze = () => {
    console.log('Analyze clicked:', { mode, url });
  };

  const isButtonDisabled = !mode || url.trim() === '' || urlError !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Analyze a Web Page
      </h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Analysis Mode
          </h2>
          <ModeSelector selectedMode={mode} onModeSelect={setMode} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Enter URL
          </h2>
          <UrlInput
            value={url}
            onChange={handleUrlChange}
            error={urlError}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isButtonDisabled}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            isButtonDisabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
