import React from 'react';
import { motion } from 'framer-motion';
import CalendarHeader from './CalendarHeader';
import Calendar from './Calendar';

const CenterSection = ({
  currentDate,
  onDateChange,
  onDateSelect,
  onAddTask,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col bg-gradient-to-br from-navy via-slate-900 to-slate-900 border-r border-slate-700/50"
    >
      <CalendarHeader
        onAddTask={onAddTask}
        currentDate={currentDate}
        onDateChange={onDateChange}
      />

      <div className="flex-1 overflow-y-auto">
        <Calendar
          currentDate={currentDate}
          onDateSelect={onDateSelect}
        />
      </div>
    </motion.div>
  );
};

export default CenterSection;
