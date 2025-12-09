import { AnalysisResults, Mode } from '../../types';

interface BriefViewProps {
  results: AnalysisResults;
  mode: Mode;
}

export default function BriefView({ results }: BriefViewProps) {
  const brief = results.brief_json;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
        <h3 className="font-semibold text-lg mb-2">TL;DR</h3>
        {brief.tldr.map((item, i) => (
          <p key={i} className="text-gray-800">
            {item}
          </p>
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Key Points</h3>
        <ul className="space-y-2 list-disc list-inside">
          {brief.key_points.map((point, i) => (
            <li key={i} className="text-gray-700">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Citations</h3>
        <div className="space-y-2">
          {brief.citations.map((citation, i) => (
            <blockquote
              key={i}
              className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 italic"
            >
              {citation}
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}
