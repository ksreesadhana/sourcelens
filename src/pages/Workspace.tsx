import { useState, useEffect } from 'react';
import { getUserAnalyses, searchUserAnalyses, deleteAnalysis } from '../lib/supabase';
import { Search, Trash2, ExternalLink, Calendar, Loader } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

interface Analysis {
  id: string;
  url: string;
  mode: string;
  scraped_title: string;
  scraped_text: string;
  brief_json: any;
  structured_json: any;
  raw_text: string;
  created_at: string;
}

export default function Workspace() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setFilteredAnalyses(analyses);
    }
  }, [searchQuery, analyses]);

  const loadAnalyses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserAnalyses();
      setAnalyses(data || []);
      setFilteredAnalyses(data || []);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to load analyses';
      setError(errMsg);
      console.error('Error loading analyses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredAnalyses(analyses);
      return;
    }

    try {
      const results = await searchUserAnalyses(keyword);
      setFilteredAnalyses(results || []);
    } catch (err) {
      console.error('Search error:', err);
      // Fallback to client-side filtering
      const filtered = analyses.filter(a => 
        a.url?.toLowerCase().includes(keyword.toLowerCase()) ||
        a.scraped_title?.toLowerCase().includes(keyword.toLowerCase()) ||
        a.mode?.toLowerCase().includes(keyword.toLowerCase()) ||
        a.scraped_text?.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredAnalyses(filtered);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;

    try {
      setDeletingId(id);
      await deleteAnalysis(id);
      setAnalyses(prev => prev.filter(a => a.id !== id));
      setFilteredAnalyses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete analysis');
    } finally {
      setDeletingId(null);
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'article': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'product': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'policy': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'competitive': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            My Workspace
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Browse and search your saved analyses
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search by URL, title, mode, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-700'} p-4 rounded-lg mb-6`}>
            {error}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {filteredAnalyses.length} {filteredAnalyses.length === 1 ? 'result' : 'results'}
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        {/* Analyses Grid */}
        {!isLoading && !error && filteredAnalyses.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {searchQuery ? 'No analyses found matching your search.' : 'No saved analyses yet. Start analyzing some pages!'}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 hover:shadow-lg transition-shadow`}
            >
              {/* Mode Badge */}
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getModeColor(analysis.mode)}`}>
                  {analysis.mode}
                </span>
                <button
                  onClick={() => handleDelete(analysis.id)}
                  disabled={deletingId === analysis.id}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors disabled:opacity-50`}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <h3 className={`font-semibold mb-2 line-clamp-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {analysis.scraped_title || 'Untitled'}
              </h3>

              {/* URL */}
              <a
                href={analysis.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 text-sm mb-3 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} truncate`}
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{analysis.url}</span>
              </a>

              {/* Excerpt */}
              <p className={`text-sm mb-3 line-clamp-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {analysis.scraped_text?.substring(0, 150)}...
              </p>

              {/* Date */}
              <div className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <Calendar className="w-3 h-3" />
                {formatDate(analysis.created_at)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
