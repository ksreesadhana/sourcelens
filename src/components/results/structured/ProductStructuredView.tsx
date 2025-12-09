import { ProductAnalysis } from '../../../types';

interface ProductStructuredViewProps {
  data: ProductAnalysis;
}

export default function ProductStructuredView({ data }: ProductStructuredViewProps) {
  // Defensive checks for undefined fields
  if (!data) {
    return <div className="text-gray-500">No product analysis data available.</div>;
  }

  const features = data.features || [];
  const targetUsers = data.target_users || [];
  const differentiators = data.differentiators || [];
  const pricingSignals = data.pricing_signals || [];

  return (
    <div className="space-y-6">
      {data.value_proposition && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 p-6">
          <h3 className="text-sm uppercase tracking-wide text-gray-600 mb-2">Value Proposition</h3>
          <p className="text-xl font-medium">{data.value_proposition}</p>
        </div>
      )}

      {features.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{feature.feature}</h4>
                  {feature.tier && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {feature.tier}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {targetUsers.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Target Users</h3>
          <div className="flex flex-wrap gap-2">
            {targetUsers.map((user, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {user}
              </span>
            ))}
          </div>
        </div>
      )}

      {differentiators.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Differentiators</h3>
          <div className="space-y-2">
            {differentiators.map((diff, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded">
                <span className="text-green-600 mt-1">✓</span>
                <span>{diff}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pricingSignals.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Pricing Signals</h3>
          <div className="space-y-2">
            {pricingSignals.map((signal, i) => (
              <div key={i} className="bg-blue-50 border-l-4 border-blue-400 p-3">
                {signal}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
