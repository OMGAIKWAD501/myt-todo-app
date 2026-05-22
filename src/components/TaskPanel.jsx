import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskContext } from '../hooks/useTaskContext';
import { formatDate } from '../utils/dateUtils';
import EditTaskModal from './EditTaskModal';
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Trash2,
  GripVertical,
} from 'lucide-react';

const priorityBadge = {
  high:   'bg-red-500/20 text-red-300 border border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  low:    'bg-green-500/20 text-green-300 border border-green-500/30',
};

const TaskPanel = ({ selectedDate, onAddTask, showAllTasks = false }) => {
  const {
    tasks,
    getTasksForDate,
    deleteTask,
    toggleTaskCompletion,
    getCompletedCount,
    getInProgressCount,
  } = useTaskContext();

  const [filterMode, setFilterMode] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const dateString = formatDate(selectedDate);

  const displayTasks = useMemo(() => {
    if (showAllTasks) return [...tasks].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
    if (filterMode === 'date') return getTasksForDate(dateString);
    return [...tasks].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  }, [dateString, tasks, showAllTasks, filterMode, getTasksForDate]);

  const pendingTasks   = displayTasks.filter((t) => !t.completed);
  const completedTasks = displayTasks.filter((t) => t.completed);

  const completedCount    = getCompletedCount();
  const inProgressCount   = getInProgressCount();
  const totalCompletionPct = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-96 bg-gradient-to-b from-slate-900 via-slate-900 to-navy border-l border-slate-700/50 flex flex-col h-screen overflow-hidden shrink-0"
    >
      {/* ── Header ── */}
      <div className="p-6 border-b border-slate-700/30">
        <div className="flex items-start justify-between gap-2">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white mb-1"
            >
              {showAllTasks ? 'All Tasks' : 'My To Do List'}
            </motion.h2>
            <p className="text-sm text-slate-400">
              {showAllTasks
                ? `${tasks.length} total tasks`
                : filterMode === 'date'
                ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })
                : `${tasks.length} total tasks`}
            </p>
          </div>
          {onAddTask && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddTask}
              className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:text-white shrink-0"
              aria-label="Add task"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Filter toggle */}
        {!showAllTasks && (
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-purple-600/40 border border-purple-500/60 text-purple-200'
                  : 'bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Tasks
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('date')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'date'
                  ? 'bg-blue-600/40 border border-blue-500/60 text-blue-200'
                  : 'bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              This Date
            </button>
          </div>
        )}
      </div>

      {/* ── Task list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence mode="popLayout">

          {/* Empty state */}
          {displayTasks.length === 0 && (
            <motion.div
              key="empty"
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
              <p className="text-slate-400">
                {filterMode === 'date' ? 'No tasks for this date' : 'No tasks yet'}
              </p>
              {onAddTask && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={onAddTask}
                  className="mt-4 px-4 py-2 text-sm bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-lg border border-purple-500/30"
                >
                  Add Task
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Pending tasks */}
          {pendingTasks.length > 0 && (
            <motion.div key="pending-section">
              <h3 className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                In Progress ({pendingTasks.length})
              </h3>
              <div className="space-y-2">
                {pendingTasks.map((task, idx) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={idx}
                    onDelete={deleteTask}
                    onToggle={toggleTaskCompletion}
                    onEdit={setEditingTask}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <motion.div key="completed-section">
              <h3 className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-2">
                {completedTasks.map((task, idx) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={pendingTasks.length + idx}
                    onDelete={deleteTask}
                    onToggle={toggleTaskCompletion}
                    onEdit={setEditingTask}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Progress Statistics ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 border-t border-slate-700/30"
      >
        <h3 className="text-sm font-bold text-white mb-4">Progress Statistics</h3>

        {/* Overall completion bar */}
        <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">Overall Completion</span>
            <span className="text-sm font-bold text-purple-300">
              {totalCompletionPct.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalCompletionPct}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            />
          </div>
        </div>

        {/* Stat cards */}
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
      </motion.div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />
    </motion.div>
  );
};

// ── Task Card ─────────────────────────────────────────────────────
const TaskCard = ({ task, index, onDelete, onToggle, onEdit }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.01, y: -2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onDoubleClick={() => onEdit(task)}
      draggable={!task.completed}
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.setData('sourceDateStr', task.startDate);
        e.dataTransfer.effectAllowed = 'move';
      }}
      className={`p-3 rounded-2xl border transition-all relative ${
        task.completed
          ? 'bg-slate-800/20 border-slate-700/20 opacity-60'
          : 'bg-slate-800/50 border-slate-700/30 hover:border-purple-500/40'
      } ${!task.completed ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Double-click hint */}
      <AnimatePresence>
        {hovered && !task.completed && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            className="absolute -top-2 right-3 px-2 py-0.5 bg-slate-700/90 border border-slate-600/50 rounded-full text-[10px] text-slate-300 pointer-events-none z-10"
          >
            double-click to edit
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* Drag handle */}
        {!task.completed && (
          <GripVertical className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
        )}

        {/* Toggle checkbox */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => onToggle(task.id)}
          className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-purple-400 transition-colors"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-sm truncate ${
              task.completed ? 'text-slate-500 line-through' : 'text-white'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {task.priority && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityBadge[task.priority] || priorityBadge.medium}`}>
                {task.priority}
              </span>
            )}
            <span className="text-[10px] text-slate-500">
              {task.startDate === task.endDate
                ? task.startDate
                : `${task.startDate} → ${task.endDate}`}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="flex-shrink-0 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskPanel;
