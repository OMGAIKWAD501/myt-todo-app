import React, { useState } from 'react';
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

const Sidebar = () => {
  const { isDarkMode, setIsDarkMode } = useTaskContext();
  const [activeTab, setActiveTab] = useState('calendar');

  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'habits', label: 'Habits', icon: Zap },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  const completedCount = 8;
  const totalCount = 12;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-navy border-r border-slate-700/50 flex flex-col h-screen backdrop-blur-xl"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/30">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">My Tracker</h1>
            <p className="text-xs text-slate-400">v1.0</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              onClick={() => setActiveTab(item.id)}
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

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-4 mb-6 p-4 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-xl"
      >
        <h3 className="text-sm font-bold text-white mb-3">Daily Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>{completedCount} completed</span>
            <span className="text-purple-400">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden border border-slate-600/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700/30 space-y-3">
        <motion.button
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
