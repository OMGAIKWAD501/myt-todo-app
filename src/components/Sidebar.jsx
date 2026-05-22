import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckSquare,
  Zap,
  BarChart3,
  FileText,
  Target,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { useTaskContext } from '../hooks/useTaskContext';

const Sidebar = ({ activeView, onViewChange, onOpenSettings }) => {
  const { isDarkMode, setIsDarkMode, getTodayProgress } = useTaskContext();
  const { completed, total, percent } = getTodayProgress();

  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'habits', label: 'Habits', icon: Zap },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-navy border-r border-slate-700/50 flex flex-col h-screen backdrop-blur-xl relative z-20 shrink-0"
    >
      <div className="p-6 border-b border-slate-700/30">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">My Tracker</h1>
            <p className="text-xs text-slate-400">v1.0</p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ x: 5 }}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-4 mb-4 p-4 bg-slate-800/40 border border-slate-700/40 rounded-2xl"
      >
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          Small progress every day, leads to big results.
        </p>
        {/* Mini sparkline chart */}
        <svg viewBox="0 0 120 40" className="w-full h-8" preserveAspectRatio="none">
          <polyline
            points="0,35 20,28 40,30 60,18 80,22 100,10 120,14"
            fill="none"
            stroke="url(#sparkGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <div className="p-4 border-t border-slate-700/30 space-y-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all text-slate-300 hover:text-white"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4" />
              <span className="text-sm">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span className="text-sm">Dark Mode</span>
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSettings}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all text-slate-300 hover:text-white"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
