import React, { useState } from 'react';
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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-navy via-slate-900 to-slate-900 relative">
      {/* Background gradient animation */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />

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
    </div>
  );
}

export default App;
