import { PolicyAnalysis } from '../../../types';

interface PolicyStructuredViewProps {
  data: PolicyAnalysis;
}

export default function PolicyStructuredView({ data }: PolicyStructuredViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
        <h3 className="font-semibold text-lg mb-2">Scope</h3>
        <p>{data.scope}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Obligations</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obligation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Significance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.obligations.map((obl, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-sm font-medium">{obl.party}</td>
                  <td className="px-4 py-3 text-sm">{obl.obligation}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{obl.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">User Risks</h3>
        <div className="space-y-3">
          {data.user_risks.map((risk, i) => {
            const severityColors = {
              high: 'bg-red-50 border-red-500 text-red-900',
              medium: 'bg-yellow-50 border-yellow-500 text-yellow-900',
              low: 'bg-green-50 border-green-500 text-green-900'
            };
            const badgeColors = {
              high: 'bg-red-100 text-red-800',
              medium: 'bg-yellow-100 text-yellow-800',
              low: 'bg-green-100 text-green-800'
            };

            return (
              <div key={i} className={`border-l-4 p-4 ${severityColors[risk.severity]}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{risk.risk}</h4>
                  <span className={`text-xs px-2 py-1 rounded uppercase ${badgeColors[risk.severity]}`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm">{risk.context}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Action Checklist</h3>
        <div className="space-y-2">
          {data.action_checklist.map((action, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
              <input type="checkbox" className="mt-1" disabled />
              <span className="text-sm">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
