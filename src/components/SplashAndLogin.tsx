import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Loader2, Compass, Shield, Users, Trophy } from 'lucide-react';

interface SplashAndLoginProps {
  onLoginSuccess: (name: string) => void;
}

export default function SplashAndLogin({ onLoginSuccess }: SplashAndLoginProps) {
  const [step, setStep] = useState<'splash' | 'onboarding' | 'auth'>('splash');
  const [onboardIndex, setOnboardIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Splash countdown
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('onboarding');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const onboardingSlides = [
    {
      title: "Meet AVA, Your Productivity Ally",
      desc: "An intelligent, supportive, and slightly sassy robot designed to break tasks into subtasks and safeguard your deadlines.",
      icon: <Sparkles className="w-12 h-12 text-[#5B5CEB]" />,
      color: "from-indigo-500/10 to-purple-500/10"
    },
    {
      title: "Emergency Rescue Plans",
      desc: "Behind on a project? Activate Last-Minute Rescue Mode to generate an hourly crisis action schedule to finish on time.",
      icon: <Compass className="w-12 h-12 text-[#FF5D73]" />,
      color: "from-rose-500/10 to-orange-500/10"
    },
    {
      title: "Context-Aware Focus Timer",
      desc: "Lock into a beautifully immersive Focus Mode. Block out external noise while AVA provides custom motivation loops.",
      icon: <Shield className="w-12 h-12 text-[#6EE7B7]" />,
      color: "from-emerald-500/10 to-teal-500/10"
    }
  ];

  const handleNextOnboard = () => {
    if (onboardIndex < onboardingSlides.length - 1) {
      setOnboardIndex(onboardIndex + 1);
    } else {
      setStep('auth');
    }
  };

  const handleDemoSkip = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(userName.trim() || 'John Doe');
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-sans bg-[#F8F9FC]">
      {/* Background Animated Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F1F5F9] via-[#E2E8F0] to-[#F8F9FC] z-0" />
      
      {/* Visual Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5B5CEB]/10 rounded-full blur-[120px] animate-float z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#6EE7B7]/10 rounded-full blur-[140px] animate-pulse-slow z-0" />

      <AnimatePresence mode="wait">
        {/* STEP 1: SPLASH SCREEN */}
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-24 h-24 rounded-3xl bg-[#5B5CEB] flex items-center justify-center shadow-[0_8px_30px_rgba(91,92,235,0.25)] mb-8 animate-float"
            >
              <span className="text-4xl animate-pulse">🎯</span>
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-display"
            >
              AI Task & <span className="text-[#5B5CEB]">Focus Companion</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ delay: 0.6 }}
              className="text-slate-600 mt-3 text-lg font-medium font-sans"
            >
              AI Productivity Companion
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 flex items-center gap-2 text-slate-500 text-xs font-mono"
            >
              <Loader2 className="w-4 h-4 animate-spin text-[#5B5CEB]" />
              <span>Calibrating emergency schedules...</span>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 2: ONBOARDING SLIDES */}
        {step === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative z-10 w-full max-w-lg mx-auto px-6"
          >
            <div className="bg-white rounded-[32px] p-8 md:p-10 text-slate-800 shadow-xl border border-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={() => setStep('auth')} 
                  className="text-xs text-slate-500 hover:text-slate-800 transition font-semibold cursor-pointer"
                >
                  Skip
                </button>
              </div>

              {/* Slide Content */}
              <motion.div
                key={onboardIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center text-center mt-6"
              >
                <div className={`p-6 rounded-3xl bg-gradient-to-tr ${onboardingSlides[onboardIndex].color} mb-6 border border-slate-100 shadow-inner`}>
                  {onboardingSlides[onboardIndex].icon}
                </div>
                
                <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">
                  {onboardingSlides[onboardIndex].title}
                </h2>
                
                <p className="text-slate-600 text-sm mt-4 leading-relaxed max-w-md">
                  {onboardingSlides[onboardIndex].desc}
                </p>
              </motion.div>

              {/* Pager Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {onboardingSlides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === onboardIndex ? 'w-6 bg-[#5B5CEB]' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={handleNextOnboard}
                  className="w-full bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] hover:opacity-95 text-white font-medium py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition shadow-[0_4px_20px_rgba(91,92,235,0.25)] cursor-pointer"
                >
                  <span>{onboardIndex === onboardingSlides.length - 1 ? "Let's Begin" : "Next"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: AUTH & DEMO LOGIN */}
        {step === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-4xl px-4 flex flex-col md:flex-row items-center gap-12"
          >
            {/* Left Side: Illustration */}
            <div className="hidden md:flex flex-col flex-1 text-slate-800 select-none">
              <div className="relative w-80 h-80 mx-auto">
                {/* SVG Illustration - Laptop User + Hovering Ava Robot */}
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Floating Desk Glow */}
                  <ellipse cx="200" cy="320" rx="140" ry="20" fill="rgba(91,92,235,0.08)" />
                  
                  {/* Desk Surface */}
                  <rect x="70" y="295" width="260" height="15" rx="5" fill="#334155" />
                  
                  {/* Laptop */}
                  <rect x="150" y="240" width="100" height="60" rx="4" fill="#94A3B8" />
                  <polygon points="135,295 150,240 250,240 265,295" fill="#64748B" />
                  <rect x="158" y="248" width="84" height="44" rx="2" fill="#0F172A" />
                  {/* Glowing code lines on screen */}
                  <rect x="165" y="254" width="30" height="4" rx="1" fill="#5B5CEB" />
                  <rect x="165" y="262" width="50" height="4" rx="1" fill="#6EE7B7" />
                  <rect x="165" y="270" width="40" height="4" rx="1" fill="#818CF8" />

                  {/* Girl Character */}
                  {/* Hair back */}
                  <path d="M 125,180 C 115,220 160,220 155,180 Z" fill="#472A1B" />
                  {/* Body / Torso */}
                  <path d="M 100,295 L 170,295 L 155,220 L 115,220 Z" fill="#EC4899" />
                  {/* Face */}
                  <circle cx="135" cy="190" r="22" fill="#FDBA74" />
                  {/* Hair Front / Ponytail */}
                  <path d="M 120,175 C 115,160 155,160 150,175 Z" fill="#472A1B" />
                  <path d="M 115,180 C 105,185 105,210 110,215" stroke="#472A1B" strokeWidth="8" strokeLinecap="round" />
                  {/* Hands typing */}
                  <path d="M 125,235 Q 140,265 155,270" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 145,235 Q 160,265 175,268" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" fill="none" />

                  {/* Robot AVA hovering */}
                  <g className="animate-float">
                    {/* Robot Head */}
                    <rect x="250" y="110" width="80" height="60" rx="24" fill="#F8FAFC" stroke="#5B5CEB" strokeWidth="3" />
                    {/* Screen Face */}
                    <rect x="260" y="122" width="60" height="36" rx="12" fill="#0F172A" />
                    {/* Glowing Eyes */}
                    <circle cx="278" cy="140" r="5" fill="#6EE7B7" className="animate-pulse" />
                    <circle cx="302" cy="140" r="5" fill="#6EE7B7" className="animate-pulse" />
                    {/* Cute blush */}
                    <ellipse cx="272" cy="148" rx="3" ry="1.5" fill="#EC4899" />
                    <ellipse cx="308" cy="148" rx="3" ry="1.5" fill="#EC4899" />
                    {/* Antennas */}
                    <line x1="290" y1="110" x2="290" y2="90" stroke="#5B5CEB" strokeWidth="3" />
                    <circle cx="290" cy="88" r="6" fill="#FFC857" />
                    {/* Robotic body/hovering base */}
                    <path d="M 270,170 L 310,170 L 290,195 Z" fill="#64748B" />
                    {/* Energy glow */}
                    <ellipse cx="290" cy="205" rx="12" ry="4" fill="#6EE7B7" opacity="0.8" />
                  </g>
                </svg>
              </div>
              <h3 className="text-xl font-bold font-display text-center mt-4 text-slate-900">Task completed on time!</h3>
              <p className="text-slate-500 text-xs text-center mt-1">AVA helps coordinate focus sessions and breaks work into milestones.</p>
            </div>

            {/* Right Side: Auth Panel */}
            <div className="flex-1 w-full max-w-md">
              <div className="bg-white rounded-[32px] p-8 text-slate-800 shadow-xl border border-slate-200/60">
                <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900 mb-2">
                  Welcome to AI Task & Focus Companion
                </h2>
                <p className="text-slate-500 text-xs mb-6">
                  Sync your workspace calendars or start a demo session instantly.
                </p>

                {/* Third Party Login Options */}
                <div className="space-y-3 mb-6">
                  <button 
                    onClick={() => {}} 
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition border border-slate-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button 
                    onClick={() => {}} 
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition border border-slate-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#00A4EF" d="M1 1h10v10H1z"/>
                      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                      <path fill="#F25022" d="M1 13h10v10H1z"/>
                      <path fill="#FFB900" d="M13 13h10v10H13z"/>
                    </svg>
                    <span>Continue with Microsoft</span>
                  </button>

                  <button 
                    onClick={() => {}} 
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition border border-slate-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    <span>Continue with Apple ID</span>
                  </button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-xs text-slate-400 font-mono">DEMO PLAYGROUND</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Demo Setup */}
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 font-bold mb-1.5 font-mono">YOUR NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#5B5CEB] rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition outline-none"
                    />
                  </div>

                  <button
                    onClick={handleDemoSkip}
                    disabled={isSubmitting}
                    className="w-full bg-[#5B5CEB] hover:bg-[#4F46E5] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-indigo-500/10"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Preheating companion...</span>
                      </>
                    ) : (
                      <>
                        <span>Skip for Demo & Enter App</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
