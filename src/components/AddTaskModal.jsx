import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useTaskContext } from '../hooks/useTaskContext';
import { formatDate } from '../utils/dateUtils';

const AddTaskModal = ({ isOpen, onClose, selectedDate }) => {
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    startDate: formatDate(selectedDate),
    endDate: formatDate(selectedDate),
  });
  const [errors, setErrors] = useState({});

  const categories = ['personal', 'work', 'health', 'learning', 'shopping'];
  const priorities = ['low', 'medium', 'high'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addTask({
      ...formData,
      completed: false,
      color: formData.category,
    });

    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      startDate: formatDate(selectedDate),
      endDate: formatDate(selectedDate),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-navy border border-slate-700/50 rounded-3xl shadow-2xl shadow-purple-500/20">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/30">
                <h2 className="text-2xl font-bold text-white">Add New Task</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                  {errors.title && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 mt-1 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
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
                    rows="3"
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                  />
                </div>

                {/* Category and Priority Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    >
                      {priorities.map((pri) => (
                        <option key={pri} value={pri}>
                          {pri.charAt(0).toUpperCase() + pri.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>
                {errors.endDate && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.endDate}
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg font-medium text-slate-300 hover:text-white transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium text-white shadow-lg shadow-purple-500/50 transition-all"
                  >
                    Add Task
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

export default AddTaskModal;
