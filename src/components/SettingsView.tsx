import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, Bell, Calendar, Sparkles, Volume2, Moon, Sun, Monitor } from 'lucide-react';

interface SettingsViewProps {
  userName: string;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
}

export default function SettingsView({ userName, themeMode, setThemeMode }: SettingsViewProps) {
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoFocus, setAutoFocus] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(true);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto text-slate-800 dark:text-slate-100 select-none pb-24 lg:pb-12">
      
      {/* HEADER ROW */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
          ⚙️ Settings & Customization
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Personalize your Ava AI companion parameters, notification locks, and visual templates.
        </p>
      </div>

      <div className="glass-card rounded-[28px] p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6 text-left">
        
        {/* PROFILE BLOCK */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/50">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5B5CEB] to-indigo-400 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-indigo-500/10">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-display leading-tight">{userName}</h3>
            <span className="text-xs font-mono text-slate-500 font-bold leading-none">DEMO SUITE ACCESS</span>
          </div>
        </div>

        {/* SETTINGS OPTIONS */}
        <div className="space-y-5">
          
          {/* THEME SELECT */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500">
                {themeMode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Visual Mode</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Change application canvas display tone</p>
              </div>
            </div>
            
            <div className="flex bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-1 rounded-xl">
              <button
                onClick={() => setThemeMode('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans cursor-pointer transition ${
                  themeMode === 'light' ? 'bg-[#5B5CEB] text-white' : 'text-slate-500 hover:text-slate-700 font-bold'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans cursor-pointer transition ${
                  themeMode === 'dark' ? 'bg-[#5B5CEB] text-white' : 'text-slate-500 hover:text-slate-700 font-bold'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* NOTIFICATION ENABLE */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Smart Reminders</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Get context-aware study nudges from AVA</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifsEnabled}
                onChange={(e) => setNotifsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5B5CEB]"></div>
            </label>
          </div>

          {/* CALENDAR CONNECTION */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Google Workspace Sync</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Fetch meetings and find free slots automatically</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={calendarConnected}
                onChange={(e) => setCalendarConnected(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5B5CEB]"></div>
            </label>
          </div>

          {/* VOICE ASSISTANT ENABLE */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">AVA Voice Feedback</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Play responsive voice waves during onboarding</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5B5CEB]"></div>
            </label>
          </div>

          {/* AUTO FOCUS TIMER */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Auto Focus Blocker</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Force focus mode during high-risk countdown sprints</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoFocus}
                onChange={(e) => setAutoFocus(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5B5CEB]"></div>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}
