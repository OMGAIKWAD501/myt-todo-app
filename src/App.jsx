import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import CenterSection from './components/CenterSection';
import TaskPanel from './components/TaskPanel';
import AddTaskModal from './components/AddTaskModal';
import { useTaskContext } from './hooks/useTaskContext';
import { dummyTasks } from './data/dummyData';

function App() {
  const { tasks, addTask } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize with dummy data if no tasks exist
  React.useEffect(() => {
    if (tasks.length === 0) {
      dummyTasks.forEach((task) => {
        addTask(task);
      });
    }
  }, []);

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen overflow-hidden bg-gradient-to-br from-navy via-slate-900 to-slate-900 relative"
    >
      {/* Background gradient animation */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="fixed inset-0 pointer-events-none"
      />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Calendar Section */}
      <CenterSection
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onDateSelect={handleDateSelect}
        onAddTask={handleAddTask}
      />

      {/* Right Task Panel */}
      <TaskPanel selectedDate={selectedDate} />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedDate={selectedDate}
      />
    </motion.div>
  );
}

export default App;
