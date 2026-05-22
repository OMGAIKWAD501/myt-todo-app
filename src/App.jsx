import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import CenterSection from './components/CenterSection';
import TaskPanel from './components/TaskPanel';
import AddTaskModal from './components/AddTaskModal';
import SettingsModal from './components/SettingsModal';
import AllTasksView from './components/AllTasksView';
import StatsView from './components/StatsView';
import SimpleListView from './components/SimpleListView';
import { useTaskContext } from './hooks/useTaskContext';
import { isSameMonth } from './utils/dateUtils';

function App() {
  const { selectedDate, setSelectedDate, isLoaded } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState('calendar');
  const [viewMode, setViewMode] = useState('Month');

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    const next = new Date(date);
    setSelectedDate(next);
    if (!isSameMonth(next, currentDate)) {
      setCurrentDate(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'tasks':
        return <AllTasksView />;
      case 'stats':
        return <StatsView />;
      case 'habits':
        return (
          <SimpleListView
            title="Habits"
            storageKey="myTrackerHabits"
            placeholder="Add a habit..."
          />
        );
      case 'notes':
        return (
          <SimpleListView
            title="Notes"
            storageKey="myTrackerNotes"
            placeholder="Add a note..."
          />
        );
      case 'goals':
        return (
          <SimpleListView
            title="Goals"
            storageKey="myTrackerGoals"
            placeholder="Add a goal..."
          />
        );
      case 'calendar':
      default:
        return (
          <CenterSection
            currentDate={currentDate}
            selectedDate={selectedDate}
            viewMode={viewMode}
            onDateChange={handleDateChange}
            onDateSelect={handleDateSelect}
            onViewModeChange={setViewMode}
            onAddTask={handleAddTask}
            onToday={handleToday}
          />
        );
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen overflow-hidden bg-gradient-to-br from-navy via-slate-900 to-slate-900 relative"
    >
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="fixed inset-0 pointer-events-none z-0"
      />

      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex flex-1 min-w-0 relative z-10">
        {renderMainContent()}

        {(activeView === 'calendar' || activeView === 'tasks') && (
          <TaskPanel
            selectedDate={selectedDate}
            onAddTask={handleAddTask}
            showAllTasks={activeView === 'tasks'}
          />
        )}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedDate={selectedDate}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </motion.div>
  );
}

export default App;
