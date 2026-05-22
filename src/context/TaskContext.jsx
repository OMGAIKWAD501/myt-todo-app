import React, { createContext, useState, useCallback, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';

export const TaskContext = createContext();

const STORAGE_KEY = 'tasks';
const THEME_KEY = 'myTrackerDarkMode';

const parseDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (dateString, offset) => {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + offset);
  return formatDate(date);
};

const getDateRange = (startDate, endDate) => {
  const dates = [];
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(formatDate(new Date(d)));
  }
  return dates;
};

const isRangeCompleted = (rangeDates, completedDates) =>
  rangeDates.every((date) => completedDates.includes(date));

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved !== 'false';
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migrate old tasks that use boolean `completed` → completedDates[]
          const migrated = parsed.map((t) => ({
            ...t,
            completedDates: t.completedDates ?? (t.completed ? [t.startDate] : []),
          }));
          setTasks(migrated);
          setIsLoaded(true);
          return;
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
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
      completedDates: [],
      completed: false,
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

  const deleteTask = useCallback((id, dateStr) => {
    setTasks((prev) =>
      prev.reduce((updated, task) => {
        if (task.id !== id) {
          updated.push(task);
          return updated;
        }

        if (!dateStr) {
          return updated;
        }

        if (dateStr < task.startDate || dateStr > task.endDate) {
          updated.push(task);
          return updated;
        }

        if (task.startDate === task.endDate) {
          return updated;
        }

        const completedDates = Array.isArray(task.completedDates)
          ? task.completedDates.filter((date) => date !== dateStr)
          : [];

        if (dateStr === task.startDate) {
          const newStart = addDays(task.startDate, 1);
          const range = getDateRange(newStart, task.endDate);
          updated.push({
            ...task,
            startDate: newStart,
            completedDates,
            completed: isRangeCompleted(range, completedDates),
          });
          return updated;
        }

        if (dateStr === task.endDate) {
          const newEnd = addDays(task.endDate, -1);
          const range = getDateRange(task.startDate, newEnd);
          updated.push({
            ...task,
            endDate: newEnd,
            completedDates,
            completed: isRangeCompleted(range, completedDates),
          });
          return updated;
        }

        const beforeEnd = addDays(dateStr, -1);
        const afterStart = addDays(dateStr, 1);
        const beforeDates = completedDates.filter(
          (date) => date >= task.startDate && date <= beforeEnd
        );
        const afterDates = completedDates.filter(
          (date) => date >= afterStart && date <= task.endDate
        );

        const createSplitTask = (newStart, newEnd, dates) => ({
          ...task,
          id: `${task.id}-${newStart}-${newEnd}`,
          startDate: newStart,
          endDate: newEnd,
          completedDates: dates,
          completed: isRangeCompleted(getDateRange(newStart, newEnd), dates),
        });

        updated.push(createSplitTask(task.startDate, beforeEnd, beforeDates));
        updated.push(createSplitTask(afterStart, task.endDate, afterDates));
        return updated;
      }, [])
    );
  }, []);

  // Toggle completion for a specific date.
  // If dateStr is omitted, toggles ALL dates in the task's range.
  const toggleTaskCompletion = useCallback((id, dateStr) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const completedDates = Array.isArray(task.completedDates)
          ? [...task.completedDates]
          : [];

        if (dateStr) {
          // Per-date toggle
          const idx = completedDates.indexOf(dateStr);
          if (idx === -1) completedDates.push(dateStr);
          else completedDates.splice(idx, 1);
        } else {
          // Whole-task toggle: fill or clear every date in range
          const start = new Date(task.startDate);
          const end   = new Date(task.endDate);
          const allDates = [];
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            allDates.push(formatDate(new Date(d)));
          }
          const allDone = allDates.every((d) => completedDates.includes(d));
          if (allDone) completedDates.length = 0;   // un-complete all
          else allDates.forEach((d) => { if (!completedDates.includes(d)) completedDates.push(d); });
        }

        // Compute overall completed flag
        const start = new Date(task.startDate);
        const end   = new Date(task.endDate);
        let allDone = true;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (!completedDates.includes(formatDate(new Date(d)))) { allDone = false; break; }
        }

        return { ...task, completedDates, completed: allDone };
      })
    );
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getTasksForDate = useCallback(
    (dateString) => {
      return tasks
        .filter(
          (task) =>
            task.startDate === dateString ||
            (task.startDate <= dateString && task.endDate >= dateString)
        )
        .map((task) => ({
          ...task,
          // Per-day completion flag for this specific date
          isCompletedForDate: Array.isArray(task.completedDates)
            ? task.completedDates.includes(dateString)
            : !!task.completed,
        }));
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
