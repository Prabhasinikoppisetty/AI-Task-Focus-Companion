import React from 'react';
import { BarChart3, Activity, PieChart, TrendingUp, Calendar, Heart } from 'lucide-react';

export default function AnalyticsView() {
  const weeklyProductivity = [
    { day: "Mon", tasks: 4 },
    { day: "Tue", tasks: 6 },
    { day: "Wed", tasks: 8 },
    { day: "Thu", tasks: 5 },
    { day: "Fri", tasks: 9 },
    { day: "Sat", tasks: 3 },
    { day: "Sun", tasks: 7 }
  ];

  const maxTasks = Math.max(...weeklyProductivity.map(d => d.tasks));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER ROW */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
          📊 Productivity Analytics Dashboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Gain long-term insight into focus velocity, task completion consistency, and deadline risk prevention metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* METRIC CARD 1 */}
        <div className="glass-card rounded-[24px] p-5 border border-slate-200/50 dark:border-slate-800/50 space-y-2">
          <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">Tasks Completed</span>
          <span className="block text-3xl font-black font-mono">42</span>
          <span className="text-[10px] text-emerald-500 font-bold font-mono">+12% from last week</span>
        </div>

        {/* METRIC CARD 2 */}
        <div className="glass-card rounded-[24px] p-5 border border-slate-200/50 dark:border-slate-800/50 space-y-2">
          <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">Missed Deadlines</span>
          <span className="block text-3xl font-black font-mono text-[#FF5D73]">3</span>
          <span className="text-[10px] text-emerald-500 font-bold font-mono">-50% decrease (Rescue Active)</span>
        </div>

        {/* METRIC CARD 3 */}
        <div className="glass-card rounded-[24px] p-5 border border-slate-200/50 dark:border-slate-800/50 space-y-2">
          <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">Average Focus Session</span>
          <span className="block text-3xl font-black font-mono">46 mins</span>
          <span className="text-[10px] text-[#5B5CEB] font-bold font-mono">Best time: 8:00 PM</span>
        </div>
      </div>

      {/* DETAILED SVG GRAPH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* WEEKLY PRODUCTIVITY CHART (SPAN 2) */}
        <div className="md:col-span-2 glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
              Weekly Task Output
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">June 22 - June 29, 2026</span>
          </div>

          {/* Simple Custom SVG or HTML Bar Chart */}
          <div className="flex items-end justify-between h-48 pt-4">
            {weeklyProductivity.map((d, idx) => {
              const heightPct = (d.tasks / maxTasks) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                  {/* Tooltip bar */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md leading-none absolute -translate-y-6">
                    {d.tasks} Done
                  </span>
                  
                  {/* Bar fill */}
                  <div className="w-8 sm:w-10 bg-slate-100 dark:bg-slate-800/60 rounded-t-xl h-full flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-[#5B5CEB] to-indigo-400 rounded-t-xl transition-all duration-500 group-hover:to-[#6EE7B7]" 
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* HEATMAP / DAILY COMMITS BLOCK */}
        <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono">
              Commit Grid History
            </h3>
            <span className="text-[10px] text-[#6EE7B7] font-mono font-bold">8 DAY STREAK</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {/* 35 small cells for activity logs */}
            {Array.from({ length: 35 }).map((_, idx) => {
              // Highlight selected streak index
              const activityLevel = idx > 26 ? 'bg-indigo-600' : idx > 15 ? 'bg-indigo-400/40' : idx > 8 ? 'bg-indigo-300/10' : 'bg-slate-100 dark:bg-slate-800/50';
              return (
                <div 
                  key={idx} 
                  className={`aspect-square rounded-md ${activityLevel} transition-transform hover:scale-110 cursor-pointer`}
                  title={`Activity Log Vector: Cell ${idx}`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-2">
            <span>Low Concentration</span>
            <span>Hyper-focused</span>
          </div>
        </div>
      </div>
    </div>
  );
}
