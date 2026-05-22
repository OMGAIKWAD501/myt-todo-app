import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../hooks/useTaskContext';

const StatsView = () => {
  const { tasks, getCompletedCount, getInProgressCount } = useTaskContext();

  const byCategory = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const cat = t.category || 'other';
      if (!map[cat]) map[cat] = { total: 0, done: 0 };
      map[cat].total++;
      if (t.completed) map[cat].done++;
    });
    return Object.entries(map);
  }, [tasks]);

  const byPriority = useMemo(() => {
    const map = { high: 0, medium: 0, low: 0 };
    tasks.filter((t) => !t.completed).forEach((t) => {
      if (map[t.priority] !== undefined) map[t.priority]++;
    });
    return map;
  }, [tasks]);

  const completed = getCompletedCount();
  const inProgress = getInProgressCount();
  const total = tasks.length;
  const percent = total ? (completed / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl">
        {[
          { label: 'Total', value: total, color: 'text-white' },
          { label: 'Completed', value: completed, color: 'text-green-400' },
          { label: 'In progress', value: inProgress, color: 'text-blue-400' },
          { label: 'Completion', value: `${percent.toFixed(0)}%`, color: 'text-purple-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30"
          >
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-300 mb-3">By category</h3>
          <div className="space-y-2">
            {byCategory.map(([cat, data]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-24 capitalize text-sm text-slate-400">{cat}</span>
                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${data.total ? (data.done / data.total) * 100 : 0}%`,
                    }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
                <span className="text-xs text-slate-400 w-12 text-right">
                  {data.done}/{data.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-300 mb-3">Pending by priority</h3>
          <div className="flex gap-4">
            {Object.entries(byPriority).map(([pri, count]) => (
              <div
                key={pri}
                className="flex-1 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 text-center"
              >
                <p className="text-xs capitalize text-slate-400">{pri}</p>
                <p className="text-xl font-bold text-white">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsView;
