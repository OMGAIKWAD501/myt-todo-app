import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useTaskContext } from '../hooks/useTaskContext';
import TaskCard from './TaskCard';

const AllTasksView = () => {
  const { tasks, deleteTask } = useTaskContext();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    if (filter === 'pending') list = list.filter((t) => !t.completed);
    if (filter === 'completed') list = list.filter((t) => t.completed);
    return list.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  }, [tasks, search, filter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">All Tasks</h2>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-w-3xl">
        {filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-12">No tasks match your filters.</p>
        ) : (
          filtered.map((task, idx) => (
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

export default AllTasksView;
