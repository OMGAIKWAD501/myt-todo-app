import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  Calendar,
  CheckSquare,
  Zap,
  BarChart3,
  FileText,
  Target,
  Plus,
} from 'lucide-react';

// Mobile bottom nav items
const mobileNavItems = [
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'tasks',    label: 'Tasks',    icon: CheckSquare },
  { id: 'habits',   label: 'Habits',   icon: Zap },
  { id: 'stats',    label: 'Stats',    icon: BarChart3 },
  { id: 'notes',    label: 'Notes',    icon: FileText },
  { id: 'goals',    label: 'Goals',    icon: Target },
];

function App() {
  const { selectedDate, setSelectedDate, isLoaded } = useTaskContext();
  const [currentDate, setCurrentDate]     = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView]       = useState('calendar');
  const [viewMode, setViewMode]           = useState('Month');
  // Mobile: show task panel as overlay tab
  const [mobileShowTasks, setMobileShowTasks] = useState(false);

  const handleDateChange = (newDate) => setCurrentDate(newDate);

  const handleDateSelect = (date) => {
    const next = new Date(date);
    setSelectedDate(next);
    if (!isSameMonth(next, currentDate)) {
      setCurrentDate(new Date(next.getFullYear(), next.getMonth(), 1));
    }
    // On mobile, selecting a date opens the task panel
    setMobileShowTasks(true);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleAddTask = () => setIsAddModalOpen(true);

  const handleMobileNavChange = (id) => {
    setActiveView(id);
    setMobileShowTasks(false);
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
      {/* Ambient background */}
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

      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <div className="hidden md:flex">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* ── Main content area ── */}
      <div className="flex flex-1 min-w-0 relative z-10 flex-col md:flex-row">

        {/* Mobile top app bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-700/30 bg-slate-900/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/40">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">My Tracker</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-slate-800/50 text-slate-400 active:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>

        {/* Center content */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden pb-16 md:pb-0">
          {renderMainContent()}
        </div>

        {/* ── Desktop: Task panel always visible ── */}
        {(activeView === 'calendar' || activeView === 'tasks') && (
          <div className="hidden md:flex">
            <TaskPanel
              selectedDate={selectedDate}
              onAddTask={handleAddTask}
              showAllTasks={activeView === 'tasks'}
            />
          </div>
        )}

        {/* ── Mobile: Task panel slide-up sheet ── */}
        <AnimatePresence>
          {mobileShowTasks && activeView === 'calendar' && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileShowTasks(false)}
                className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
              />
              {/* Sheet */}
              <motion.div
                key="task-sheet"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="md:hidden fixed bottom-16 left-0 right-0 z-40 rounded-t-3xl overflow-hidden"
                style={{ maxHeight: '80vh' }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-2 pb-1 bg-slate-900 border-t border-slate-700/50">
                  <div className="w-10 h-1 bg-slate-600 rounded-full" />
                </div>
                <div style={{ maxHeight: 'calc(80vh - 20px)', overflowY: 'auto' }}>
                  <TaskPanel
                    selectedDate={selectedDate}
                    onAddTask={handleAddTask}
                    showAllTasks={false}
                    isMobileSheet
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile bottom navigation bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50">
        <div className="flex items-center justify-around px-1 py-1 safe-area-pb">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMobileNavChange(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-0 flex-1 ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-slate-500 active:text-slate-300'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-purple-500/20' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium truncate">{item.label}</span>
              </button>
            );
          })}

          {/* FAB-style Add button */}
          <button
            type="button"
            onClick={handleAddTask}
            className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all flex-1"
          >
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/40">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-medium text-purple-400">Add</span>
          </button>
        </div>
      </nav>

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
