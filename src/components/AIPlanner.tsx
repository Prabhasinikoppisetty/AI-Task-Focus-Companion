import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Clock, Plus, Compass, ChevronRight } from 'lucide-react';
import { TimelinePlan } from '../types';

export default function AIPlanner() {
  const [timelineItems, setTimelineItems] = useState<TimelinePlan[]>([
    { id: '1', day: "Today", title: "Targeted Topic Research & Skeleton outline drafting", phase: "Research", estimatedHours: 2.5 },
    { id: '2', day: "Tomorrow", title: "Heads-down core component coding & business algorithm testing", phase: "Coding", estimatedHours: 4 },
    { id: '3', day: "Wednesday", title: "Refining parameters, polishing outputs, and compiling files", phase: "Testing", estimatedHours: 2 },
    { id: '4', day: "Thursday", title: "Final checklist check & formal portal upload", phase: "Submission", estimatedHours: 1 }
  ]);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER ROW */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
          🧭 AVA Auto Planner Timeline
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          AVA slices your long-term goals into multi-day milestones automatically to bypass panic-induced procrastination blocks.
        </p>
      </div>

      {/* HORIZONTAL DAYS TIMELINE */}
      <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5B5CEB] animate-pulse" />
            <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
              Gantt Sprint Timeline Plan
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono font-bold">4 STAGE FLOW</span>
        </div>

        {/* TIMELINE SEQUENCE STAGES */}
        <div className="space-y-4">
          {timelineItems.map((item, idx) => (
            <div 
              key={item.id}
              className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-[#5B5CEB]/25"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Day stamp badge */}
                <div className="w-24 px-3 py-1.5 rounded-xl bg-[#5B5CEB]/10 text-[#5B5CEB] text-center shrink-0">
                  <span className="block text-[10px] uppercase font-mono font-black">{item.day}</span>
                </div>

                <div className="flex-1 min-w-0 space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400">{item.phase}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Estimate hours bar */}
              <div className="flex items-center gap-3 justify-end shrink-0">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {item.estimatedHours} Hours
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
