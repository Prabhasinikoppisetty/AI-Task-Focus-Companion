import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Clock, AlertCircle, Plus, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Task, SubTask } from '../types';

interface AddTaskProps {
  onAddTask: (task: Task) => void;
  onClose: () => void;
}

export default function AddTask({ onAddTask, onClose }: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [category, setCategory] = useState<'Work' | 'Study' | 'Personal' | 'Life'>('Study');
  const [aiEstimateEnabled, setAiEstimateEnabled] = useState(true);

  // AI Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [planResult, setPlanResult] = useState<{
    subtasks: { title: string; estimatedMinutes: number }[];
    riskScore: number;
    reasons: string[];
    aiPlanSteps: string[];
  } | null>(null);

  const handleGenerateAIPlan = async () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-task-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          deadline,
          estimatedHours,
          priority,
          category
        })
      });
      const data = await response.json();
      setPlanResult(data);
    } catch (err) {
      console.error(err);
      // Hardcoded fallback plan if offline or missing endpoint
      setPlanResult({
        riskScore: 78,
        reasons: ["Close deadline", "High workload compared to free slots"],
        subtasks: [
          { title: "Define structure and outline", estimatedMinutes: 30 },
          { title: "Drafting the main implementation sections", estimatedMinutes: 90 },
          { title: "Proofing, testing and formatting", estimatedMinutes: 45 },
          { title: "Final checklist check & submission", estimatedMinutes: 15 }
        ],
        aiPlanSteps: [
          "Start with clear reference materials to avoid distraction",
          "Focus in chunks of 45 mins using Pomodoro",
          "Submit 1 hour early to account for platform congestion"
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Use AI subtasks if generated, otherwise create a single default subtask
    const finalSubtasks: SubTask[] = planResult 
      ? planResult.subtasks.map((st, idx) => ({
          id: String(idx + 1),
          title: st.title,
          completed: false,
          estimatedMinutes: st.estimatedMinutes
        }))
      : [
          { id: '1', title: 'Preparation & Research', completed: false, estimatedMinutes: 30 },
          { id: '2', title: 'Main Execution Block', completed: false, estimatedMinutes: Math.round(estimatedHours * 60) - 30 }
        ];

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      deadline,
      deadlineTime,
      estimatedHours,
      priority,
      category,
      riskScore: planResult ? planResult.riskScore : (priority === 'High' ? 75 : 30),
      subtasks: finalSubtasks,
      status: 'Not Started',
      aiPlanGenerated: !!planResult,
      aiPlanSteps: planResult ? planResult.aiPlanSteps : [],
      focusTimeSpent: 0,
      focusSessionsCount: 0
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
          Add New Mission
        </h2>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-semibold font-mono"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card rounded-[24px] p-6 space-y-4 border border-slate-200/50 dark:border-slate-800/50">
          
          {/* TASK TITLE */}
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-2">TASK NAME</label>
            <input
              type="text"
              placeholder="e.g. Machine Learning Assignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-slate-200 dark:border-slate-800 focus:border-[#5B5CEB] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DEADLINE */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-2">DEADLINE DATE</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-white/5 border border-slate-200 dark:border-slate-800 focus:border-[#5B5CEB] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition"
                  required
                />
              </div>
            </div>

            {/* ESTIMATED TIME */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-2">ESTIMATED EFFORT</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 1)}
                  className="w-full bg-white/5 border border-slate-200 dark:border-slate-800 focus:border-[#5B5CEB] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition"
                  required
                />
                <span className="absolute right-4 top-3.5 text-xs text-slate-400 font-mono font-bold">HOURS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PRIORITY */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-2">PRIORITY</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition border cursor-pointer ${
                      priority === p 
                        ? p === 'High'
                          ? 'bg-rose-500 text-white border-transparent shadow-md'
                          : p === 'Medium'
                            ? 'bg-[#5B5CEB] text-white border-transparent shadow-md'
                            : 'bg-emerald-500 text-white border-transparent shadow-md'
                        : 'bg-white/5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider mb-2">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-[#5B5CEB] rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition cursor-pointer"
              >
                <option value="Study">🎓 Study</option>
                <option value="Work">💼 Work</option>
                <option value="Personal">🔑 Personal</option>
                <option value="Life">🍎 Life / Habits</option>
              </select>
            </div>
          </div>

          {/* AI TOGGLE CONTROLS */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5B5CEB]" />
              <span className="text-xs font-bold font-mono">GENERATE AI SUBTASK BREAKDOWN</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiEstimateEnabled}
                onChange={(e) => setAiEstimateEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5B5CEB]"></div>
            </label>
          </div>
        </div>

        {/* AI PREVIEW BLOCK */}
        {aiEstimateEnabled && title.trim() && (
          <div className="glass-card rounded-[24px] p-6 border border-slate-200/50 dark:border-[#5B5CEB]/20 relative overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5B5CEB] animate-pulse" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">AVA AI Breakdown Planner</h4>
              </div>

              {!planResult && !isGenerating && (
                <button
                  type="button"
                  onClick={handleGenerateAIPlan}
                  className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <span>Build AI Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isGenerating && (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#5B5CEB]" />
                <p className="text-xs text-slate-400 font-mono">AVA is drafting custom sprint schedules...</p>
              </div>
            )}

            {planResult && !isGenerating && (
              <div className="space-y-4 text-left">
                {/* Risk Gauge preview */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/50 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono leading-none">RISK ASSESSMENT</span>
                    <span className={`text-sm font-extrabold font-mono mt-1 block ${
                      planResult.riskScore > 70 ? 'text-[#FF5D73]' : planResult.riskScore > 40 ? 'text-[#FFC857]' : 'text-[#22C55E]'
                    }`}>
                      {planResult.riskScore > 70 ? '🚨 HIGH RISK' : planResult.riskScore > 40 ? '⚠️ MODERATE RISK' : '✅ LOW RISK'} ({planResult.riskScore}%)
                    </span>
                  </div>
                  <div className="max-w-[70%] text-slate-500 dark:text-slate-400 text-[11px] leading-tight text-right">
                    {planResult.reasons[0] || "Analyzed against real time slots."}
                  </div>
                </div>

                {/* Subtask preview list */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">GENERATED MILESTONES</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {planResult.subtasks.map((st, idx) => (
                      <div key={idx} className="p-3 bg-white/40 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-medium truncate pr-2 text-slate-800 dark:text-slate-200">{st.title}</span>
                        <span className="shrink-0 bg-indigo-50 dark:bg-indigo-950/20 text-[#5B5CEB] dark:text-indigo-400 font-bold px-2 py-0.5 rounded-md font-mono">{st.estimatedMinutes}m</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategic sequence */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">AVA EXECUTION STRATEGY</span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    {planResult.aiPlanSteps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] hover:opacity-95 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition shadow-[0_4px_25px_rgba(91,92,235,0.3)] cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Commit Mission to Companion</span>
        </button>
      </form>
    </div>
  );
}
