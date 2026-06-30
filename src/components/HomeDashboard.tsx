import React from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  ArrowRight, 
  Clock, 
  AlertTriangle,
  Play,
  Heart,
  UserCheck
} from 'lucide-react';
import { Task } from '../types';

interface HomeDashboardProps {
  userName: string;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onStartFocus: (task: Task) => void;
  onActivateRescue: (task: Task) => void;
  onOpenAva: () => void;
}

export default function HomeDashboard({ 
  userName, 
  tasks, 
  onToggleTask, 
  onStartFocus, 
  onActivateRescue,
  onOpenAva 
}: HomeDashboardProps) {
  
  // Calculate today's productivity score
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const scorePercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 89;

  // Find highest risk task
  const highRiskTask = [...tasks]
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => b.riskScore - a.riskScore)[0];

  const pendingTasks = tasks.filter(t => t.status !== 'Completed');

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left">
         <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            Good Morning, {userName} ☀️
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium">
            Let's tackle your priorities for today.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3 text-sm font-semibold">
            <span className="text-[#FFC857] text-lg">🔥</span>
            <span className="text-slate-800 dark:text-slate-200">8 Day Streak</span>
          </div>
          <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3 text-sm font-semibold">
            <span className="text-[#5B5CEB] dark:text-indigo-400 text-lg">🎯</span>
            <span className="text-slate-800 dark:text-slate-200">{scorePercent}% Focus Score</span>
          </div>
        </div>
      </header>

      {/* EMERGENCY RECOMMENDATION BAR */}
      {highRiskTask && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#FF5D73]/10 via-[#FF5D73]/5 to-transparent border border-[#FF5D73]/20 p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-0 w-2 h-full bg-[#FF5D73]" />

          <div className="space-y-1.5 flex-1 text-left">
            <div className="flex items-center gap-2 text-[#FF5D73] text-xs font-bold font-mono tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>CRITICAL RISK DETECTED ({highRiskTask.riskScore}% PROBABILITY OF DELAY)</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
              "{highRiskTask.title}" has a high-risk deadline tomorrow!
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-semibold">
              AVA calculated that you have only {highRiskTask.estimatedHours} hours left to complete this, but your calendar only shows 2.5 open hours today. Let's block out distractions.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onStartFocus(highRiskTask)}
              className="flex-1 md:flex-none bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Focus</span>
            </button>
            <button
              onClick={() => onActivateRescue(highRiskTask)}
              className="flex-1 md:flex-none bg-[#FF5D73] hover:bg-rose-600 text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_4px_12px_rgba(255,93,115,0.3)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rescue Plan</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: TODAY'S MISSION & TASKS (SPAN 2) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-[0_8px_25px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Today's Mission</h2>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-black">
                {pendingTasks.length} PENDING
              </span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <span className="text-4xl">🎉</span>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">No Tasks Left!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium">
                  Outstanding job! Your queue is clean. Ask AVA to schedule tomorrow or design custom habits.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pr-1">
                {pendingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-start gap-4 p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border-l-4 border-[#5B5CEB] text-left"
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-slate-300 hover:text-[#5B5CEB] transition cursor-pointer shrink-0"
                    >
                      <div className="w-4.5 h-4.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-950 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-mono font-semibold">
                        Due {task.deadline} • {task.priority} Priority • {task.estimatedHours}h est.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onStartFocus(task)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-[#5B5CEB]/10 hover:text-[#5B5CEB] transition cursor-pointer text-slate-500"
                        title="Focus Timer"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DYNAMIC TIPS BOARD */}
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-[20px] p-5 flex flex-col md:flex-row items-center gap-4 text-left w-full">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-xl shadow-sm shrink-0 animate-pulse">
              💡
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed font-mono">
                AVA: "You have delayed this twice. Skip the extra documentation and focus on core logic now."
              </p>
            </div>
            <button
              onClick={onOpenAva}
              className="text-orange-800 dark:text-orange-300 hover:underline text-xs font-bold font-mono flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Ask AVA</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: AI RECOMMENDATIONS & COMPANION PANEL (SPAN 1) */}
        <div className="space-y-6">
          {/* AI RECOMMENDATION CARD */}
          <div className="bg-[#5B5CEB] rounded-[20px] p-6 text-white relative overflow-hidden text-left flex flex-col justify-between h-[230px] shadow-lg">
            <div className="relative z-10">
              <h3 className="font-bold text-base mb-1">AI Recommendation</h3>
              <p className="text-sm text-indigo-100 mb-4 leading-relaxed">
                You're behind on your ML project. I've cleared your calendar from 2-4 PM today to protect your priority.
              </p>
            </div>
            <div className="relative z-10">
              <button
                onClick={onOpenAva}
                className="bg-white text-[#5B5CEB] hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Start Focus Session
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* DEADLINE RISK CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-[0_8px_25px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 flex flex-col text-left">
            <h2 className="font-display font-bold text-base mb-4 text-slate-900 dark:text-white">Deadline Risk</h2>
            
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden flex">
                <div className="h-full w-1/3" style={{ backgroundColor: '#6EE7B7' }} />
                <div className="h-full w-1/3" style={{ backgroundColor: '#FFC857' }} />
                <div className="h-full w-1/3 bg-[#FF5D73]" />
              </div>

              <div className="text-center mb-6">
                <div className="text-5xl font-black text-[#FF5D73] mb-1">
                  {highRiskTask ? `${highRiskTask.riskScore}%` : '92%'}
                </div>
                <div className="px-3 py-1 bg-[#FF5D73]/10 text-[#FF5D73] text-[10px] font-bold uppercase rounded-full inline-block">
                  {highRiskTask && highRiskTask.riskScore > 75 ? 'High Risk Level' : 'Moderate Risk'}
                </div>
              </div>

              <ul className="w-full space-y-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <li className="flex items-center gap-2">⚠️ Needs {highRiskTask?.estimatedHours || 5} hours work</li>
                <li className="flex items-center gap-2">⚠️ Only 3 hours free today</li>
                <li className="flex items-center gap-2">⚠️ Twice delayed reschedules</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
