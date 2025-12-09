import { ArticleAnalysis } from '../../../types';

interface ArticleStructuredViewProps {
  data: ArticleAnalysis;
}

export default function ArticleStructuredView({ data }: ArticleStructuredViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 p-6">
        <h3 className="text-sm uppercase tracking-wide text-gray-600 mb-2">Thesis</h3>
        <p className="text-xl font-medium">{data.thesis}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Key Arguments</h3>
        <div className="space-y-3">
          {data.key_arguments.map((arg, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <span className="font-semibold text-blue-600 mr-2">{i + 1}.</span>
              {arg}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Evidence & Examples</h3>
        <ul className="space-y-2 list-disc list-inside text-gray-700">
          {data.evidence_or_examples.map((ev, i) => (
            <li key={i}>{ev}</li>
          ))}
        </ul>
      </div>

      {data.counterpoints_if_any.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <h3 className="font-semibold text-lg mb-2">Counterpoints</h3>
          <ul className="space-y-1 list-disc list-inside">
            {data.counterpoints_if_any.map((cp, i) => (
              <li key={i}>{cp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
