import { CompetitiveAnalysis } from '../../../types';

interface CompetitiveStructuredViewProps {
  data: CompetitiveAnalysis;
}

export default function CompetitiveStructuredView({ data }: CompetitiveStructuredViewProps) {
  if (!data) {
    return <div className="text-gray-600">No competitive analysis data available.</div>;
  }

  const targetSegments = data.target_segment_signals || [];
  const differentiators = data.differentiators || [];
  const gaps = data.weaknesses_or_gaps || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-600 p-6">
        <h3 className="text-sm uppercase tracking-wide text-gray-600 mb-2">Positioning Summary</h3>
        <p className="text-lg">{data.positioning_summary || 'No positioning summary available.'}</p>
      </div>

      {targetSegments.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Target Segments</h3>
          <div className="space-y-3">
            {targetSegments.map((segment, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{segment.segment}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    segment.strength === 'strong' ? 'bg-green-100 text-green-700' :
                    segment.strength === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {segment.strength}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{segment.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {differentiators.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Claimed Differentiators</h3>
          <div className="space-y-3">
            {differentiators.map((diff, i) => (
              <div key={i} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{diff.claim}</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-white border border-gray-300">
                      {diff.credibility}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{diff.defensibility}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {gaps.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Observable Gaps & Opportunities</h3>
          <div className="space-y-2">
            {gaps.map((gap, i) => (
              <details key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-900 flex items-center justify-between">
                  {gap.gap}
                  <span className="text-gray-400">▼</span>
                </summary>
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Opportunity:</span> {gap.opportunity}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    gap.confidence === 'high' ? 'bg-green-100 text-green-700' :
                    gap.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    Confidence: {gap.confidence}
                  </span>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
