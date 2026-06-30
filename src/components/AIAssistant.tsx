import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mic, 
  Sparkles, 
  Compass, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  Play, 
  Plus, 
  CornerDownLeft,
  X
} from 'lucide-react';
import { Message, Task } from '../types';

interface AIAssistantProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
  onAddTaskViaAI: (taskData: Partial<Task>) => void;
  onStartFocusViaAI: (taskTitle: string) => void;
  onStartRescueViaAI: (taskTitle: string) => void;
}

export default function AIAssistant({ 
  messages, 
  onSendMessage, 
  isGenerating,
  onAddTaskViaAI,
  onStartFocusViaAI,
  onStartRescueViaAI
}: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    "Prepare ML Presentation",
    "Plan study schedule for Friday Exam",
    "Break down Research Paper assignment",
    "Schedule home workout slots this week"
  ];

  // Auto-scroll to latest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput('');
  };

  // Simulate Voice Transcription
  const handleVoiceAssistantStart = () => {
    setIsListening(true);
    // Auto-transcribe a helpful command after 3 seconds of soundwave animation
    const timer = setTimeout(() => {
      setIsListening(false);
      const transcripts = [
        "Finish ML Assignment by tomorrow and create a focus session",
        "Add a high priority study task for Friday exam with 3 hours effort",
        "Create an emergency rescue plan for English Project",
        "How can I plan my workout sessions this week?"
      ];
      const randomTranscript = transcripts[Math.floor(Math.random() * transcripts.length)];
      setInput(randomTranscript);
    }, 2500);
    setVoiceTimer(timer);
  };

  const cancelVoice = () => {
    setIsListening(false);
    if (voiceTimer) clearTimeout(voiceTimer);
  };

  // Extract the latest AI expression
  const latestAiMessage = [...messages].reverse().find(m => m.sender === 'assistant');
  const avaExpression = latestAiMessage?.expression || 'happy';

  const getAvaEmoji = (exp: string) => {
    switch (exp) {
      case 'thinking': return '🤔';
      case 'warning': return '🚨';
      case 'celebration': return '🎉';
      case 'happy':
      default:
        return '😊';
    }
  };

  const getAvaExpressionLabel = (exp: string) => {
    switch (exp) {
      case 'thinking': return 'AVA is planning...';
      case 'warning': return 'AVA detects high risk!';
      case 'celebration': return 'AVA is celebrating!';
      case 'happy':
      default:
        return 'AVA is cheerful';
    }
  };

  // Parse embedded AI action triggers inside message strings
  const handleActionClick = (actionType: string, textContext: string) => {
    if (actionType === 'create_task') {
      onAddTaskViaAI({
        title: textContext || "AI Scheduled Task",
        deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days default
        estimatedHours: 2,
        priority: 'High',
        category: 'Study'
      });
    } else if (actionType === 'start_focus') {
      onStartFocusViaAI(textContext || "Focus Task");
    } else if (actionType === 'start_rescue') {
      onStartRescueViaAI(textContext || "Urgent Rescue Task");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen text-slate-800 dark:text-slate-100 select-none relative max-w-4xl mx-auto pb-2 lg:pb-6">
      
      {/* CHAT HEADER */}
      <div className="p-4 md:p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between glass sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-center text-3xl animate-float">
            {getAvaEmoji(avaExpression)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900 dark:text-white font-display">🤖 AVA Companion</h2>
              <span className="bg-[#6EE7B7] text-[#0F172A] text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono leading-none mt-1">
              {getAvaExpressionLabel(avaExpression)}
            </p>
          </div>
        </div>

        {/* Info label */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-[#5B5CEB]" />
          <span>REAL-TIME PLANNING ACTIVE</span>
        </div>
      </div>

      {/* CHAT BUBBLES SCROLLER */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* AVA Greeting */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/50 flex items-center justify-center text-lg self-start shrink-0">
            🤖
          </div>
          <div className="glass-card rounded-[22px] rounded-tl-sm p-4 text-sm max-w-[85%] leading-relaxed border border-slate-200/40 dark:border-slate-800/40">
            <p className="font-semibold text-xs text-[#5B5CEB] mb-1 font-mono uppercase tracking-wide">AVA AI Assistant</p>
            Hey there! I am AVA, your personal procrastination shield. 🛡️
            <p className="mt-2">
              Tell me what you are working on, when it's due, and how long you think it will take. I can analyze the deadline risk, break it into customized subtasks, or design a fully automated <strong>Emergency Rescue Plan</strong> to save your week!
            </p>
          </div>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/50 flex items-center justify-center text-lg self-start shrink-0">
                  {getAvaEmoji(msg.expression || 'happy')}
                </div>
              )}
              
              <div className={`rounded-[22px] p-4 text-sm max-w-[85%] leading-relaxed border ${
                isUser 
                  ? 'bg-[#5B5CEB] text-white rounded-tr-sm border-transparent' 
                  : 'glass-card rounded-tl-sm border-slate-200/40 dark:border-slate-800/40'
              }`}>
                {!isUser && (
                  <p className="font-semibold text-xs text-[#5B5CEB] dark:text-indigo-300 mb-1 font-mono uppercase tracking-wide">AVA Companion</p>
                )}
                
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Optional embedded action triggers inside AI response */}
                {msg.actionType && (
                  <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-200/20">
                    <button
                      onClick={() => handleActionClick(msg.actionType!, msg.actionPayload?.taskTitle || '')}
                      className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {msg.actionType === 'create_task' && <Plus className="w-3.5 h-3.5" />}
                      {msg.actionType === 'start_focus' && <Clock className="w-3.5 h-3.5" />}
                      {msg.actionType === 'start_rescue' && <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>
                        {msg.actionType === 'create_task' && "Add Task Manually"}
                        {msg.actionType === 'start_focus' && "Launch Focus Mode"}
                        {msg.actionType === 'start_rescue' && "Start Rescue Sprint!"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/50 flex items-center justify-center text-lg self-start shrink-0 animate-pulse">
              🤔
            </div>
            <div className="glass-card rounded-[22px] rounded-tl-sm p-4 text-sm border border-slate-200/40 dark:border-slate-800/40 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-[#5B5CEB]" />
              <span className="text-xs text-slate-500 font-mono">AVA is recalculating scheduling algorithms...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CHAT INPUT AREA */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
        
        {/* Short Suggestion Chips */}
        {messages.length <= 2 && !isGenerating && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setInput(chip)}
                className="bg-slate-50 hover:bg-slate-100 dark:bg-[#1E293B] dark:hover:bg-slate-800/80 hover:border-[#5B5CEB]/40 hover:text-[#5B5CEB] transition px-3.5 py-1.5 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 cursor-pointer text-xs font-semibold shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell AVA what's on your mind or request an emergency schedule..."
            disabled={isGenerating}
            className="flex-1 bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/80 focus:border-[#5B5CEB] focus:bg-white dark:focus:bg-[#0B0F19] focus:ring-1 focus:ring-[#5B5CEB] rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition font-medium"
          />

          {/* Simulated Mic Trigger */}
          <button
            type="button"
            onClick={handleVoiceAssistantStart}
            disabled={isGenerating}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E293B] dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition shrink-0 cursor-pointer"
            title="Simulate Voice Input"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="p-3.5 rounded-2xl bg-[#5B5CEB] hover:bg-[#4a4be0] text-white shadow-md shadow-indigo-500/20 transition shrink-0 cursor-pointer flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* AUDIO RECORDING OVERLAY (SIMULATED VOICE WAVE) */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0F172A]/95 z-50 flex flex-col items-center justify-center p-6 text-white"
          >
            <button 
              onClick={cancelVoice}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-6">
              <div className="text-6xl animate-bounce">🎙️</div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-display">AVA is Listening...</h3>
                <p className="text-slate-400 text-xs font-mono">Speak your task description and priority</p>
              </div>

              {/* Animated Wave bar loops */}
              <div className="flex items-center justify-center gap-1.5 h-16 mt-8">
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [12, 50, 12] }}
                    transition={{
                      duration: 0.6 + i * 0.08,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-[#5B5CEB] to-[#6EE7B7]"
                  />
                ))}
              </div>

              <p className="text-sm text-[#6EE7B7] italic max-w-sm font-mono pt-4 animate-pulse">
                "Finish ML homework by tomorrow and create a focus session"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
