export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getDateFromString = (dateString) => {
  return new Date(dateString + 'T00:00:00');
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isSameMonth = (date1, date2) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const getMonthName = (date) => {
  return date.toLocaleDateString('en-US', { month: 'long' });
};

export const getYear = (date) => {
  return date.getFullYear();
};

export const getTasksForDate = (tasks, dateString) => {
  return tasks.filter(
    (task) =>
      task.startDate === dateString ||
      (task.startDate <= dateString && task.endDate >= dateString)
  );
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};
