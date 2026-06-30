import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Clock, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Flame, Play, X, Loader2 } from 'lucide-react';
import { Task } from '../types';

interface LastMinuteRescueProps {
  tasks: Task[];
  onStartFocus: (task: Task) => void;
}

export default function LastMinuteRescue({ tasks, onStartFocus }: LastMinuteRescueProps) {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [countdown, setCountdown] = useState(4 * 3600); // 4 hours countdown default
  const [chanceOfMissing, setChanceOfMissing] = useState(95);
  const [isGenerating, setIsGenerating] = useState(false);
  const [survivalBoost, setSurvivalBoost] = useState(0);

  // Dynamic hourly steps
  const [rescueSteps, setRescueSteps] = useState<{
    timeRange: string;
    action: string;
    completed: boolean;
  }[]>([]);

  const activeTasks = tasks.filter(t => t.status !== 'Completed');
  const currentTaskId = selectedTaskId || (activeTasks[0]?.id || '');
  const activeTask = activeTasks.find(t => t.id === currentTaskId);

  // Load rescue steps or generate mock
  useEffect(() => {
    if (activeTask) {
      handleFetchRescuePlan();
    } else {
      // Default fallback steps if no tasks exist
      setRescueSteps([
        { timeRange: "0-30m", action: "Fast Outline & Core Scope Trimming (Cut unneeded details)", completed: false },
        { timeRange: "30-120m", action: "Intense Deep-Work Draft/Coding (No distractions, phone off)", completed: false },
        { timeRange: "120-180m", action: "Core Implementation Refinement & Verification", completed: false },
        { timeRange: "180-220m", action: "Documentation, Formatting, & Polishing", completed: false },
        { timeRange: "220-240m", action: "Emergency Final Submission & Proof Upload", completed: false }
      ]);
    }
  }, [currentTaskId]);

  // Countdown timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 4 * 3600));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFetchRescuePlan = async () => {
    if (!activeTask) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-rescue-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeTask.title,
          estimatedHours: activeTask.estimatedHours,
          hoursLeft: 4
        })
      });
      const data = await response.json();
      setChanceOfMissing(data.chanceOfMissing);
      setRescueSteps(data.emergencyPlan.map((step: any) => ({
        ...step,
        completed: false
      })));
    } catch (err) {
      console.error(err);
      // Fallback
      setChanceOfMissing(95);
      setRescueSteps([
        { timeRange: "0-30m", action: "Identify absolute minimum core scope to secure pass marks", completed: false },
        { timeRange: "30-120m", action: "Assemble rapid boilerplate architecture / draft structure", completed: false },
        { timeRange: "120-180m", action: "Write critical functionality (Ignore fancy CSS / extra sections)", completed: false },
        { timeRange: "180-220m", action: "Run validation loops and compile clean submission package", completed: false },
        { timeRange: "220-240m", action: "Submit into grading systems. Fast upload.", completed: false }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleStep = (index: number) => {
    const updated = [...rescueSteps];
    updated[index].completed = !updated[index].completed;
    setRescueSteps(updated);

    // Calculate survival boost (+5% likelihood increase for each completed milestone)
    const completedCount = updated.filter(s => s.completed).length;
    setSurvivalBoost(completedCount * 12);
  };

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const survivalRate = Math.min(100, Math.max(0, (100 - chanceOfMissing) + survivalBoost));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* FLASHING HAZARD EMERGENCY BANNER */}
      <div className="relative overflow-hidden rounded-[24px] bg-red-600 border border-transparent p-5 md:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-500/10">
        
        {/* Rapid Orange/Red flashing lights */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-[#FF5D73] opacity-80 animate-pulse-slow z-0" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-2xl animate-bounce shrink-0 mt-1">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-[10px] font-black tracking-widest uppercase font-mono text-amber-200">
              🚨 LAUNCH LAST MINUTE RESCUE
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight font-display text-white mt-1">
              Crisis Management Protocol
            </h2>
            <p className="text-xs text-white/80 max-w-md leading-relaxed mt-1 font-mono">
              Procrastination levels have breached normal thresholds. AVA has activated an hourly lock-in execution schedule.
            </p>
          </div>
        </div>

        {/* Real-time emergency clock countdown */}
        <div className="relative z-10 bg-slate-950/40 border border-white/10 px-5 py-3 rounded-2xl text-center shrink-0 min-w-[140px]">
          <span className="block text-[9px] font-bold text-[#6EE7B7] uppercase font-mono tracking-wider mb-1">REMAINING TIME</span>
          <span className="text-2xl font-black font-mono tracking-wider leading-none text-white">{formatCountdown(countdown)}</span>
        </div>
      </div>

      {/* SPRINT COLUMN AND PROBABILITIES CHIPS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* RISK & DELAY STATUS STATS PANEL (SPAN 2) */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center">
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-4">SURVIVAL CHANCE GAIN</span>
            
            {/* Survival Circular gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="54" strokeWidth="8" stroke="currentColor" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="54" 
                  strokeWidth="8" 
                  stroke={survivalRate > 70 ? "#22C55E" : survivalRate > 40 ? "#FFC857" : "#FF5D73"} 
                  strokeDasharray={`${2 * Math.PI * 54}`} 
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - survivalRate / 100)}`} 
                  strokeLinecap="round" 
                  fill="transparent" 
                />
              </svg>
              <div className="absolute text-center">
                <span className="block text-2xl font-black font-mono text-slate-900 dark:text-white">{survivalRate}%</span>
                <span className="text-[8px] text-slate-400 uppercase font-mono font-bold">LIFELINE RATE</span>
              </div>
            </div>

            {survivalBoost > 0 && (
              <span className="text-xs text-emerald-500 font-bold font-mono animate-pulse-slow">
                🔥 +{survivalBoost}% Survival chance from checked milestones
              </span>
            )}
          </div>

          {/* ACTIVE MISSION CARD SELECTOR */}
          <div className="glass-card rounded-[28px] p-5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col">
            <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-4">
              Select Active Crisis
            </span>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {activeTasks.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <span className="text-xs font-mono">No Active Deadlines</span>
                </div>
              ) : (
                activeTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`w-full p-3 rounded-xl text-left border transition text-xs flex items-center justify-between cursor-pointer ${
                      task.id === currentTaskId
                        ? 'bg-slate-100 dark:bg-slate-800 border-red-500/30 font-bold'
                        : 'bg-white/5 border-slate-100 dark:border-slate-800/40'
                    }`}
                  >
                    <span className="truncate flex-1 pr-2 text-slate-900 dark:text-white">{task.title}</span>
                    <span className="text-[10px] text-red-500 font-mono font-black shrink-0">{task.riskScore}% risk</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE HOUR PLANNER CHECKLIST (SPAN 3) */}
        <div className="md:col-span-3 space-y-6">
          <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 text-left">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5D73] animate-pulse" />
                <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
                  AVA Crisis Sprint Schedule
                </h3>
              </div>
              
              {isGenerating && (
                <Loader2 className="w-4 h-4 animate-spin text-[#FF5D73]" />
              )}
            </div>

            {isGenerating ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF5D73]" />
                <p className="text-xs text-slate-400 font-mono">AVA is customizing high-intensity timeline sprints...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rescueSteps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleStep(idx)}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition cursor-pointer ${
                      step.completed
                        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/40 dark:border-slate-800/40 opacity-60 line-through'
                        : 'bg-white/40 dark:bg-slate-800/20 border-slate-200/60 dark:border-slate-800/60 hover:border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Check icon */}
                      <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        step.completed ? 'bg-emerald-500 border-transparent text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {step.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] text-red-500 font-black font-mono uppercase tracking-wider mb-0.5">
                          PHASE: {step.timeRange}
                        </span>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                          {step.action}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Focus launch button */}
                {activeTask && (
                  <button
                    onClick={() => onStartFocus(activeTask)}
                    className="w-full mt-4 bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Emergency focus Sprint</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
