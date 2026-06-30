import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Clock, ChevronLeft, ChevronRight, Check, Plus } from 'lucide-react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
}

export default function CalendarView({ tasks, onAddTask }: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<number>(29); // Mocking June 29, 2026
  const [currentMonth, setCurrentMonth] = useState('June 2026');
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // Mock agenda for selected day
  const defaultAgendas: { [day: number]: { time: string; title: string; category: string }[] } = {
    28: [
      { time: "09:00 AM", title: "Core Workout Routine", category: "Life" },
      { time: "11:00 AM", title: "Project Sync meeting", category: "Work" },
      { time: "03:00 PM", title: "Study Chemistry Chapter 4", category: "Study" }
    ],
    29: [
      { time: "09:00 AM", title: "Prepare presentation draft", category: "Study" },
      { time: "10:30 AM", title: "Marketing meeting with Dave", category: "Work" },
      { time: "12:00 PM", title: "Lunch with Sarah", category: "Personal" },
      { time: "03:00 PM", title: "Coding Session: Algorithms", category: "Study" }
    ],
    30: [
      { time: "10:00 AM", title: "Dentist Appointment", category: "Personal" },
      { time: "01:30 PM", title: "Client Demo review", category: "Work" },
      { time: "04:00 PM", title: "Refactor database models", category: "Study" }
    ]
  };

  const activeAgenda = defaultAgendas[selectedDay] || [
    { time: "10:00 AM", title: "Focus Block Scheduled", category: "Study" },
    { time: "02:00 PM", title: "Personal task sprint", category: "Personal" }
  ];

  const handleApplyAiSchedule = () => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title: "AVA Scheduled Study Session",
      deadline: "2026-06-30",
      deadlineTime: "18:00",
      estimatedHours: 2,
      priority: 'High',
      category: 'Study',
      riskScore: 25,
      subtasks: [
        { id: '1', title: 'Focus on High Priority Assignments', completed: false, estimatedMinutes: 60 },
        { id: '2', title: 'Milestone Refinement', completed: false, estimatedMinutes: 60 }
      ],
      status: 'Not Started',
      aiPlanGenerated: true,
      focusTimeSpent: 0,
      focusSessionsCount: 0
    };
    onAddTask(newTask);
    setShowAiSuggestion(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
            📅 Calendar Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Combine tasks, meetings, and habit commitments in one integrated grid.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800/30 p-2 rounded-xl border border-slate-200 dark:border-slate-800/50">
          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-bold text-sm tracking-tight font-display">{currentMonth}</span>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* TWO COLUMN CALENDAR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* MONTH VIEW GRID (SPAN 2) */}
        <div className="md:col-span-2 glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2.5 text-center">
            {/* June 2026 starts on Monday (1 empty spacer for Sunday) */}
            <div className="aspect-square p-2" />

            {daysInMonth.map((day) => {
              const isSelected = selectedDay === day;
              // Mock active day indicator (days 28, 29, 30 have tasks)
              const hasActivity = [28, 29, 30].includes(day);
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-2 relative border transition cursor-pointer ${
                    isSelected 
                      ? 'bg-[#5B5CEB] border-transparent text-white shadow-md' 
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/60 hover:border-[#5B5CEB]/30 text-slate-900 dark:text-slate-300 shadow-sm'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">{day}</span>
                  
                  {/* Small Dots under dates */}
                  {hasActivity && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#5B5CEB]'} shrink-0`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AGENDA VIEW COLUMN */}
        <div className="space-y-6">
          
          {/* AI AGENT OVERLAY SUGGESTION */}
          <AnimatePresence>
            {showAiSuggestion && selectedDay === 29 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-[24px] bg-gradient-to-b from-[#5B5CEB]/15 to-[#5B5CEB]/5 border border-[#5B5CEB]/25 space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 text-[#5B5CEB] dark:text-indigo-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wide">AVA Smart Overlay</span>
                </div>

                <div className="space-y-1.5 text-left">
                  <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">
                    Free Scheduling Slot Found!
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
                    I detected an open gap between <strong className="text-[#5B5CEB] dark:text-indigo-400">4:00 PM and 6:00 PM</strong>. Would you like me to reserve it for your Study Assignment?
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleApplyAiSchedule}
                    className="flex-1 bg-[#5B5CEB] hover:opacity-95 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Yes, Schedule</span>
                  </button>
                  <button
                    onClick={() => setShowAiSuggestion(false)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:text-slate-700 dark:hover:text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Ignore
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CHRONOLOGICAL TIMELINE */}
          <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
                AGENDA: JUNE {selectedDay}
              </h3>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-4 relative before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800/60">
              {activeAgenda.map((item, idx) => (
                <div key={idx} className="relative pl-6 flex gap-3 text-xs items-start group">
                  {/* Timeline Dot */}
                  <span className={`absolute left-[7px] top-[5px] w-2.5 h-2.5 rounded-full border-2 ${
                    item.category === 'Study' 
                      ? 'bg-[#5B5CEB] border-white dark:border-[#0F172A]' 
                      : item.category === 'Work'
                        ? 'bg-orange-400 border-white dark:border-[#0F172A]'
                        : 'bg-emerald-400 border-white dark:border-[#0F172A]'
                  }`} />

                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] text-slate-400 font-bold font-mono">{item.time}</span>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-[#5B5CEB] transition">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
