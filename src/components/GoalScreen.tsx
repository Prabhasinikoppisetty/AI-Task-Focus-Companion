import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, Circle, Sparkles, Plus } from 'lucide-react';
import { Goal } from '../types';

export default function GoalScreen() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: "Graduate with Distinction",
      progress: 76,
      subgoals: [
        { id: '1-1', title: "Complete Machine Learning Term Assignments", completed: true },
        { id: '1-2', title: "Maintain 95% Class Attendance logs", completed: true },
        { id: '1-3', title: "Draft and upload final capstone thesis package", completed: false }
      ]
    }
  ]);

  const handleToggleSubgoal = (goalId: string, subgoalId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const updatedSubgoals = g.subgoals.map(sg => {
          if (sg.id === subgoalId) return { ...sg, completed: !sg.completed };
          return sg;
        });
        
        // Recalculate main progress
        const completedCount = updatedSubgoals.filter(s => s.completed).length;
        const newProgress = Math.round((completedCount / updatedSubgoals.length) * 100);

        return {
          ...g,
          progress: newProgress,
          subgoals: updatedSubgoals
        };
      }
      return g;
    }));
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER ROW */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
          🎯 Core Goals & Milestones
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track macro career or educational goals while AVA schedules micro task sprint sequences to align them daily.
        </p>
      </div>

      <div className="space-y-6">
        {goals.map((g) => (
          <div 
            key={g.id}
            className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6 text-left"
          >
            {/* Title & Progress Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#5B5CEB]/10 text-[#5B5CEB]">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight font-display text-slate-900 dark:text-white">
                    {g.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Academic Milestone Target</span>
                </div>
              </div>

              {/* Progress counter */}
              <div className="text-right sm:text-right">
                <span className="block text-2xl font-black font-mono leading-none tracking-tight text-[#5B5CEB]">{g.progress}%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">Completed Target</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#5B5CEB] to-[#6EE7B7] rounded-full transition-all duration-500" style={{ width: `${g.progress}%` }} />
            </div>

            {/* Subgoals checklists */}
            <div className="space-y-3 pt-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Subgoal checklist requirements</span>

              <div className="space-y-2.5">
                {g.subgoals.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => handleToggleSubgoal(g.id, sub.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                      sub.completed
                        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/40 opacity-75 line-through'
                        : 'bg-white/40 dark:bg-slate-800/20 border-slate-200/60 dark:border-slate-800/60'
                    }`}
                  >
                    {sub.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{sub.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
