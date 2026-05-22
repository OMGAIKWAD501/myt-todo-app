import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getMonthName, getYear } from '../utils/dateUtils';

const CalendarHeader = ({
  onAddTask,
  currentDate,
  onDateChange,
  onToday,
  viewMode,
  onViewModeChange,
}) => {
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const viewModes = ['Day', 'Week', 'Month', 'Year'];

  const navLabel =
    viewMode === 'Year'
      ? String(getYear(currentDate))
      : `${getMonthName(currentDate)} ${getYear(currentDate)}`;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-6 py-4 border-b border-slate-700/30 bg-gradient-to-r from-slate-900/50 via-slate-900/30 to-navy/50 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {viewMode !== 'Year' && (
            <>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-all text-slate-300 hover:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToday}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all"
              >
                Today
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-all text-slate-300 hover:text-white"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {viewMode === 'Year' && (
            <>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const d = new Date(currentDate);
                  d.setFullYear(d.getFullYear() - 1);
                  onDateChange(d);
                }}
                className="p-2 hover:bg-slate-800/50 rounded-lg text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToday}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-sm font-medium text-slate-300 hover:text-white"
              >
                Today
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const d = new Date(currentDate);
                  d.setFullYear(d.getFullYear() + 1);
                  onDateChange(d);
                }}
                className="p-2 hover:bg-slate-800/50 rounded-lg text-slate-300 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </>
          )}

          <div className="text-center pl-2">
            <h2 className="text-lg font-bold text-white">{navLabel}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
            {viewModes.map((mode) => (
              <motion.button
                key={mode}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewModeChange(mode)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {mode}
              </motion.button>
            ))}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddTask}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium text-white shadow-lg shadow-purple-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarHeader;
