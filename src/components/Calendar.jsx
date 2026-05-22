import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../hooks/useTaskContext';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  isToday,
  isSameDay,
} from '../utils/dateUtils';

const Calendar = ({ currentDate, selectedDate, onDateSelect }) => {
  const { getTasksForDate } = useTaskContext();

  const daysInMonth = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const firstDayOfMonth = useMemo(() => getFirstDayOfMonth(currentDate), [currentDate]);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Category chip color map
  const categoryChipColors = {
    personal: 'bg-yellow-500/30 text-yellow-200 border-yellow-500/50',
    work:     'bg-blue-500/30 text-blue-200 border-blue-500/50',
    health:   'bg-green-500/30 text-green-200 border-green-500/50',
    learning: 'bg-purple-500/30 text-purple-200 border-purple-500/50',
    shopping: 'bg-pink-500/30 text-pink-200 border-pink-500/50',
  };

  const handleDayClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDateSelect(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-6 py-6"
    >
      {/* Day name headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty leading cells */}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[80px]" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateString = formatDate(date);
          const tasks = getTasksForDate(dateString);
          const isDayToday = isToday(date);
          const isSelected = isSameDay(date, selectedDate);
          const dayOfWeek = date.getDay();
          const isSaturday = dayOfWeek === 6;
          const isSunday = dayOfWeek === 0;

          const visibleTasks = tasks.slice(0, 2);
          const extraCount = tasks.length - visibleTasks.length;

          return (
            <motion.button
              key={day}
              type="button"
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleDayClick(day)}
              className={`min-h-[80px] p-2 rounded-xl relative transition-all border flex flex-col items-start overflow-hidden ${
                isSelected
                  ? 'border-blue-500/70 bg-blue-500/20 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/30'
                  : isDayToday
                  ? 'border-purple-500/50 bg-purple-500/10 shadow-md shadow-purple-500/20'
                  : 'border-slate-700/30 bg-slate-800/30 hover:bg-slate-800/50'
              }`}
            >
              {/* Day number */}
              <span
                className={`text-sm font-bold mb-1 leading-none ${
                  isSelected
                    ? 'text-blue-300'
                    : isDayToday
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

              {/* Task name chips */}
              <div className="flex flex-col gap-0.5 w-full">
                {visibleTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-full px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border leading-tight ${
                      task.completed
                        ? 'bg-green-500/15 text-green-300/60 border-green-500/30 line-through'
                        : categoryChipColors[task.category] ||
                          'bg-slate-600/40 text-slate-300 border-slate-500/40'
                    }`}
                  >
                    {task.title}
                  </motion.div>
                ))}

                {extraCount > 0 && (
                  <span className="text-[10px] text-slate-400 font-medium pl-0.5 leading-tight">
                    +{extraCount} more
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
