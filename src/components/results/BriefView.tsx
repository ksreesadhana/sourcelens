import { AnalysisResults, Mode } from '../../types';

interface BriefViewProps {
  results: AnalysisResults;
  mode: Mode;
}

export default function BriefView({ results }: BriefViewProps) {
  const brief = results?.brief_json;

  if (!brief) {
    // If the model didn't return a brief summary, show a helpful fallback
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Brief summary not available</h3>
        <p className="text-sm text-yellow-700">The analysis did not include a brief summary (field: <code>brief_json</code>).
        You can view the structured data or raw output instead.</p>
      </div>
    );
  }

  const tldr = Array.isArray(brief.tldr) ? brief.tldr : [];
  const keyPoints = Array.isArray(brief.key_points) ? brief.key_points : [];
  const citations = Array.isArray(brief.citations) ? brief.citations : [];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
        <h3 className="font-semibold text-lg mb-2">TL;DR</h3>
        {tldr.length === 0 ? (
          <p className="text-gray-600">No TL;DR items provided.</p>
        ) : (
          tldr.map((item, i) => (
            <p key={i} className="text-gray-800">
              {item}
            </p>
          ))
        )}
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Key Points</h3>
        {keyPoints.length === 0 ? (
          <p className="text-gray-600">No key points provided.</p>
        ) : (
          <ul className="space-y-2 list-disc list-inside">
            {keyPoints.map((point, i) => (
              <li key={i} className="text-gray-700">
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Citations</h3>
        {citations.length === 0 ? (
          <p className="text-gray-600">No citations provided.</p>
        ) : (
          <div className="space-y-2">
            {citations.map((citation, i) => (
              <blockquote
                key={i}
                className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 italic"
              >
                {citation}
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
