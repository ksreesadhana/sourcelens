import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface RawViewProps {
  rawText: string;
}

export default function RawView({ rawText }: RawViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2 z-10"
      >
        {copied ? (
          <>
            <Check size={16} />
            Copied!
          </>
        ) : (
          <>
            <Copy size={16} />
            Copy
          </>
        )}
      </button>

      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-96 text-sm font-mono">
        {rawText}
      </pre>
    </div>
  );
}
