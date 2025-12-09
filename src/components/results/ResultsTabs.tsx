import { useState } from 'react'
import { FileText, Grid3x3, Code } from 'lucide-react'
import { AnalysisResults, Mode } from '../../types'
import BriefView from './BriefView'
import StructuredView from './StructuredView'
import RawView from './RawView'

interface ResultsTabsProps {
  results: AnalysisResults
  mode: Mode
}

type TabType = 'brief' | 'structured' | 'raw'

export default function ResultsTabs({ results, mode }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('brief')

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'brief', label: 'Brief', icon: <FileText className="w-4 h-4" /> },
    { id: 'structured', label: 'Structured', icon: <Grid3x3 className="w-4 h-4" /> },
    { id: 'raw', label: 'Raw', icon: <Code className="w-4 h-4" /> },
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-2 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto pr-1">
        {activeTab === 'brief' && <BriefView results={results} mode={mode} />}
        {activeTab === 'structured' && <StructuredView structured={results.structured_json} mode={mode} />}
        {activeTab === 'raw' && <RawView rawText={results.raw_text} />}
      </div>
    </div>
  )
}
