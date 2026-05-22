import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useTaskContext } from '../hooks/useTaskContext';

const TaskCard = ({ task, onDelete, index }) => {
  const { toggleTaskCompletion } = useTaskContext();

  const categoryColors = {
    personal: 'from-yellow-500 to-orange-500',
    work: 'from-blue-500 to-cyan-500',
    health: 'from-green-500 to-emerald-500',
    learning: 'from-purple-500 to-pink-500',
    shopping: 'from-pink-500 to-rose-500',
  };

  const categoryBg = {
    personal: 'bg-yellow-500/10 border-yellow-500/20',
    work: 'bg-blue-500/10 border-blue-500/20',
    health: 'bg-green-500/10 border-green-500/20',
    learning: 'bg-purple-500/10 border-purple-500/20',
    shopping: 'bg-pink-500/10 border-pink-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`p-4 rounded-2xl border transition-all ${
        task.completed
          ? 'bg-slate-800/30 border-slate-700/20 opacity-60'
          : categoryBg[task.category] || 'bg-slate-800/50 border-slate-700/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleTaskCompletion(task.id)}
          className="mt-1 flex-shrink-0 text-slate-400 hover:text-purple-400 transition-all"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold truncate ${
              task.completed
                ? 'text-slate-500 line-through'
                : 'text-white'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                task.priority === 'high'
                  ? 'bg-red-500/20 text-red-300'
                  : task.priority === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-green-500/20 text-green-300'
              }`}
            >
              {task.priority}
            </span>
            <span className="text-xs text-slate-400">
              {task.startDate === task.endDate
                ? task.startDate
                : `${task.startDate} → ${task.endDate}`}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
