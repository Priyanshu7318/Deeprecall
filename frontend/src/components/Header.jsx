import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, User } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-primary rounded-xl shadow-neon group-hover:scale-110 transition-transform">
            <Brain className="w-6 h-6 text-background" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DeepRecall</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/how-it-works" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">How it Works</Link>
          <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">About</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/profile" className="flex items-center space-x-2 glass px-4 py-2 rounded-lg hover:border-primary transition-colors">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="btn-primary py-2 px-6 text-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
