import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Zap, 
  AlertTriangle, 
  Clock, 
  Flame, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Compass, 
  Target, 
  LogOut,
  HelpCircle,
  Activity,
  Menu,
  Plus
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
  onLogout: () => void;
  hasEmergency: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, userName, onLogout, hasEmergency }: SidebarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: null },
    { id: 'calendar', label: 'Calendar', icon: Calendar, badge: null },
    { id: 'ai', label: 'AI Assistant', icon: MessageSquare, badge: 'Ava' },
  ];

  const toolsNavItems = [
    { id: 'matrix', label: 'Priority Matrix', icon: Zap, badge: null },
    { id: 'planner', label: 'AI Planner', icon: Compass, badge: null },
    { id: 'habits', label: 'Habit Tracker', icon: Flame, badge: null },
    { id: 'goals', label: 'Goals', icon: Target, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
  ];

  const focusNavItems = [
    { id: 'focus', label: 'Focus Session', icon: Clock, badge: null },
    { id: 'risk', label: 'Deadline Risk', icon: Activity, badge: null },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-[#E2E8F0] dark:border-slate-800/80 sticky top-0 left-0 text-slate-800 dark:text-slate-200 select-none overflow-y-auto">
        {/* LOGO */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#5B5CEB] rounded-xl flex items-center justify-center text-white font-bold text-xl">
              🎯
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-[#5B5CEB] dark:text-indigo-400 leading-tight">
              AI Task & Focus
            </span>
          </div>
        </div>

        {/* EMERGENCY RESCUE CTA - HIGHLIGHTED */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setActiveTab('rescue')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all border cursor-pointer ${
              activeTab === 'rescue'
                ? 'bg-gradient-to-r from-red-500 to-[#FF5D73] text-white border-transparent shadow-[0_4px_15px_rgba(239,68,68,0.3)]'
                : hasEmergency 
                  ? 'bg-red-500/10 text-[#FF5D73] border-red-500/30 animate-pulse'
                  : 'bg-orange-500/5 hover:bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20'
            }`}
          >
            <AlertTriangle className={`w-5 h-5 ${hasEmergency ? 'animate-bounce' : ''}`} />
            <span>RESCUE MODE ⭐</span>
            {hasEmergency && (
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex-1 px-3 py-2 space-y-6">
          {/* Main Navigation */}
          <div>
            <span className="px-4 text-[10px] font-black text-slate-500 tracking-widest uppercase font-mono">
              Core Workspace
            </span>
            <div className="mt-2 space-y-0.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer ${
                      active 
                        ? 'bg-[#5B5CEB]/10 text-[#5B5CEB] dark:bg-[#5B5CEB]/20 dark:text-indigo-300 font-bold' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#5B5CEB] dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-[#6EE7B7] text-[#0F172A] text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Productivity Tools */}
          <div>
            <span className="px-4 text-[10px] font-black text-slate-500 tracking-widest uppercase font-mono">
              Productivity Tools
            </span>
            <div className="mt-2 space-y-0.5">
              {toolsNavItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer ${
                      active 
                        ? 'bg-[#5B5CEB]/10 text-[#5B5CEB] dark:bg-[#5B5CEB]/20 dark:text-indigo-300 font-bold' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#5B5CEB] dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Execution Guards */}
          <div>
            <span className="px-4 text-[10px] font-black text-slate-500 tracking-widest uppercase font-mono">
              Execution Guards
            </span>
            <div className="mt-2 space-y-0.5">
              {focusNavItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer ${
                      active 
                        ? 'bg-[#5B5CEB]/10 text-[#5B5CEB] dark:bg-[#5B5CEB]/20 dark:text-indigo-300 font-bold' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#5B5CEB] dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AVA Assistant Context Card */}
        <div className="mx-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6EE7B7] text-[#0F172A] font-bold text-sm">
              🤖
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AVA Assistant</span>
          </div>
          <p className="text-xs text-slate-700 font-semibold leading-relaxed">
            You have 3 hours free before the ML deadline.
          </p>
        </div>

        {/* BOTTOM USER PANEL */}
        <div className="p-4 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <h4 className="text-xs font-bold leading-tight truncate text-slate-900 dark:text-white">{userName}</h4>
              <span className="text-[10px] text-slate-500 font-semibold font-mono">Demo Session</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => setActiveTab('settings')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#5B5CEB] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF5D73] hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 flex items-center justify-around px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] text-slate-500 dark:text-slate-400">
        <button 
          onClick={() => {
            setActiveTab('dashboard');
            setShowMobileMenu(false);
          }} 
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
            activeTab === 'dashboard' && !showMobileMenu
              ? 'text-[#5B5CEB] dark:text-indigo-400 font-extrabold scale-105' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9.5px]">Home</span>
        </button>

        <button 
          onClick={() => {
            setActiveTab('calendar');
            setShowMobileMenu(false);
          }} 
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
            activeTab === 'calendar' && !showMobileMenu
              ? 'text-[#5B5CEB] dark:text-indigo-400 font-extrabold scale-105' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[9.5px]">Calendar</span>
        </button>

        {/* Center Floating Add Task Button */}
        <div className="relative -top-3">
          <button 
            onClick={() => {
              setActiveTab('add_task');
              setShowMobileMenu(false);
            }} 
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] text-white flex items-center justify-center shadow-[0_4px_15px_rgba(91,92,235,0.4)] hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Add Task"
          >
            <Plus className="w-5.5 h-5.5" />
          </button>
        </div>

        <button 
          onClick={() => {
            setActiveTab('ai');
            setShowMobileMenu(false);
          }} 
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
            activeTab === 'ai' && !showMobileMenu
              ? 'text-[#5B5CEB] dark:text-indigo-400 font-extrabold scale-105' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9.5px]">AI Coach</span>
        </button>

        <button 
          onClick={() => setShowMobileMenu(prev => !prev)} 
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
            showMobileMenu || !['dashboard', 'calendar', 'rescue', 'ai'].includes(activeTab)
              ? 'text-[#5B5CEB] dark:text-indigo-400 font-extrabold scale-105' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9.5px]">More</span>
        </button>
      </nav>

      {/* MOBILE ALL-TOOLS SLIDE-UP SHEET */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 cursor-pointer"
            />

            {/* Slide-Up Sheet Body */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-white dark:bg-[#131B2E] rounded-t-[32px] border-t border-slate-200/50 dark:border-slate-800/80 p-6 pb-24 z-50 shadow-[0_-8px_40px_rgba(0,0,0,0.15)] select-none text-left"
            >
              {/* Grab Handle */}
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                    ⚡ All Tools & Workspaces
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Jump directly to any module or manage details</p>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition text-xs font-bold"
                >
                  Close
                </button>
              </div>

              {/* Grid of tools */}
              <div className="space-y-6">
                {/* Section 1: Core Workspace */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2.5">
                    Core Workspaces
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'dashboard', label: 'Dashboard', icon: Home },
                      { id: 'tasks', label: 'Missions & Tasks', icon: CheckSquare },
                      { id: 'calendar', label: 'Calendar Grid', icon: Calendar },
                      { id: 'ai', label: 'AI Companion', icon: MessageSquare, badge: 'Ava' },
                    ].map(item => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMobileMenu(false);
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl text-xs transition border text-left ${
                            active
                              ? 'bg-[#5B5CEB]/10 border-[#5B5CEB]/30 text-[#5B5CEB] dark:bg-[#5B5CEB]/20 dark:text-indigo-300 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-[#5B5CEB] dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`} />
                          <div className="truncate flex-1">
                            <div className="truncate font-semibold">{item.label}</div>
                          </div>
                          {item.badge && (
                            <span className="bg-[#6EE7B7] text-[#0F172A] text-[8px] font-mono px-1 py-0.5 rounded-full font-black">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Productivity Tools */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2.5">
                    Productivity Accelerators
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'matrix', label: 'Priority Matrix', icon: Zap },
                      { id: 'planner', label: 'AI Planner', icon: Compass },
                      { id: 'habits', label: 'Habit Tracker', icon: Flame },
                      { id: 'goals', label: 'Milestone Goals', icon: Target },
                      { id: 'analytics', label: 'Focus Analytics', icon: BarChart3 },
                    ].map(item => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMobileMenu(false);
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl text-xs transition border text-left ${
                            active
                              ? 'bg-[#5B5CEB]/10 border-[#5B5CEB]/30 text-[#5B5CEB] dark:bg-[#5B5CEB]/20 dark:text-indigo-300 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-[#5B5CEB] dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span className="truncate font-semibold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Guards & Support */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono mb-2.5">
                    Guards & Rescues
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'rescue', label: 'Rescue Sprint', icon: AlertTriangle },
                      { id: 'risk', label: 'Deadline Risk', icon: Activity },
                    ].map(item => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMobileMenu(false);
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl text-xs transition border text-left ${
                            active
                              ? 'bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-400 font-bold animate-pulse'
                              : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 font-medium'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span className="truncate font-semibold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Settings & Session info */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                        {userName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight text-slate-900 dark:text-white">{userName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Demo Session</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowMobileMenu(false);
                      }}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700/50"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out Account</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
