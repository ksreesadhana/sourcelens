import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import logoImage from '../assets/SourceLens_Logo.png';

export default function Header() {
  const location = useLocation();
  const isDarkMode = useStore((state) => state.isDarkMode);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
      isDarkMode 
        ? 'bg-slate-900/95 border-slate-700' 
        : 'bg-[#1e3a5f]/95 border-[#2a5080]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 -ml-2">
            <img src={logoImage} alt="SourceLens Logo" className="w-12 h-12 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-white'}`}>SourceLens</span>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-300' : 'text-blue-200'}`}>Turn any webpage into instant intelligence</span>
            </div>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? isDarkMode ? 'text-indigo-400' : 'text-white'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/analyze"
              className={`text-sm font-medium transition-colors ${
                isActive('/analyze')
                  ? isDarkMode ? 'text-indigo-400' : 'text-white'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              Analyze
            </Link>
            <Link
              to="/workspace"
              className={`text-sm font-medium transition-colors ${
                isActive('/workspace')
                  ? isDarkMode ? 'text-indigo-400' : 'text-white'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              Workspace
            </Link>
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors ${
                isActive('/login')
                  ? isDarkMode ? 'text-indigo-400' : 'text-white'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-blue-200 hover:text-white'
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
