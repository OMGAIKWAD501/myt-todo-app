import React from 'react';
import { motion } from 'framer-motion';
import CalendarHeader from './CalendarHeader';
import Calendar from './Calendar';
import DayView from './DayView';
import WeekView from './WeekView';
import YearView from './YearView';

const CenterSection = ({
  currentDate,
  selectedDate,
  viewMode,
  onDateChange,
  onDateSelect,
  onViewModeChange,
  onAddTask,
  onToday,
}) => {
  const handleMonthSelect = (monthDate) => {
    onDateChange(monthDate);
    onViewModeChange('Month');
  };

  const renderCalendarBody = () => {
    switch (viewMode) {
      case 'Day':
        return (
          <DayView selectedDate={selectedDate} onDateSelect={onDateSelect} />
        );
      case 'Week':
        return (
          <WeekView
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        );
      case 'Year':
        return (
          <YearView
            currentDate={currentDate}
            onMonthSelect={handleMonthSelect}
            onDateSelect={onDateSelect}
          />
        );
      case 'Month':
      default:
        return (
          <Calendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col bg-gradient-to-br from-navy via-slate-900 to-slate-900 border-r border-slate-700/50 min-w-0"
    >
      <CalendarHeader
        onAddTask={onAddTask}
        currentDate={currentDate}
        onDateChange={onDateChange}
        onToday={onToday}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      <div className="flex-1 overflow-y-auto">{renderCalendarBody()}</div>
    </motion.div>
  );
};

export default CenterSection;
