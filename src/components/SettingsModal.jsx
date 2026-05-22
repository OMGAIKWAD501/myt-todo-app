import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useTaskContext } from '../hooks/useTaskContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { clearAllTasks, isDarkMode, setIsDarkMode } = useTaskContext();

  const handleClearTasks = () => {
    if (window.confirm('Delete all tasks? This cannot be undone.')) {
      clearAllTasks();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-navy border border-slate-700/50 rounded-2xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 cursor-pointer">
                  <span className="text-slate-300">Dark mode</span>
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                    className="w-5 h-5 accent-purple-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleClearTasks}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all tasks
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
