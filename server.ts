import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy load Gemini AI to avoid crashing if API key is missing
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fallback to mock responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'MOCK_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// API ENDPOINT 1: Interactive Coach Chat (AVA)
// ----------------------------------------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Fallback response if API key is missing or is the default template value
      return res.json({
        text: `Hey! I'm AVA, your Last Minute Life Saver. (Note: Running in Demo Mode as GEMINI_API_KEY is not set). Let's tackle that pending "${message}" task together! I can help you split it up or build an Emergency Rescue Plan. What's the deadline?`,
        expression: 'happy',
        suggestions: ['Help me break down a task', 'Generate a Last-Minute Rescue Plan', 'Start a Focus Pomodoro Session']
      });
    }

    const ai = getAI();
    
    // Construct chat contents or standard generateContent with history context
    const systemPrompt = `You are "AVA" (Autonomous Virtual Assistant), a highly supportive, playful, yet direct AI accountability partner and productivity companion for procrastinators.
Your design is a cute floating robot with several expressions:
- "happy" (😊 default, congratulatory, welcoming)
- "thinking" (🤔 when brainstorming or planning)
- "warning" (🚨 when the user is slacking off, has high risks, or high urgency)
- "celebration" (🎉 when tasks or focus sessions are completed!)

Keep responses concise, motivating, actionable, and structured. Always recommend next concrete steps.
You must return a JSON response with the following keys:
- "text": (string) Your markdown-formatted response message. Keep it friendly and motivational!
- "expression": (string) One of ["happy", "thinking", "warning", "celebration"].
- "suggestions": (array of strings) 2 to 4 quick response suggestions for the user to tap next.
- "actionType": (optional string) One of ["create_task", "start_rescue", "optimize_schedule", "start_focus"]. Use this if your response intends to trigger a client action.
`;

    const chatContents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: "Understood. I will act as AVA, returning JSON with my response, visual expressions, suggestions, and optional action triggers." }] }
    ];

    // Map history to appropriate parts
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        chatContents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }

    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatContents.map(c => ({ role: c.role, parts: c.parts })),
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Your chat response back to the user in friendly markdown format." },
            expression: { type: Type.STRING, description: "One of: happy, thinking, warning, celebration" },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 3 context-relevant, highly actionable prompt chips for the user."
            },
            actionType: { type: Type.STRING, description: "Optional: create_task, start_rescue, optimize_schedule, start_focus" }
          },
          required: ["text", "expression", "suggestions"]
        }
      }
    });

    const rawText = response.text || "{}";
    const data = JSON.parse(rawText.trim());
    return res.json(data);

  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return res.json({
      text: "Oops! My neural links are a bit busy, but I'm still here! Let's stay focused on your goals anyway. What can we cross off next? 😊",
      expression: 'happy',
      suggestions: ['Add a task manually', 'View Deadline Risk Meter', 'Go to Habits Tracker']
    });
  }
});


// ----------------------------------------------------
// API ENDPOINT 2: Task Breakdown & Risk Analysis
// ----------------------------------------------------
app.post('/api/generate-task-plan', async (req, res) => {
  try {
    const { title, deadline, estimatedHours, priority, category } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Return high-quality mock planning data if API key is not present
      const mockSubtasks = [
        { id: '1', title: 'Research & outline scope', completed: false, estimatedMinutes: 30 },
        { id: '2', title: 'Draft core components / text', completed: false, estimatedMinutes: 90 },
        { id: '3', title: 'Refine and proofread', completed: false, estimatedMinutes: 45 },
        { id: '4', title: 'Final submission preparation', completed: false, estimatedMinutes: 15 }
      ];
      const mockRisk = estimatedHours > 5 ? 78 : 35;
      const reasons = [
        "Needs focused uninterrupted concentration.",
        `Estimated time (${estimatedHours} hrs) is high compared to remaining hours before deadline.`,
        "No historical activity logged for this task category recently."
      ];
      return res.json({
        subtasks: mockSubtasks,
        riskScore: mockRisk,
        reasons: reasons,
        aiPlanSteps: [
          "Start with quick background research to avoid writing block (30m)",
          "Take a 5-minute break, then do a heads-down prototyping or writing draft (90m)",
          "Self-review & format polished output (45m)",
          "Upload and submit early to avoid server traffic (15m)"
        ]
      });
    }

    const ai = getAI();
    const prompt = `Analyze this task and generate a structured subtask list, risk score, and step-by-step plan:
Task Title: "${title}"
Deadline: ${deadline}
Estimated Hours Needed: ${estimatedHours}
Priority: ${priority}
Category: ${category}

Current Date/Time is: ${new Date().toISOString()}

Analyze the risk score from 0 (very safe) to 100 (extreme danger of missing deadline) based on current time versus deadline and needed hours.
Generate exactly 3 to 5 clear subtasks with estimated minutes for each, and a list of step-by-step recommendations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: "Risk of missing deadline (0-100)" },
            reasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 3 concrete reasons why this risk level was assigned."
            },
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER }
                },
                required: ["title", "estimatedMinutes"]
              },
              description: "Structured task breakdown into milestones."
            },
            aiPlanSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Strategic sequence of tips to execute this task successfully."
            }
          },
          required: ["riskScore", "reasons", "subtasks", "aiPlanSteps"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);

  } catch (error: any) {
    console.error("Gemini Task Planner Error:", error);
    return res.status(500).json({ error: error.message });
  }
});


// ----------------------------------------------------
// API ENDPOINT 3: Emergency Last-Minute Rescue Plan
// ----------------------------------------------------
app.post('/api/generate-rescue-plan', async (req, res) => {
  try {
    const { title, estimatedHours, hoursLeft } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Mock emergency schedule (e.g. 4 hours left)
      return res.json({
        chanceOfMissing: 92,
        emergencyPlan: [
          { timeRange: "0 - 30 mins", action: "Fast Outline & Core Scope Trimming (Cut unneeded details)", completed: false },
          { timeRange: "30 - 120 mins", action: "Intense Deep-Work Draft/Coding (No distractions, phone off)", completed: false },
          { timeRange: "120 - 180 mins", action: "Core Implementation Refinement & Verification", completed: false },
          { timeRange: "180 - 220 mins", action: "Documentation, Formatting, & Polishing", completed: false },
          { timeRange: "220 - 240 mins", action: "Emergency Final Submission & Proof Upload", completed: false }
        ]
      });
    }

    const ai = getAI();
    const prompt = `CRITICAL ASSISTANCE REQUEST: Procrastination Alert!
The user has a task: "${title}".
Estimated effort needed: ${estimatedHours} hours.
Time remaining before absolute deadline: ${hoursLeft} hours.
The user is in high stress. Please generate an extremely optimized, time-boxed sprint schedule (Emergency Rescue Plan) to save the deadline. 
Focus on trimming non-essential parts, hyper-focus, and aggressive prioritization.
Return an emergency timeline spanning the remaining ${hoursLeft} hours (or represented in custom time blocks/minutes if under 4 hours).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chanceOfMissing: { type: Type.INTEGER, description: "Assessed probability of missing the deadline if not rescued (0-100)" },
            emergencyPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeRange: { type: Type.STRING, description: "e.g., '0-30 mins', '30-120 mins', '2-3 hours'" },
                  action: { type: Type.STRING, description: "Highly actionable task or milestone name, e.g., 'Fast Skeleton Research'" }
                },
                required: ["timeRange", "action"]
              }
            }
          },
          required: ["chanceOfMissing", "emergencyPlan"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);

  } catch (error: any) {
    console.error("Gemini Rescue Planner Error:", error);
    return res.status(500).json({ error: error.message });
  }
});


// ----------------------------------------------------
// FRONTEND SERVING & VITE INTEGRATION
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode serving static compiled React build
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Last Minute Life Saver] Server running on http://localhost:${PORT}`);
  });
}

startServer();
