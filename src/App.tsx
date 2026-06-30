import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MessageSquare, AlertTriangle, Play, Sparkles } from 'lucide-react';

// Core Sub-components
import Sidebar from './components/Sidebar';
import SplashAndLogin from './components/SplashAndLogin';
import HomeDashboard from './components/HomeDashboard';
import AIAssistant from './components/AIAssistant';
import AddTask from './components/AddTask';
import TaskDetails from './components/TaskDetails';
import CalendarView from './components/CalendarView';
import PriorityMatrix from './components/PriorityMatrix';
import DeadlineRisk from './components/DeadlineRisk';
import FocusMode from './components/FocusMode';
import LastMinuteRescue from './components/LastMinuteRescue';
import HabitTracker from './components/HabitTracker';
import AnalyticsView from './components/AnalyticsView';
import AIPlanner from './components/AIPlanner';
import GoalScreen from './components/GoalScreen';
import SettingsView from './components/SettingsView';

// Core types
import { Task, Message } from './types';

// Initial Mock tasks to match UI Design System specification precisely
const INITIAL_MOCK_TASKS: Task[] = [
  {
    id: 'ml_assignment',
    title: "Machine Learning Term Assignment",
    deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    estimatedHours: 5,
    priority: 'High',
    category: 'Study',
    riskScore: 82,
    subtasks: [
      { id: '1', title: "Research & Literature review", completed: true, estimatedMinutes: 60 },
      { id: '2', title: "Assemble training dataset", completed: true, estimatedMinutes: 40 },
      { id: '3', title: "Implement model network layout", completed: false, estimatedMinutes: 120 },
      { id: '4', title: "Compile evaluation report & graphs", completed: false, estimatedMinutes: 60 },
      { id: '5', title: "Upload submission pack to student portal", completed: false, estimatedMinutes: 20 }
    ],
    status: 'In Progress',
    aiPlanGenerated: true,
    aiPlanSteps: [
      "Avoid overfitting by keeping model layers simple",
      "Do a quick run with a subset of the dataset to verify code paths",
      "Draft report concurrently with model training metrics"
    ],
    focusTimeSpent: 0,
    focusSessionsCount: 0
  },
  {
    id: 'pay_bill',
    title: "Pay Electricity Utility Bill",
    deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    estimatedHours: 0.5,
    priority: 'Medium',
    category: 'Life',
    riskScore: 25,
    subtasks: [
      { id: '1', title: "Login to portal and finalize transfer", completed: false, estimatedMinutes: 15 }
    ],
    status: 'Not Started',
    aiPlanGenerated: false,
    focusTimeSpent: 0,
    focusSessionsCount: 0
  },
  {
    id: 'submit_resume',
    title: "Submit Resume to Career Fair",
    deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    estimatedHours: 1.5,
    priority: 'High',
    category: 'Work',
    riskScore: 48,
    subtasks: [
      { id: '1', title: "Revise formatting & highlight project streaks", completed: false, estimatedMinutes: 60 },
      { id: '2', title: "Export to high-res PDF and submit", completed: false, estimatedMinutes: 30 }
    ],
    status: 'Not Started',
    aiPlanGenerated: false,
    focusTimeSpent: 0,
    focusSessionsCount: 0
  }
];

export default function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Theme Mode State
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('lastminute_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('lastminute_theme', themeMode);
    const root = window.document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Tasks Persistent Storage State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('lastminute_tasks');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_TASKS;
  });

  // Selected drill-down active task
  const [drilldownTaskId, setDrilldownTaskId] = useState<string | null>(null);

  // Focus mode task and state
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  // Chat message logs with AVA
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      sender: 'assistant',
      text: "Hey! I'm AVA, your Last-Minute Life Saver productivity companion. I've analyzed your outstanding tasks—and that Machine Learning assignment tomorrow is looking quite urgent! How can I help you handle the sprint?",
      timestamp: new Date().toLocaleTimeString(),
      expression: 'warning',
      suggestions: ["How should I study for my Friday exam?", "Break down my ML Assignment", "Start an Emergency Rescue Plan"]
    }
  ]);
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);

  // Sync tasks storage
  useEffect(() => {
    localStorage.setItem('lastminute_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleLoginSuccess = (name: string) => {
    setUserName(name);
  };

  const handleLogout = () => {
    setUserName(null);
    localStorage.removeItem('lastminute_tasks');
    setTasks(INITIAL_MOCK_TASKS);
    setActiveTab('dashboard');
  };

  // ----------------------------------------------------
  // TASK CORE ACTIONS
  // ----------------------------------------------------
  const handleToggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const isCompleted = task.status === 'Completed';
        return {
          ...task,
          status: isCompleted ? 'Not Started' : 'Completed',
          subtasks: task.subtasks.map(st => ({ ...st, completed: !isCompleted }))
        };
      }
      return task;
    }));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(st => {
          if (st.id === subtaskId) return { ...st, completed: !st.completed };
          return st;
        });
        
        // Recalculate status based on subtasks
        const allCompleted = updatedSubtasks.every(st => st.completed);
        const someCompleted = updatedSubtasks.some(st => st.completed);
        let finalStatus = task.status;
        if (allCompleted) finalStatus = 'Completed';
        else if (someCompleted) finalStatus = 'In Progress';
        else finalStatus = 'Not Started';

        return {
          ...task,
          subtasks: updatedSubtasks,
          status: finalStatus
        };
      }
      return task;
    }));
  };

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTriggerFocus = (task: Task) => {
    setFocusTask(task);
  };

  const handleStopFocus = (minutesSpent: number) => {
    if (focusTask) {
      // Log focus times in task history
      setTasks(prev => prev.map(t => {
        if (t.id === focusTask.id) {
          return {
            ...t,
            focusTimeSpent: t.focusTimeSpent + minutesSpent,
            focusSessionsCount: t.focusSessionsCount + 1
          };
        }
        return t;
      }));
    }
    setFocusTask(null);
  };

  // ----------------------------------------------------
  // INTEGRATED AVA CHATBOT LOOPS
  // ----------------------------------------------------
  const handleSendChatMessage = async (text: string) => {
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsGeneratingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
        expression: data.expression,
        suggestions: data.suggestions,
        actionType: data.actionType
      };

      setMessages(prev => [...prev, assistantMsg]);

    } catch (err) {
      console.error("Chat fetch error:", err);
      // Fallback
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'assistant',
        text: "I heard you! Let's schedule that study block and focus on key objectives together! 😊",
        timestamp: new Date().toLocaleTimeString(),
        expression: 'happy',
        suggestions: ["Add task details", "Show schedule timeline"]
      }]);
    } finally {
      setIsGeneratingChat(false);
    }
  };

  // AI-driven shortcut callbacks
  const handleAddTaskViaAI = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title: taskData.title || "AI Generated Sprint Task",
      deadline: taskData.deadline || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      estimatedHours: taskData.estimatedHours || 2,
      priority: taskData.priority || 'High',
      category: taskData.category || 'Study',
      riskScore: 40,
      subtasks: [
        { id: '1', title: 'Scope alignment & research', completed: false, estimatedMinutes: 30 },
        { id: '2', title: 'Main task implementation draft', completed: false, estimatedMinutes: 90 }
      ],
      status: 'Not Started',
      aiPlanGenerated: true,
      focusTimeSpent: 0,
      focusSessionsCount: 0
    };
    handleAddTask(newTask);
    setActiveTab('tasks');
  };

  const handleStartFocusViaAI = (taskTitle: string) => {
    const matchedTask = tasks.find(t => t.title.toLowerCase().includes(taskTitle.toLowerCase())) || tasks[0];
    if (matchedTask) {
      setFocusTask(matchedTask);
    }
  };

  const handleStartRescueViaAI = (taskTitle: string) => {
    const matchedTask = tasks.find(t => t.title.toLowerCase().includes(taskTitle.toLowerCase())) || tasks[0];
    if (matchedTask) {
      setActiveTab('rescue');
    }
  };

  // Check if any high risk tasks exist to trigger flashing sidebar warnings
  const hasEmergency = tasks.some(t => t.status !== 'Completed' && t.riskScore >= 80);

  // Onboarding Skip Guard
  if (!userName) {
    return <SplashAndLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8F9FC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* SIDEBAR NAVIGATION */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setDrilldownTaskId(null); // Clear task detail drilldown on tab navigation
        }} 
        userName={userName}
        onLogout={handleLogout}
        hasEmergency={hasEmergency}
      />

      {/* CORE CONTENT LAYOUT */}
      <main className={`flex-1 min-h-[calc(100vh-4rem)] lg:h-screen relative transition-all duration-300 ${
        activeTab === 'ai' 
          ? 'overflow-hidden pb-0' 
          : 'overflow-y-auto pb-20 lg:pb-0'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (drilldownTaskId ? `_drill_${drilldownTaskId}` : '')}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            {/* DRILLDOWN OVERRIDE */}
            {drilldownTaskId ? (
              <TaskDetails
                task={tasks.find(t => t.id === drilldownTaskId)!}
                onToggleSubtask={handleToggleSubtask}
                onStartFocus={handleTriggerFocus}
                onActivateRescue={(task) => {
                  setDrilldownTaskId(null);
                  setActiveTab('rescue');
                }}
                onBack={() => setDrilldownTaskId(null)}
              />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <HomeDashboard
                    userName={userName}
                    tasks={tasks}
                    onToggleTask={handleToggleTaskCompleted}
                    onStartFocus={handleTriggerFocus}
                    onActivateRescue={(task) => {
                      setActiveTab('rescue');
                    }}
                    onOpenAva={() => setActiveTab('ai')}
                  />
                )}

                {activeTab === 'tasks' && (
                  <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto pb-24 lg:pb-12 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-2">
                          📋 Active Missions
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Click any card to examine milestones, advice plans, and track focus logs.
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setActiveTab('add_task')}
                        className="bg-[#5B5CEB] hover:opacity-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Task</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tasks.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => setDrilldownTaskId(task.id)}
                          className="p-5 glass-card rounded-[24px] border border-slate-200/50 dark:border-slate-800/50 cursor-pointer hover:border-[#5B5CEB]/30 transition group flex flex-col justify-between h-44 relative overflow-hidden"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="font-extrabold text-sm text-slate-950 dark:text-white group-hover:text-[#5B5CEB] transition truncate">
                                {task.title}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                                task.status === 'Completed' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20' 
                                  : 'bg-indigo-100 text-[#5B5CEB] dark:bg-indigo-950/20 dark:text-indigo-400'
                              }`}>
                                {task.status.toUpperCase()}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 font-mono mt-1">Due {task.deadline}</p>
                          </div>

                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-end">
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase font-mono font-bold leading-none">RISK PROBABILITY</span>
                              <span className={`text-xs font-black font-mono leading-none ${
                                task.riskScore > 75 ? 'text-[#FF5D73]' : task.riskScore > 40 ? 'text-[#FFC857]' : 'text-emerald-500'
                              }`}>
                                {task.riskScore}% {task.riskScore > 75 ? '🔥' : ''}
                              </span>
                            </div>

                            <span className="text-[10px] font-mono font-bold bg-[#5B5CEB]/5 text-[#5B5CEB] dark:text-indigo-400 px-2.5 py-1 rounded-lg">
                              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Done
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'add_task' && (
                  <AddTask 
                    onAddTask={handleAddTask} 
                    onClose={() => setActiveTab('tasks')} 
                  />
                )}

                {activeTab === 'calendar' && (
                  <CalendarView 
                    tasks={tasks} 
                    onAddTask={handleAddTask} 
                  />
                )}

                {activeTab === 'ai' && (
                  <AIAssistant
                    messages={messages}
                    onSendMessage={handleSendChatMessage}
                    isGenerating={isGeneratingChat}
                    onAddTaskViaAI={handleAddTaskViaAI}
                    onStartFocusViaAI={handleStartFocusViaAI}
                    onStartRescueViaAI={handleStartRescueViaAI}
                  />
                )}

                {activeTab === 'matrix' && (
                  <PriorityMatrix 
                    tasks={tasks} 
                    onStartFocus={handleTriggerFocus} 
                  />
                )}

                {activeTab === 'planner' && (
                  <AIPlanner />
                )}

                {activeTab === 'habits' && (
                  <HabitTracker />
                )}

                {activeTab === 'goals' && (
                  <GoalScreen />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsView />
                )}

                {activeTab === 'risk' && (
                  <DeadlineRisk 
                    tasks={tasks} 
                    onOptimizeSchedule={() => {
                      // Simulating schedule optimization decrease risk score
                      setTasks(prev => prev.map(t => ({
                        ...t,
                        riskScore: Math.max(15, Math.round(t.riskScore * 0.65))
                      })));
                      setActiveTab('tasks');
                    }} 
                  />
                )}

                {activeTab === 'rescue' && (
                  <LastMinuteRescue 
                    tasks={tasks} 
                    onStartFocus={handleTriggerFocus} 
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsView userName={userName} themeMode={themeMode} setThemeMode={setThemeMode} />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* DETACHED IMMERSIVE POMODORO FOCUS OVERLAY */}
      <AnimatePresence>
        {focusTask && (
          <FocusMode 
            task={focusTask} 
            onStop={handleStopFocus} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
