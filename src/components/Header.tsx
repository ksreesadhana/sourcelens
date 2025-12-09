import { Link, useLocation } from 'react-router-dom';
import { Scan } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-sky-50 via-white to-indigo-50 border-b border-sky-200/80 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 -ml-2">
            <Scan className="w-8 h-8 text-sky-600" />
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">SourceLens</span>
              <span className="text-[10px] text-gray-500">Turn any webpage into instant intelligence</span>
            </div>
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
