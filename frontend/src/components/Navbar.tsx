import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Sun, Moon, LogOut, User as UserIcon, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHr = user?.role === 'ROLE_ADMIN';

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Global Search */}
      <div className="flex items-center space-x-6">
        <Link to={isHr ? "/admin" : "/dashboard"} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-glow group-hover:scale-105 transition-transform duration-300">
            D
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              DAYFLOW
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                {isHr ? 'HR PRO' : 'EMPLOYEE'}
              </span>
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees, leaves, attendance..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-soft-lg py-2 z-50 text-sm">
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Actions</div>
              <button 
                onClick={() => { navigate(isHr ? '/admin/employees' : '/dashboard'); setShowSearchDropdown(false); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700/60 text-slate-200 flex items-center justify-between"
              >
                <span>Search Employee Records</span>
                <span className="text-xs text-brand-400">View</span>
              </button>
              <button 
                onClick={() => { navigate('/leaves'); setShowSearchDropdown(false); }}
                className="w-full text-left px-4 py-2 hover:bg-slate-700/60 text-slate-200 flex items-center justify-between"
              >
                <span>Leave Applications & Status</span>
                <span className="text-xs text-brand-400">View</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-soft-lg py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-slate-700/70 flex items-center justify-between">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-xs text-brand-400">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/40">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3.5 hover:bg-slate-700/40 cursor-pointer transition-colors ${!n.read ? 'bg-brand-500/10' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-white text-xs">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 bg-brand-400 rounded-full"></span>}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1.5 block">Recently</span>
                  </div>
                ))}
              </div>
              <Link to="/notifications" onClick={() => setShowNotifDropdown(false)} className="block text-center py-2 text-xs text-brand-400 hover:text-brand-300 font-medium border-t border-slate-700/70">
                View All Notifications
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-brand-400 text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white">{user?.fullName}</div>
              <div className="text-[10px] text-slate-400 font-mono">{user?.email}</div>
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-soft-lg py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-slate-700">
                <p className="font-medium text-white">{user?.fullName}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <Link to="/profile" onClick={() => setShowUserDropdown(false)} className="flex items-center space-x-2.5 px-4 py-2 text-slate-300 hover:bg-slate-700/50 hover:text-white">
                <UserIcon className="w-4 h-4 text-brand-400" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
