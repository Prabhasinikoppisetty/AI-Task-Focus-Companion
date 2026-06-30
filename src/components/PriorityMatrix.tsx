import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, Loader2, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface PriorityMatrixProps {
  tasks: Task[];
  onStartFocus: (task: Task) => void;
}

export default function PriorityMatrix({ tasks, onStartFocus }: PriorityMatrixProps) {
  const [isSorting, setIsSorting] = useState(false);

  // Group tasks into Eisenhower quadrants
  const getQuadrantTasks = (quadrant: 'urgent_important' | 'important_not_urgent' | 'urgent_not_important' | 'not_urgent_not_important') => {
    return tasks.filter((t) => {
      if (t.status === 'Completed') return false;
      
      const isUrgent = t.riskScore > 60 || t.priority === 'High';
      const isImportant = t.category === 'Study' || t.category === 'Work' || t.priority === 'High' || t.priority === 'Medium';

      switch (quadrant) {
        case 'urgent_important':
          return isUrgent && isImportant;
        case 'important_not_urgent':
          return !isUrgent && isImportant;
        case 'urgent_not_important':
          return isUrgent && !isImportant;
        case 'not_urgent_not_important':
        default:
          return !isUrgent && !isImportant;
      }
    });
  };

  const handleAiSort = () => {
    setIsSorting(true);
    setTimeout(() => {
      setIsSorting(false);
    }, 1500);
  };

  const quadrants = [
    {
      id: 'urgent_important',
      title: 'Do First (Urgent & Important)',
      desc: 'Critical deadlines, high failure risk. Tackle these immediately.',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      bgColor: 'bg-rose-50/80 border-rose-200 dark:bg-rose-950/10 dark:border-rose-500/20'
    },
    {
      id: 'important_not_urgent',
      title: 'Schedule (Important but Not Urgent)',
      desc: 'Important long-term goals, low current risk. Plan study slots.',
      icon: <ShieldCheck className="w-4 h-4 text-[#5B5CEB]" />,
      bgColor: 'bg-indigo-50/80 border-indigo-200 dark:bg-indigo-950/10 dark:border-[#5B5CEB]/20'
    },
    {
      id: 'urgent_not_important',
      title: 'Delegate / Speedrun (Urgent & Not Important)',
      desc: 'Minor administration with immediate timers. Speedrun now.',
      icon: <Zap className="w-4 h-4 text-orange-400" />,
      bgColor: 'bg-orange-50/80 border-orange-200 dark:bg-orange-950/10 dark:border-orange-500/20'
    },
    {
      id: 'not_urgent_not_important',
      title: 'Eliminate / Squeeze (Not Urgent & Not Important)',
      desc: 'Trivial admin or personal backlogs. Complete during low energy.',
      icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
      bgColor: 'bg-slate-100/80 border-slate-200 dark:bg-slate-800/10 dark:border-slate-500/20'
    }
  ] as const;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
            ⚡ Eisenhower Priority Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AVA organizes your tasks automatically based on category importance, deadlines, and remaining time.
          </p>
        </div>

        <button
          onClick={handleAiSort}
          disabled={isSorting}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2 transition cursor-pointer"
        >
          {isSorting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Task Vector...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>AVA Auto-Align Matrix</span>
            </>
          )}
        </button>
      </div>

      {/* 2X2 GRID CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map((q) => {
          const quadTasks = getQuadrantTasks(q.id);
          return (
            <div 
              key={q.id} 
              className={`rounded-[28px] border p-6 flex flex-col h-72 ${q.bgColor} transition-shadow hover:shadow-md relative overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-start gap-3 border-b border-slate-200/30 dark:border-slate-800/30 pb-3 mb-4 shrink-0">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  {q.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">
                    {q.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                    {q.desc}
                  </p>
                </div>
              </div>

              {/* Task Items List Scroller */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {isSorting ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : quadTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-4">
                    <span className="text-xl">🌟</span>
                    <span className="text-[11px] font-mono text-slate-400 mt-1">Grid Clean & Calibrated</span>
                  </div>
                ) : (
                  quadTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-3 bg-white/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-xl flex items-center justify-between text-xs gap-3 group hover:border-[#5B5CEB]/30 transition"
                    >
                      <div className="truncate flex-1">
                        <h4 className="font-bold truncate text-slate-900 dark:text-white">{task.title}</h4>
                        <span className="text-[9px] text-slate-400 font-mono">Risk score: {task.riskScore}%</span>
                      </div>
                      
                      <button
                        onClick={() => onStartFocus(task)}
                        className="opacity-0 group-hover:opacity-100 shrink-0 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-[10px] py-1.5 px-3 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Focus</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
