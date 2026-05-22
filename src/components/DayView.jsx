import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../hooks/useTaskContext';
import { formatDate, isToday } from '../utils/dateUtils';
import TaskCard from './TaskCard';

const DayView = ({ selectedDate, onDateSelect }) => {
  const { getTasksForDate, deleteTask } = useTaskContext();
  const dateString = formatDate(selectedDate);
  const tasks = useMemo(
    () => getTasksForDate(dateString),
    [dateString, getTasksForDate]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-8 max-w-2xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-white mb-1">
        {selectedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </h3>
      {isToday(selectedDate) && (
        <span className="text-xs text-purple-400 font-medium">Today</span>
      )}
      <p className="text-slate-400 text-sm mt-2 mb-6">
        {tasks.length} task{tasks.length !== 1 ? 's' : ''} scheduled
      </p>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-slate-500 text-center py-12">
            No tasks on this day. Click Add Task to create one.
          </p>
        ) : (
          tasks.map((task, idx) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={deleteTask}
              index={idx}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default DayView;
