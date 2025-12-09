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
