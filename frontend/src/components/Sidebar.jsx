import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckCircle, User, Settings, LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckCircle, label: 'Tasks' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-surface/50 backdrop-blur-xl flex flex-col p-6">
      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${isActive(link.to)
                ? 'text-primary bg-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              } transition-all`}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="sidebar-link text-gray-500 hover:text-red-400 mt-auto transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
