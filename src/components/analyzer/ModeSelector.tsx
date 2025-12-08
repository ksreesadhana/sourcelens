import { FileText, Package, Shield, Target } from 'lucide-react';
import { AnalysisMode } from '../../types';

interface ModeSelectorProps {
  selectedMode: AnalysisMode | null;
  onModeSelect: (mode: AnalysisMode) => void;
}

const modes = [
  {
    id: 'Article' as const,
    label: 'Article',
    description: 'Extract thesis and arguments',
    icon: FileText,
  },
  {
    id: 'Product' as const,
    label: 'Product',
    description: 'Analyze features and positioning',
    icon: Package,
  },
  {
    id: 'Policy' as const,
    label: 'Policy',
    description: 'Decode policies and terms',
    icon: Shield,
  },
  {
    id: 'Competitive' as const,
    label: 'Competitive',
    description: 'Strategic intelligence',
    icon: Target,
  },
];

export default function ModeSelector({
  selectedMode,
  onModeSelect,
}: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onModeSelect(mode.id)}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              isSelected
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            <h3 className="font-semibold text-gray-900 mb-1">{mode.label}</h3>
            <p className="text-sm text-gray-600">{mode.description}</p>
          </button>
        );
      })}
    </div>
  );
}
