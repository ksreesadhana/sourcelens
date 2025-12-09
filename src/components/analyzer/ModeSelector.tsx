import { FileText, Package, Shield, Target } from 'lucide-react';
import { Mode } from '../../types';

interface ModeSelectorProps {
  selectedMode: Mode | null;
  onModeSelect: (mode: Mode) => void;
}

const modes = [
  {
    id: 'article' as const,
    label: 'Article',
    description: 'Extract thesis and arguments',
    icon: FileText,
  },
  {
    id: 'product' as const,
    label: 'Product',
    description: 'Analyze features and positioning',
    icon: Package,
  },
  {
    id: 'policy' as const,
    label: 'Policy',
    description: 'Decode policies and terms',
    icon: Shield,
  },
  {
    id: 'competitive' as const,
    label: 'Competitive',
    description: 'Strategic insights & intelligence',
    icon: Target,
  },
];

export default function ModeSelector({
  selectedMode,
  onModeSelect,
}: ModeSelectorProps) {
  // Resolve asset URLs via import.meta so Vite bundles them correctly
  const articleBgUrl = new URL('../../assets/article-bg.png', import.meta.url).href;
  const productBgUrl = new URL('../../assets/product-bg.png', import.meta.url).href;
  const policyBgUrl = new URL('../../assets/policy-bg.png', import.meta.url).href;
  const competitiveBgUrl = new URL('../../assets/competitive-bg.png', import.meta.url).href;
  return (
    <div className="grid grid-cols-4 gap-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;

        // Background image paths (place your images in `src/assets`)
        const bgImageForMode: Record<string, string> = {
          article: articleBgUrl,
          product: productBgUrl,
          policy: policyBgUrl,
          competitive: competitiveBgUrl,
        };

        const bgUrl = bgImageForMode[mode.id] || '';

        const RenderBgImage = () => {
          if (!bgUrl) return null;
          // absolutely positioned image that fills the card with slightly higher opacity
          return (
            <img
              src={bgUrl}
              alt=""
              aria-hidden
              loading="lazy"
              className="pointer-events-none absolute inset-0 z-0 opacity-10 w-full h-full object-cover"
            />
          );
        };

        return (
          <button
            key={mode.id}
            onClick={() => onModeSelect(mode.id)}
            className={`aspect-square rounded-md border-2 transition-all relative overflow-hidden transform-gpu p-2 flex flex-col items-center justify-center ${
              isSelected
                ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md ring-1 ring-blue-200 scale-100'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:scale-[1.01]'
            }`}
          >
            {/* subtle selected pill indicator */}
            {isSelected && (
              <span aria-hidden className="absolute top-1 right-1 z-20">
                <span className="inline-flex items-center px-1 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 shadow-sm">
                  ✓
                </span>
              </span>
            )}
            {/* inline background image (from src/assets) */}
            <RenderBgImage />

            <div className="relative z-10 text-center leading-tight">
              <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
              <h3 className="font-semibold text-gray-900 text-[0.8rem]">{mode.label}</h3>
              <p className="text-[0.68rem] text-gray-600 line-clamp-2">{mode.description}</p>
            </div>
            
          </button>
        );
      })}
    </div>
  );
}
