import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

const SimpleListView = ({ title, storageKey, placeholder }) => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const addItem = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), text, done: false },
    ]);
    setInput('');
  };

  const toggle = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl"
    >
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>

      <form onSubmit={addItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </form>

      <ul className="space-y-2">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm">Nothing here yet — add one above.</p>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30"
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggle(item.id)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span
                className={`flex-1 ${
                  item.done ? 'text-slate-500 line-through' : 'text-white'
                }`}
              >
                {item.text}
              </span>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="p-1 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))
        )}
      </ul>
    </motion.div>
  );
};

export default SimpleListView;
