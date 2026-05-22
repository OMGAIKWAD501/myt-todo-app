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
      className="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-700/30 bg-gradient-to-r from-slate-900/50 via-slate-900/30 to-navy/50 backdrop-blur-xl"
    >
      {/* Row 1: nav + title + Add Task button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Prev */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={
              viewMode === 'Year'
                ? () => { const d = new Date(currentDate); d.setFullYear(d.getFullYear() - 1); onDateChange(d); }
                : handlePrevMonth
            }
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-all text-slate-300 hover:text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Today */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToday}
            className="px-2 sm:px-4 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-all"
          >
            Today
          </motion.button>

          {/* Next */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={
              viewMode === 'Year'
                ? () => { const d = new Date(currentDate); d.setFullYear(d.getFullYear() + 1); onDateChange(d); }
                : handleNextMonth
            }
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-all text-slate-300 hover:text-white"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Month/Year label */}
          <h2 className="text-sm sm:text-lg font-bold text-white pl-1 whitespace-nowrap">{navLabel}</h2>
        </div>

        {/* Add Task button - icon only on mobile, full label on desktop */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddTask}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium text-white shadow-lg shadow-purple-500/50 transition-all text-sm"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="hidden sm:inline">Add Task</span>
        </motion.button>
      </div>

      {/* Row 2: View mode selector - scrollable on mobile */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg overflow-x-auto no-scrollbar">
        {viewModes.map((mode) => (
          <motion.button
            key={mode}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewModeChange(mode)}
            className={`px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
              viewMode === mode
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {mode}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarHeader;
