export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  deadline: string; // ISO String or YYYY-MM-DD
  deadlineTime?: string; // HH:MM
  estimatedHours: number;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Work' | 'Study' | 'Personal' | 'Life';
  riskScore: number; // 0 to 100
  subtasks: SubTask[];
  status: 'Not Started' | 'In Progress' | 'Completed';
  aiPlanGenerated: boolean;
  aiPlanSteps?: string[];
  focusTimeSpent: number; // in minutes
  focusSessionsCount: number;
  completedAt?: string;
  rescuePlanSteps?: {
    timeRange: string;
    action: string;
    completed: boolean;
  }[];
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  progress: number; // 0 to 100
  icon: string;
  history: { [date: string]: boolean }; // YYYY-MM-DD -> completed
}

export interface Goal {
  id: string;
  title: string;
  progress: number; // 0 to 100
  subgoals: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  expression?: 'happy' | 'thinking' | 'warning' | 'celebration';
  suggestions?: string[];
  actionType?: 'create_task' | 'start_rescue' | 'optimize_schedule' | 'start_focus';
  actionPayload?: any;
}

export interface TimelinePlan {
  id: string;
  day: string; // YYYY-MM-DD or day name
  title: string;
  phase: string;
  estimatedHours: number;
}
