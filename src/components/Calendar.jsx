import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskContext } from '../hooks/useTaskContext';
import { formatDate, isToday, isSameDay } from '../utils/dateUtils';

const Calendar = ({ currentDate, selectedDate, onDateSelect }) => {
  const { getTasksForDate, updateTask } = useTaskContext();

  const [draggingTask, setDraggingTask]   = useState(null);
  const [dragOverIdx, setDragOverIdx]     = useState(null);
  const [dropSuccess, setDropSuccess]     = useState(null);

  // Monday-first headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const categoryDotColors = {
    personal: '#f59e0b',
    work:     '#3b82f6',
    health:   '#10b981',
    learning: '#a855f7',
    shopping: '#ec4899',
  };

  // Build 42-cell Monday-first grid
  const calendarDays = useMemo(() => {
    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay    = new Date(year, month, 1);
    // Sunday-first: JS getDay() already returns 0=Sun
    const startOffset = firstDay.getDay();

    const cells = [];
    // Leading days (prev month)
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    // Current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    // Trailing days (next month)
    while (cells.length < 42) {
      cells.push({ date: new Date(year, month + 1, cells.length - startOffset - daysInMonth + 1), isCurrentMonth: false });
    }
    return cells;
  }, [currentDate]);

  // ── Drag & Drop ──────────────────────────────────────────────────
  const handleTaskDragStart = useCallback((e, task, sourceDateStr) => {
    e.stopPropagation();
    setDraggingTask({ task, sourceDateStr });
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceDateStr', sourceDateStr);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleTaskDragEnd = useCallback(() => {
    setDraggingTask(null);
    setDragOverIdx(null);
  }, []);

  const handleCellDragOver = useCallback((e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIdx(idx);
  }, []);

  const handleCellDragLeave = useCallback(() => setDragOverIdx(null), []);

  const handleCellDrop = useCallback((e, targetDate) => {
    e.preventDefault();
    setDragOverIdx(null);

    const taskId        = e.dataTransfer.getData('taskId');
    const sourceDateStr = e.dataTransfer.getData('sourceDateStr');
    const targetDateStr = formatDate(targetDate);

    if (!taskId || sourceDateStr === targetDateStr) { setDraggingTask(null); return; }

    const deltaDays = Math.round(
      (new Date(targetDateStr).getTime() - new Date(sourceDateStr).getTime()) / 86400000
    );

    const srcTasks = getTasksForDate(sourceDateStr);
    const task = srcTasks.find((t) => t.id === taskId);
    if (!task) { setDraggingTask(null); return; }

    const shiftDate = (ds, days) => {
      const d = new Date(ds); d.setDate(d.getDate() + days); return formatDate(d);
    };

    updateTask(taskId, {
      startDate: shiftDate(task.startDate, deltaDays),
      endDate:   shiftDate(task.endDate,   deltaDays),
    });

    const targetIdx = calendarDays.findIndex((c) => formatDate(c.date) === targetDateStr);
    if (targetIdx !== -1) {
      setDropSuccess(targetIdx);
      setTimeout(() => setDropSuccess(null), 700);
    }
    setDraggingTask(null);
  }, [getTasksForDate, updateTask, calendarDays]);

  return (
    <div className="flex flex-col h-full">

      {/* ── Day-name header row ── */}
      <div className="grid grid-cols-7 border-b border-slate-700/50">
        {dayNames.map((name, i) => (
          <div
            key={name}
            className={`text-center text-[10px] sm:text-xs font-semibold py-2 sm:py-3 tracking-wide ${
              i === 0 ? 'text-red-400'
            : i === 6 ? 'text-purple-400'
            : 'text-slate-400'
            }`}
          >
            {/* Show 1 letter on very small screens, full abbrev on larger */}
            <span className="sm:hidden">{name[0]}</span>
            <span className="hidden sm:inline">{name}</span>
          </div>
        ))}
      </div>

      {/* ── 6 × 7 grid ── */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 border-l border-t border-slate-700/30">
        {calendarDays.map(({ date, isCurrentMonth }, idx) => {
          const dateString  = formatDate(date);
          const tasks       = getTasksForDate(dateString);
          const isDayToday  = isToday(date);
          const isSelected  = isSameDay(date, selectedDate);
          const dow         = date.getDay(); // 0=Sun … 6=Sat
          const isSat       = dow === 6;
          const isSun       = dow === 0;
          const isDragOver  = dragOverIdx === idx;
          const isFlash     = dropSuccess === idx;

          return (
            <div
              key={idx}
              onClick={() => onDateSelect(date)}
              onDragOver={(e) => handleCellDragOver(e, idx)}
              onDragLeave={handleCellDragLeave}
              onDrop={(e) => handleCellDrop(e, date)}
              className={`
                relative flex flex-col overflow-hidden cursor-pointer
                border-b border-r border-slate-700/30
                transition-colors duration-150
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isFlash    ? 'bg-purple-500/20' :
                  isDragOver ? 'bg-purple-500/10' :
                  isSelected ? 'bg-blue-500/10'   :
                  isDayToday ? 'bg-purple-500/5'  :
                               'hover:bg-slate-800/30'}
              `}
            >
              {/* Selected / today ring */}
              {(isSelected || isDayToday) && (
                <div className={`absolute inset-0 border-2 pointer-events-none rounded-sm ${
                  isSelected ? 'border-blue-500/70' : 'border-purple-500/60'
                }`} />
              )}

              {/* Day number */}
              <div className="px-1 sm:px-2 pt-1.5 sm:pt-2 pb-0.5 sm:pb-1">
                <span className={`
                  text-[10px] sm:text-xs font-semibold leading-none w-5 h-5 sm:w-6 sm:h-6
                  inline-flex items-center justify-center rounded-full
                  ${isDayToday  ? 'bg-purple-600 text-white' :
                    isSelected  ? 'text-blue-300'  :
                    isSun       ? 'text-red-400'   :
                    isSat       ? 'text-purple-400':
                    isCurrentMonth ? 'text-slate-200' : 'text-slate-500'}
                `}>
                  {date.getDate()}
                </span>
              </div>

              {/* Task rows: on desktop show label, on mobile show dots only */}
              <div className="px-1 pb-1 flex flex-col gap-0.5 overflow-hidden">
                {tasks.slice(0, 3).map((task) => {
                  const isBeingDragged = draggingTask?.task?.id === task.id;
                  const dotColor = task.isCompletedForDate
                    ? '#22c55e'
                    : (categoryDotColors[task.category] || '#a855f7');

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: isBeingDragged ? 0.3 : 1, x: 0 }}
                      draggable={!task.isCompletedForDate}
                      onDragStart={(e) => handleTaskDragStart(e, task, dateString)}
                      onDragEnd={handleTaskDragEnd}
                      title={task.title}
                      className={`flex items-center gap-1 rounded px-0.5 sm:px-1 py-0.5 min-w-0 ${
                        !task.completed ? 'cursor-grab active:cursor-grabbing hover:bg-slate-700/40' : ''
                      }`}
                    >
                      {/* Colored dot */}
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dotColor }}
                      />
                      {/* Task name: hidden on mobile */}
                      <span className={`hidden sm:inline text-[11px] truncate leading-tight font-medium ${
                        task.completed ? 'text-slate-500 line-through' : 'text-slate-200'
                      }`}>
                        {task.title}
                      </span>
                    </motion.div>
                  );
                })}

                {tasks.length > 3 && (
                  <span className="text-[9px] sm:text-[10px] text-slate-500 px-1">
                    +{tasks.length - 3}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Drag hint ── */}
      <AnimatePresence>
        {draggingTask && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 border border-purple-500/40 rounded-full text-xs text-purple-200 shadow-xl pointer-events-none flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Drop on any day to reschedule &ldquo;{draggingTask.task.title}&rdquo;
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
