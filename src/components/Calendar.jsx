import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../hooks/useTaskContext';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  isToday,
} from '../utils/dateUtils';

const Calendar = ({ currentDate, onDateSelect }) => {
  const { getTasksForDate } = useTaskContext();

  const daysInMonth = useMemo(
    () => getDaysInMonth(currentDate),
    [currentDate]
  );
  const firstDayOfMonth = useMemo(
    () => getFirstDayOfMonth(currentDate),
    [currentDate]
  );

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayClick = (day) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onDateSelect(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-6 py-8"
    >
      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells before first day */}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          );
          const dateString = formatDate(date);
          const tasks = getTasksForDate(dateString);
          const isDayToday = isToday(date);
          const dayOfWeek = date.getDay();
          const isSaturday = dayOfWeek === 6;
          const isSunday = dayOfWeek === 0;

          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDayClick(day)}
              className={`aspect-square p-2 rounded-xl relative transition-all border ${
                isDayToday
                  ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/50'
                  : 'border-slate-700/30 bg-slate-800/30 hover:bg-slate-800/50'
              } flex flex-col items-start justify-start`}
            >
              <span
                className={`text-sm font-bold mb-1 ${
                  isDayToday
                    ? 'text-purple-300'
                    : isSunday
                    ? 'text-red-400'
                    : isSaturday
                    ? 'text-purple-400'
                    : 'text-slate-300'
                }`}
              >
                {day}
              </span>

              {/* Task dots */}
              <div className="flex flex-wrap gap-0.5">
                {tasks.slice(0, 3).map((task, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                ))}
                {tasks.length > 3 && (
                  <span className="text-xs text-slate-400 ml-0.5">
                    +{tasks.length - 3}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Calendar;
