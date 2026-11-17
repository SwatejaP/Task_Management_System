import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Activity } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/70 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="p-2 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 rounded-xl text-white shadow-md shadow-indigo-200/60 group-hover:scale-105 transition-transform duration-200">
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                  TaskPulse
                </span>
                <span className="text-[10px] text-gray-600 font-medium tracking-wide uppercase">
                  Project Workspace
                </span>
              </div>
            </Link>

            {/* Cloud Status Pill */}
            <div className="hidden sm:inline-flex items-center space-x-1.5 ml-4 bg-emerald-50/80 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Atlas Cloud Live</span>
            </div>
          </div>

          {/* Right User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar & Name */}
                <div className="flex items-center space-x-2.5 bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200/70 px-3 py-1.5 rounded-full transition shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {initial}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 hidden md:inline">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/60 px-3 py-1.5 rounded-full transition-all duration-150 font-medium cursor-pointer"
                  title="Logout session"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="text-xs font-medium text-gray-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm shadow-indigo-200 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
