import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Pencil } from 'lucide-react';
import { useTaskContext } from '../hooks/useTaskContext';

const EditTaskModal = ({ isOpen, onClose, task }) => {
  const { updateTask } = useTaskContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});

  // Pre-fill form whenever the task changes or modal opens
  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        title:       task.title       || '',
        description: task.description || '',
        category:    task.category    || 'personal',
        priority:    task.priority    || 'medium',
        startDate:   task.startDate   || '',
        endDate:     task.endDate     || '',
      });
      setErrors({});
    }
  }, [isOpen, task]);

  const categories = ['personal', 'work', 'health', 'learning', 'shopping'];
  const priorities  = ['low', 'medium', 'high'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Task title is required';
    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate)
      errs.endDate = 'End date must be on or after start date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateTask(task.id, { ...formData, color: formData.category });
    onClose();
  };

  const inputCls =
    'w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all';

  return (
    <AnimatePresence>
      {isOpen && task && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 24 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{   scale: 0.93, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-navy border border-slate-700/50 rounded-3xl shadow-2xl shadow-purple-500/20">

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-purple-300" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Edit Task</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Task Title <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    autoFocus
                    className={inputCls}
                  />
                  {errors.title && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 mt-1 text-red-400 text-xs"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.title}
                    </motion.div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add task details (optional)"
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Category & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-slate-800">
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      {priorities.map((p) => (
                        <option key={p} value={p} className="bg-slate-800">
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={inputCls}
                    />
                    {errors.endDate && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 mt-1 text-red-400 text-xs"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.endDate}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Hint */}
                <p className="text-[11px] text-slate-500 text-center pt-1">
                  Double-click any task to edit it
                </p>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl font-medium text-slate-300 hover:text-white transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-medium text-white shadow-lg shadow-purple-500/40 transition-all"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditTaskModal;
