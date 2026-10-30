import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// AI Hint Endpoint for Lean Proofs
app.post('/api/ai-hint', async (req, res) => {
  try {
    const { theoremStatement, currentCode, goalState, error } = req.body;

    if (!apiKey) {
      return res.status(500).json({ 
        hint: "AI API key is not configured. Please add GEMINI_API_KEY in secrets to get AI hints!" 
      });
    }

    const prompt = `You are an expert Lean 4 theorem prover tutor. A student is trying to prove the following theorem:
Theorem: ${theoremStatement}

Current code:
\`\`\`lean
${currentCode}
\`\`\`

Current goal state:
${JSON.stringify(goalState)}

Current compiler error or status: ${error || 'None'}

Provide a concise, helpful pedagogical hint (max 3 sentences) to guide the student to the next correct Lean 4 tactic without giving away the complete solution directly. Be encouraging and clear.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const hint = response.text || "Try breaking down the goal or using appropriate tactics like intro, exact, or omega.";
    res.json({ hint });
  } catch (err: any) {
    console.error('AI Hint Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate AI hint' });
  }
});

// AI Explain Tactic or Error Endpoint
app.post('/api/ai-explain', async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!apiKey) {
      return res.status(500).json({ 
        explanation: "AI API key is not configured." 
      });
    }

    const prompt = `You are a Lean 4 expert. Explain the following concept, tactic, or error clearly with code examples:
Query: ${query}
Context: ${context || ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ explanation: response.text });
  } catch (err: any) {
    console.error('AI Explain Error:', err);
    res.status(500).json({ error: err.message || 'Failed to explain' });
  }
});

// Multi-turn Gemini Chatbot Endpoint for Lean 4 Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user' | 'model', content: string }

    if (!apiKey) {
      return res.status(500).json({
        reply: "API key not configured. Please set GEMINI_API_KEY in secrets."
      });
    }

    // Convert message history to the format expected by GoogleGenAI chats or generateContent with history
    const systemInstruction = "You are LambdaTutor, an elite AI assistant and expert in Lean 4 theorem proving, formal logic, type theory, and mathlib. Your role is to help students write correct Lean 4 proofs, explain tactics (intro, exact, apply, rcases, rw, omega, linarith), debug error messages, and foster mathematical intuition. Keep explanations clear, precise, and educational.";

    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
      }
    });

    res.json({ reply: response.text || "I'm here to help you prove theorems in Lean 4!" });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    res.status(500).json({ error: err.message || 'Chat generation failed' });
  }
});

// AI Dynamic Question Generator Endpoint (Brilliant / Kinnu style)
app.post('/api/generate-question', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured." });
    }

    const prompt = `You are an expert Lean 4 curriculum designer. Generate a brand new, unique theorem-proving question for topic "${topic || 'Propositional Logic'}" and difficulty "${difficulty || 'Intermediate'}".
Return ONLY valid JSON (no markdown block, just raw JSON) matching this exact schema:
{
  "title": "string",
  "theoremStatement": "string",
  "prompt": "string",
  "codeSnippet": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string",
  "explanation": "string",
  "xpReward": 50
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let text = response.text || '{}';
    // Clean potential markdown formatting
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const questionObj = JSON.parse(text);

    res.json(questionObj);
  } catch (err: any) {
    console.error('Question Generation Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate question' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`LeanCraft server running on port ${PORT}`);
  });
}

startServer();
