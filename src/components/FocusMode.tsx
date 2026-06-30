import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, AlertTriangle, Shield, Clock, HelpCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface FocusModeProps {
  task: Task | null;
  onStop: (minutesSpent: number) => void;
}

export default function FocusMode({ task, onStop }: FocusModeProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25:00 mins
  const [isActive, setIsActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  
  // Audio oscillator reference for real local audio ticking!
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundIntervalRef = useRef<any>(null);

  // Countdown timer loop
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Completed Pomodoro session
      setIsActive(false);
      setSessionCount(prev => prev + 1);
      setTimeLeft(25 * 60); // Reset
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Audio Ticking Synthesis (Simulates ambient binaural focus synth!)
  useEffect(() => {
    if (soundEnabled && isActive) {
      soundIntervalRef.current = setInterval(() => {
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          
          // Generate a cozy, soft low synth bell
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, ctx.currentTime); // Low 140Hz warm focus tone
          
          gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        } catch (err) {
          console.warn("Synth failed to play due to user interaction restrictions.");
        }
      }, 3000); // warm pulse every 3 seconds
    } else {
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
    }

    return () => {
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
    };
  }, [soundEnabled, isActive]);

  const handleStop = () => {
    // Calculate total minutes spent
    const secondsSpent = (25 * 60) - timeLeft;
    const minutesSpent = Math.max(1, Math.round(secondsSpent / 60));
    onStop(minutesSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentProgress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  // Circle progress calculations
  const radius = 90;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentProgress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-[#0F172A] text-slate-100 flex flex-col justify-between p-6 md:p-10 z-50 overflow-y-auto select-none font-sans">
      
      {/* SHIELD GUARD NOTIFICATION BANNER */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs gap-3 font-mono">
        <div className="flex items-center gap-2 text-[#6EE7B7]">
          <Shield className="w-4 h-4" />
          <span className="font-bold">CONCENTRATION COON CLOAK ON</span>
        </div>
        <div className="text-slate-400">
          Incoming notifications blocked successfully
        </div>
      </div>

      {/* TIMER FOCUS DISPLAY */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center space-y-8 my-auto">
        
        {/* Dynamic active task labels */}
        <div className="space-y-1.5">
          <span className="text-xs text-[#5B5CEB] dark:text-indigo-400 font-bold tracking-widest uppercase font-mono">
            CURRENT MISSION FOCUS
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white leading-tight">
            {task ? task.title : "Heads Down Sprint Mode"}
          </h2>
        </div>

        {/* LARGE CIRCULAR COUNTER */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle track */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              strokeWidth={strokeWidth}
              stroke="#1E293B"
              fill="transparent"
            />
            {/* Foreground progress indicator */}
            <motion.circle
              cx="128"
              cy="128"
              r={radius}
              strokeWidth={strokeWidth}
              stroke="#5B5CEB"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Core countdown numerical readout */}
          <div className="absolute text-center space-y-1">
            <span className="block text-5xl font-black font-mono tracking-tight leading-none text-white">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">
              POMODORO CYCLE {sessionCount}
            </span>
          </div>
        </div>

        {/* AI INTERACTIVE SUPPORT PROMPT CHIP */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm flex items-start gap-3.5 text-left relative overflow-hidden">
          <div className="text-2xl animate-float">🤖</div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-[#5B5CEB] font-mono leading-none">AVA COACH</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              "You're doing remarkably well. Hold focus for another 8 minutes, and we'll hit our core code milestone!"
            </p>
          </div>
        </div>

        {/* CONTROL ACTION BUTTONS */}
        <div className="flex items-center gap-4 pt-4">
          
          {/* Ambient trigger toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              soundEnabled 
                ? 'bg-[#5B5CEB]/20 border-[#5B5CEB] text-[#5B5CEB]' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Binaural Focus Pulse Synth"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-16 h-16 rounded-2xl bg-white text-[#0F172A] hover:bg-slate-100 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>

          {/* Stop / Finish */}
          <button
            onClick={handleStop}
            className="p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-[#FF5D73] border border-red-500/20 hover:border-red-500/40 transition cursor-pointer"
            title="End Session"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>
        </div>

      </div>

      {/* BOTTOM METADATA BAR */}
      <div className="w-full text-center text-[10px] text-slate-500 font-mono">
        AI Task & Focus Companion • Focus shield active • Keep heads down
      </div>

    </div>
  );
}
