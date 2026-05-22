import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../utils/dateUtils';
import { useTaskContext } from '../hooks/useTaskContext';
import TaskCard from './TaskCard';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const TaskPanel = ({ selectedDate }) => {
  const { tasks, getTasksForDate, deleteTask, getCompletedCount, getInProgressCount } = useTaskContext();
  
  const dateString = formatDate(selectedDate);
  const tasksForDate = useMemo(() => getTasksForDate(dateString), [dateString, tasks]);
  
  const completedTasks = useMemo(
    () => tasksForDate.filter((t) => t.completed),
    [tasksForDate]
  );
  const pendingTasks = useMemo(
    () => tasksForDate.filter((t) => !t.completed),
    [tasksForDate]
  );

  const completedCount = getCompletedCount();
  const inProgressCount = getInProgressCount();
  const totalCompletionPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-96 bg-gradient-to-b from-slate-900 via-slate-900 to-navy border-l border-slate-700/50 flex flex-col h-screen overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/30 bg-gradient-to-r from-slate-900/50 via-slate-900/30 to-navy/50 backdrop-blur-xl">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-2"
        >
          My To Do List
        </motion.h2>
        <p className="text-sm text-slate-400">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <motion.div>
              <h3 className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                In Progress ({pendingTasks.length})
              </h3>
              <div className="space-y-3">
                {pendingTasks.map((task, idx) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                    index={idx}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <motion.div>
              <h3 className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                {completedTasks.map((task, idx) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                    index={pendingTasks.length + idx}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {tasksForDate.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-4"
              >
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
              </motion.div>
              <p className="text-slate-400">No tasks for this date</p>
              <p className="text-xs text-slate-500 mt-1">
                Add a task to get started
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 border-t border-slate-700/30 bg-gradient-to-r from-slate-900/50 via-slate-900/30 to-navy/50 backdrop-blur-xl"
      >
        <h3 className="text-sm font-bold text-white mb-4">Progress Statistics</h3>
        
        {/* Stats Grid */}
        <div className="space-y-3">
          {/* Overall Completion */}
          <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Overall Completion</span>
              <span className="text-sm font-bold text-purple-300">
                {totalCompletionPercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden border border-slate-600/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalCompletionPercent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-3 rounded-lg border border-green-500/20"
            >
              <p className="text-xs text-slate-400">Completed</p>
              <p className="text-xl font-bold text-green-400">{completedCount}</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-3 rounded-lg border border-blue-500/20"
            >
              <p className="text-xs text-slate-400">In Progress</p>
              <p className="text-xl font-bold text-blue-400">{inProgressCount}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskPanel;
