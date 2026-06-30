import React from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Calendar, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Play, 
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Task, SubTask } from '../types';

interface TaskDetailsProps {
  task: Task;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onStartFocus: (task: Task) => void;
  onActivateRescue: (task: Task) => void;
  onBack: () => void;
}

export default function TaskDetails({ 
  task, 
  onToggleSubtask, 
  onStartFocus, 
  onActivateRescue,
  onBack 
}: TaskDetailsProps) {
  
  // Calculate subtask completion percentage
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Circle progress calculation
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER ROW */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <button
          onClick={onBack}
          className="text-xs font-bold font-mono text-slate-600 hover:text-[#5B5CEB] dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>Back to Missions</span>
        </button>
        
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wide ${
          task.status === 'Completed' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
            : 'bg-indigo-100 text-[#5B5CEB] dark:bg-indigo-950/20 dark:text-indigo-400'
        }`}>
          {task.status.toUpperCase()}
        </span>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COMPACT INFO PANEL & PROGRESS (SPAN 1) */}
        <div className="space-y-6 flex flex-col items-center text-center">
          
          {/* PROGRESS RING */}
          <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 w-full flex flex-col items-center">
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-4">Milestone Progress</span>
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Track circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  strokeWidth={strokeWidth}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="72"
                  cy="72"
                  r={radius}
                  strokeWidth={strokeWidth}
                  stroke="#5B5CEB"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-2xl font-black font-mono text-slate-900 dark:text-white">
                {progressPercent}%
              </span>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-4">
              {completedSubtasks} of {totalSubtasks} Milestones Done
            </span>
          </div>

          {/* DEADLINE RISK GAUGE */}
          <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 w-full text-left space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF5D73]" />
              <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">Deadline Risk Analyzer</h3>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Failure Likelihood</span>
                <span className="text-lg font-black text-[#FF5D73] font-mono leading-none">{task.riskScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-[#FF5D73]" 
                  style={{ width: `${task.riskScore}%` }} 
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal bg-red-500/5 p-2.5 rounded-xl border border-red-500/10 font-mono">
              {task.riskScore > 75 
                ? "🔴 HIGH RISK: Deadline is fast-approaching with incomplete milestones. Action needed."
                : "✅ NORMAL: Current sprint velocity is sufficient to complete milestones ahead of deadline."
              }
            </p>
          </div>
        </div>

        {/* RIGHT SUBTASKS & ACTIONS PANEL (SPAN 2) */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50">
            <div className="space-y-1.5 mb-6">
              <span className="text-xs text-[#5B5CEB] dark:text-indigo-400 font-bold font-mono">ACTIVE TASK VIEW</span>
              <h1 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white leading-tight">
                {task.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400 dark:text-slate-500 font-mono pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Due {task.deadline}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Needs {task.estimatedHours} Hours
                </span>
              </div>
            </div>

            {/* MILESTONE CHECKBOXES */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono mb-2">Milestones & Subtasks</h3>
              
              {task.subtasks.map((st) => (
                <div 
                  key={st.id} 
                  onClick={() => onToggleSubtask(task.id, st.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition cursor-pointer ${
                    st.completed 
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/40 opacity-70 line-through'
                      : 'bg-white/40 dark:bg-slate-800/20 border-slate-200/60 dark:border-slate-800/60 hover:border-[#5B5CEB]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {st.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <span className="font-semibold text-sm">{st.title}</span>
                  </div>
                  {st.estimatedMinutes && (
                    <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md shrink-0">
                      {st.estimatedMinutes}m
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* AI PLAN STEPS / SUGGESTIONS */}
            {task.aiPlanSteps && task.aiPlanSteps.length > 0 && (
              <div className="mt-8 p-4 rounded-2xl bg-[#5B5CEB]/5 border border-[#5B5CEB]/10 space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5B5CEB] animate-pulse" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white font-display">AVA's Strategic Advice</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
                  {task.aiPlanSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onStartFocus(task)}
                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus Session</span>
              </button>
              
              <button
                onClick={() => onActivateRescue(task)}
                className="flex-1 bg-[#FF5D73] hover:bg-rose-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_4px_15px_rgba(255,93,115,0.3)] animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Launch Emergency Rescue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
