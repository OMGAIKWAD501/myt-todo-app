import React, { createContext, useState, useCallback, useEffect } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((task) => {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTaskCompletion = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const getTasksForDate = useCallback(
    (dateString) => {
      return tasks.filter(
        (task) =>
          task.startDate === dateString ||
          (task.startDate <= dateString && task.endDate >= dateString)
      );
    },
    [tasks]
  );

  const getCompletedCount = useCallback(() => {
    return tasks.filter((task) => task.completed).length;
  }, [tasks]);

  const getInProgressCount = useCallback(() => {
    return tasks.filter((task) => !task.completed).length;
  }, [tasks]);

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksForDate,
    getCompletedCount,
    getInProgressCount,
    selectedDate,
    setSelectedDate,
    isDarkMode,
    setIsDarkMode,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
