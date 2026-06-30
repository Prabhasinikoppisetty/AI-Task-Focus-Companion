import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Clock, Calendar, CheckCircle, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { Task } from '../types';

interface DeadlineRiskProps {
  tasks: Task[];
  onOptimizeSchedule: () => void;
}

export default function DeadlineRisk({ tasks, onOptimizeSchedule }: DeadlineRiskProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const activeTasks = tasks.filter(t => t.status !== 'Completed');
  const currentTaskId = selectedTaskId || (activeTasks[0]?.id || '');
  const activeTask = activeTasks.find(t => t.id === currentTaskId);

  // Default fallback scores if no tasks exist
  const riskValue = activeTask ? activeTask.riskScore : 82;
  const riskTitle = activeTask ? activeTask.title : "No active missions";
  
  // Angle for the needle: 0% risk is -90deg, 100% risk is +90deg (180 deg total sweep)
  const needleAngle = -90 + (riskValue / 100) * 180;

  const getRiskColor = (risk: number) => {
    if (risk > 75) return 'text-[#FF5D73]';
    if (risk > 45) return 'text-[#FFC857]';
    return 'text-[#22C55E]';
  };

  const getRiskLabel = (risk: number) => {
    if (risk > 75) return 'CRITICAL RISK';
    if (risk > 45) return 'MODERATE RISK';
    return 'SAFE COMPLETION';
  };

  const handleOptimizeClick = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      onOptimizeSchedule();
    }, 1800);
  };

  // Mock reasons for the delays
  const defaultReasons = [
    { text: `Requires ${activeTask?.estimatedHours || 5} hours of continuous concentration.`, bad: true },
    { text: "Your calendar shows only 1.5 free block hours before tomorrow's deadline.", bad: true },
    { text: "Historical logging indicates 2 prior task reschedules in this category.", bad: true }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER ROW */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
          📊 Deadline Risk Analyzer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          AVA evaluates task effort estimates, remaining hours, and your historical sprint velocities to predict deadline delays.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* LEFT COLUMN: ACTIVE TASK SELECTOR (SPAN 2) */}
        <div className="md:col-span-2 glass-card rounded-[28px] p-5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col h-[400px]">
          <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono mb-4">
            Select Active Mission
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {activeTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 text-slate-400">
                <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                <span className="text-xs font-mono font-bold">All Goals Completed!</span>
              </div>
            ) : (
              activeTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full p-4 rounded-2xl text-left border transition flex items-center justify-between gap-4 cursor-pointer ${
                    task.id === currentTaskId
                      ? 'bg-slate-100 dark:bg-slate-800 border-[#5B5CEB]/40'
                      : 'bg-white/5 border-slate-100 dark:border-slate-800/40 hover:border-[#5B5CEB]/15'
                  }`}
                >
                  <div className="truncate flex-1">
                    <h4 className="font-bold text-xs truncate text-slate-900 dark:text-white">{task.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Due {task.deadline}</span>
                  </div>
                  
                  <span className={`text-xs font-mono font-black ${getRiskColor(task.riskScore)}`}>
                    {task.riskScore}%
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GAUGE METER & CAUSES PANEL (SPAN 3) */}
        <div className="md:col-span-3 space-y-6">
          <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center">
            
            {/* Animated SVG Gauge */}
            <div className="relative w-64 h-36 flex flex-col items-center justify-end overflow-hidden mb-6 mt-4">
              <svg className="w-64 h-64 absolute -bottom-32" viewBox="0 0 200 200">
                {/* Outer Gauge Arc */}
                <path
                  d="M 20,100 A 80,80 0 0,1 180,100"
                  fill="none"
                  strokeWidth="14"
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeLinecap="round"
                />
                {/* Risk Arc sectors */}
                {/* Safe Sector: 0 to 45 (green) */}
                <path
                  d="M 20,100 A 80,80 0 0,1 100,20"
                  fill="none"
                  strokeWidth="14"
                  stroke="url(#riskGradient)"
                  strokeLinecap="round"
                />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="50%" stopColor="#FFC857" />
                    <stop offset="100%" stopColor="#FF5D73" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Indicator Needle */}
              <motion.div
                className="absolute origin-bottom w-1 h-28 bottom-0 bg-slate-800 dark:bg-white flex flex-col items-center"
                style={{
                  transformOrigin: '50% 100%',
                }}
                animate={{ rotate: needleAngle }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              >
                {/* Needle Cap */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-800 dark:bg-white border-2 border-indigo-400 absolute bottom-0 -mb-1.5" />
              </motion.div>

              {/* Float center risk percentage */}
              <div className="relative z-10 text-center pb-2">
                <span className="block text-4xl font-black font-mono leading-none tracking-tight">{riskValue}%</span>
                <span className={`text-[10px] font-black tracking-wider uppercase font-mono ${getRiskColor(riskValue)}`}>
                  {getRiskLabel(riskValue)}
                </span>
              </div>
            </div>

            {/* Title Context */}
            <div className="text-center space-y-1 border-t border-slate-100 dark:border-slate-800/50 pt-4 w-full">
              <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white font-display">
                "{riskTitle}"
              </h3>
            </div>
          </div>

          {/* CAUSES AND WORK PLAN */}
          {activeTask && (
            <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4 text-left">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
                Risk Attribution Causes
              </h3>

              <div className="space-y-2.5">
                {defaultReasons.map((reason, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/30 flex items-start gap-3 text-xs">
                    <ShieldAlert className="w-4 h-4 text-[#FF5D73] shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300 font-mono leading-relaxed">{reason.text}</span>
                  </div>
                ))}
              </div>

              {/* ACTION CALLOUT */}
              <div className="pt-4 flex gap-3">
                <button
                  onClick={handleOptimizeClick}
                  disabled={isOptimizing}
                  className="flex-1 bg-[#5B5CEB] hover:opacity-95 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-500/20"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing schedule tracks...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Optimize Calendar Schedule</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
