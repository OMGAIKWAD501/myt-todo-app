import React from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../hooks/useTaskContext';
import { formatDate, getWeekDays, isSameDay, isToday } from '../utils/dateUtils';

const WeekView = ({ selectedDate, onDateSelect }) => {
  const { getTasksForDate } = useTaskContext();
  const weekDays = getWeekDays(selectedDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-8"
    >
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((date) => {
          const dateString = formatDate(date);
          const tasks = getTasksForDate(dateString);
          const selected = isSameDay(date, selectedDate);
          const today = isToday(date);

          return (
            <motion.button
              key={dateString}
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDateSelect(new Date(date))}
              className={`min-h-[140px] p-3 rounded-xl border text-left flex flex-col transition-all ${
                selected
                  ? 'border-blue-500/60 bg-blue-500/15 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20'
                  : today
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-slate-700/30 bg-slate-800/30 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xs text-slate-400">
                {dayNames[date.getDay()]}
              </span>
              <span
                className={`text-lg font-bold ${
                  selected ? 'text-blue-300' : today ? 'text-purple-300' : 'text-white'
                }`}
              >
                {date.getDate()}
              </span>
              <div className="mt-2 space-y-1 flex-1 overflow-hidden">
                {tasks.slice(0, 4).map((task) => (
                  <p
                    key={task.id}
                    className={`text-xs truncate ${
                      task.completed
                        ? 'text-slate-500 line-through'
                        : 'text-slate-300'
                    }`}
                  >
                    {task.title}
                  </p>
                ))}
                {tasks.length > 4 && (
                  <p className="text-xs text-slate-500">+{tasks.length - 4} more</p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeekView;
