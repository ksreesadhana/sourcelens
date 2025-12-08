import { Link, useLocation } from 'react-router-dom';
import { Scan } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Scan className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SourceLens</span>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/analyze"
              className={`text-sm font-medium transition-colors ${
                isActive('/analyze')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analyze
            </Link>
            <Link
              to="/workspace"
              className={`text-sm font-medium transition-colors ${
                isActive('/workspace')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Workspace
            </Link>
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors ${
                isActive('/login')
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
