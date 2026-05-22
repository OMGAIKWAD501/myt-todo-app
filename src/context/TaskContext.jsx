import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { dummyTasks } from '../data/dummyData';
import { formatDate } from '../utils/dateUtils';

export const TaskContext = createContext();

const STORAGE_KEY = 'tasks';
const THEME_KEY = 'myTrackerDarkMode';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved !== 'false';
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const seededRef = useRef(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          setIsLoaded(true);
          return;
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    if (!seededRef.current) {
      seededRef.current = true;
      setTasks(
        dummyTasks.map((task) => ({
          ...task,
          createdAt: new Date().toISOString(),
        }))
      );
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, String(isDarkMode));
    document.documentElement.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

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

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    localStorage.removeItem(STORAGE_KEY);
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

  const getTodayProgress = useCallback(() => {
    const today = formatDate(new Date());
    const todayTasks = tasks.filter(
      (task) =>
        task.startDate === today ||
        (task.startDate <= today && task.endDate >= today)
    );
    const completed = todayTasks.filter((t) => t.completed).length;
    return {
      completed,
      total: todayTasks.length,
      percent: todayTasks.length
        ? (completed / todayTasks.length) * 100
        : 0,
    };
  }, [tasks]);

  const value = {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    clearAllTasks,
    getTasksForDate,
    getCompletedCount,
    getInProgressCount,
    getTodayProgress,
    selectedDate,
    setSelectedDate,
    isDarkMode,
    setIsDarkMode,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
