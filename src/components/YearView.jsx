import React from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../hooks/useTaskContext';
import { getMonthsInYear, getYear, getDaysInMonth, formatDate } from '../utils/dateUtils';

const YearView = ({ currentDate, onMonthSelect, onDateSelect }) => {
  const { getTasksForDate } = useTaskContext();
  const year = getYear(currentDate);
  const months = getMonthsInYear(year);

  const getTaskCountForMonth = (monthDate) => {
    const days = getDaysInMonth(monthDate);
    let count = 0;
    for (let d = 1; d <= days; d++) {
      const date = new Date(year, monthDate.getMonth(), d);
      count += getTasksForDate(formatDate(date)).length;
    }
    return count;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-8"
    >
      <h3 className="text-xl font-bold text-white mb-6 text-center">{year}</h3>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {months.map((monthDate) => {
          const taskCount = getTaskCountForMonth(monthDate);
          const isCurrentMonth =
            monthDate.getMonth() === currentDate.getMonth() &&
            monthDate.getFullYear() === currentDate.getFullYear();

          return (
            <motion.button
              key={monthDate.getMonth()}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onMonthSelect(monthDate);
                onDateSelect(new Date(year, monthDate.getMonth(), 1));
              }}
              className={`p-4 rounded-xl border text-center transition-all ${
                isCurrentMonth
                  ? 'border-purple-500/50 bg-purple-500/15'
                  : 'border-slate-700/30 bg-slate-800/30 hover:bg-slate-800/50'
              }`}
            >
              <p className="font-semibold text-white">
                {monthDate.toLocaleDateString('en-US', { month: 'short' })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {taskCount} task{taskCount !== 1 ? 's' : ''}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default YearView;
