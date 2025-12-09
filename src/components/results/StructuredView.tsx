import { Mode } from '../../types';
import ArticleStructuredView from './structured/ArticleStructuredView';
import ProductStructuredView from './structured/ProductStructuredView';
import PolicyStructuredView from './structured/PolicyStructuredView';
import CompetitiveStructuredView from './structured/CompetitiveStructuredView';

interface StructuredViewProps {
  structured: any;
  mode: Mode;
}

export default function StructuredView({ structured, mode }: StructuredViewProps) {
  if (!structured) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold">Structured data not available</h3>
        <p className="text-sm text-yellow-700">The analysis did not produce structured output for this mode. You can view the raw output instead.</p>
      </div>
    );
  }

  if (mode === 'article') {
    return <ArticleStructuredView data={structured} />;
  }

  if (mode === 'product') {
    return <ProductStructuredView data={structured} />;
  }

  if (mode === 'policy') {
    return <PolicyStructuredView data={structured} />;
  }

  if (mode === 'competitive') {
    return <CompetitiveStructuredView data={structured} />;
  }

  return <div>Unsupported mode</div>;
}
