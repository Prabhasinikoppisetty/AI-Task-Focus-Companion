import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, CheckCircle, Plus, Sparkles, TrendingUp, RefreshCw, Calendar } from 'lucide-react';
import { Habit } from '../types';

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: "Daily Coding Sprint", streak: 12, progress: 85, icon: "💻", history: { '2026-06-29': true } },
    { id: '2', title: "Meditation / De-stressing", streak: 8, progress: 60, icon: "🧘", history: { '2026-06-29': true } },
    { id: '3', title: "Daily Physical Cardio", streak: 15, progress: 100, icon: "🏃", history: { '2026-06-29': false } }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('🔥');

  const handleToggleHabitToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const completedToday = !!habit.history[today];
        const newHistory = { ...habit.history, [today]: !completedToday };
        const newStreak = completedToday ? Math.max(0, habit.streak - 1) : habit.streak + 1;
        const newProgress = Math.min(100, Math.max(0, completedToday ? habit.progress - 15 : habit.progress + 15));
        
        return {
          ...habit,
          history: newHistory,
          streak: newStreak,
          progress: newProgress
        };
      }
      return habit;
    }));
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newHabit: Habit = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTitle.trim(),
      streak: 0,
      progress: 0,
      icon: newIcon,
      history: {}
    };
    setHabits(prev => [...prev, newHabit]);
    setNewTitle('');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER ROW */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
          🔥 Habit & Streak Architect
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reinforce healthy study loops and mental decompression breaks before you reach critical deadline crunches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE HABITS (SPAN 2) */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
              Active Routines
            </h3>
            <span className="text-[10px] text-indigo-500 font-mono font-bold">
              DAILY VELOCITY LOGS
            </span>
          </div>

          <div className="space-y-4">
            {habits.map((habit) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const completedToday = !!habit.history[todayStr];
              
              return (
                <div 
                  key={habit.id}
                  className="glass-card rounded-[24px] p-5 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between gap-6 transition hover:shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Emoji representation */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-2xl shrink-0">
                      {habit.icon}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {habit.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span className="font-extrabold text-slate-900 dark:text-white">{habit.streak} Day Streak</span>
                      </div>
                    </div>
                  </div>

                  {/* Circular completion tracker */}
                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      onClick={() => handleToggleHabitToday(habit.id)}
                      className={`p-3 rounded-xl border flex items-center gap-1.5 transition text-xs font-bold font-mono cursor-pointer ${
                        completedToday
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{completedToday ? 'DONE' : 'LOG'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK CREATION BLOCK (SPAN 1) */}
        <div className="space-y-6">
          <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#5B5CEB] animate-pulse" />
              <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
                Launch Custom Habit
              </h3>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase font-mono mb-1.5">HABIT NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Read Documentation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase font-mono mb-1.5 font-sans">EMOJI REPRESENTATION</label>
                <div className="flex gap-2">
                  {["💻", "🧘", "🏃", "📚", "💧"].map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setNewIcon(e)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm transition cursor-pointer ${
                        newIcon === e 
                          ? 'bg-[#5B5CEB]/25 border-[#5B5CEB] text-white' 
                          : 'bg-white/5 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Architect Habit</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
