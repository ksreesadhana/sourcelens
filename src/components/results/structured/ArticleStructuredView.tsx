import { ArticleAnalysis } from '../../../types';

interface ArticleStructuredViewProps {
  data: ArticleAnalysis;
}

export default function ArticleStructuredView({ data }: ArticleStructuredViewProps) {
  // Defensive defaults for fields that might be missing from the model output
  const thesis = typeof data?.thesis === 'string' && data.thesis.trim() !== '' ? data.thesis : null;
  const keyArguments = Array.isArray(data?.key_arguments) ? data.key_arguments : [];
  const evidence = Array.isArray(data?.evidence_or_examples) ? data.evidence_or_examples : [];
  const counterpoints = Array.isArray(data?.counterpoints_if_any) ? data.counterpoints_if_any : [];

  if (!thesis && keyArguments.length === 0 && evidence.length === 0 && counterpoints.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold">Structured article data incomplete</h3>
        <p className="text-sm text-yellow-700">The model did not return the expected structured fields for an article. You can review the raw output to see the full response.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 p-6">
        <h3 className="text-sm uppercase tracking-wide text-gray-600 mb-2">Thesis</h3>
        <p className="text-xl font-medium">{thesis ?? '— No thesis provided —'}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Key Arguments</h3>
        <div className="space-y-3">
          {keyArguments.length === 0 ? (
            <p className="text-gray-600">No key arguments provided.</p>
          ) : (
            keyArguments.map((arg, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <span className="font-semibold text-blue-600 mr-2">{i + 1}.</span>
                {arg}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Evidence & Examples</h3>
        {evidence.length === 0 ? (
          <p className="text-gray-600">No evidence or examples provided.</p>
        ) : (
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            {evidence.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        )}
      </div>

      {counterpoints.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <h3 className="font-semibold text-lg mb-2">Counterpoints</h3>
          <ul className="space-y-1 list-disc list-inside">
            {counterpoints.map((cp, i) => (
              <li key={i}>{cp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
