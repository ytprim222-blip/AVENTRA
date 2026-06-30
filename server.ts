import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Full-stack API endpoint to generate custom luxury event scripts & timelines
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { eventType, aestheticTheme, customVision, guestCount, location } = req.body;

    const systemPrompt = `You are the Lead Creative Director and Master Event Producer for AVENTRA, the world's most prestigious, ultra-premium event production agency. 
We don't just organize events; we create history.
Given an event outline from an elite client, you must construct a cinematic storyboard extension (Scene 6) that fits seamlessly into the AVENTRA commercial narrative, plus a highly-detailed, hour-by-hour operational countdown timeline leading to the moment of launch.`;

    const userPrompt = `Generate a customized luxurious Scene 6 storyboard extension and operational plan for a client's dream event:
- **Event Category**: ${eventType || "Bespoke Gala"}
- **Design Aesthetic & Mood**: ${aestheticTheme || "Black & Gold Cinematic Elegance"}
- **Client's Custom Vision**: ${customVision || "An immersive, multi-sensory environment pushing the boundaries of technology and human artistry."}
- **Scale**: ${guestCount || "500 VIP Guests"}
- **Location**: ${location || "Exclusive private island / Glass Pavilion"}

Provide the response in structured JSON matching this schema:
{
  "sceneTitle": "Name of this Scene (e.g., 'THE COVENT GARDEN METAMORPHOSIS')",
  "visualDescription": "Detailed visual description of the cinematic sequence, camera movements (slow-mo, anamorphic flares), lighting, and design cues.",
  "voiceoverText": "A poetic, deep, powerful cinematic voiceover statement matching the epic AVENTRA aesthetic.",
  "musicCrescendo": "Music cues and sound design directions for this specific high-intensity moment.",
  "timeline": [
    {
      "phase": "e.g., Phase I: Digital Rendering & Rigging",
      "hours": "T-Minus 48 Hours",
      "description": "What the AVENTRA team is executing behind-the-scenes (pyrotechnics, lighting grids, botanical staging).",
      "keyDeliverable": "The core milestone achieved."
    },
    {
      "phase": "e.g., Phase II: Immersive Calibration",
      "hours": "T-Minus 24 Hours",
      "description": "Orchestral audio tuning, laser alignment, soundcheck with the artists, sensory triggers.",
      "keyDeliverable": "The core milestone achieved."
    },
    {
      "phase": "e.g., Phase III: The VIP Unveiling",
      "hours": "T-Minus 1 Hour to Live",
      "description": "Red carpet arrival, custom scent dispersion, ambient lighting transition, final countdown.",
      "keyDeliverable": "The core milestone achieved."
    }
  ],
  "luxuryCurationInsights": "A paragraph from the Master Curation team describing how we elevate this from a simple event to an unforgettable historical moment."
}`;

    const client = getAiClient();
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sceneTitle: { type: Type.STRING },
            visualDescription: { type: Type.STRING },
            voiceoverText: { type: Type.STRING },
            musicCrescendo: { type: Type.STRING },
            luxuryCurationInsights: { type: Type.STRING },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  hours: { type: Type.STRING },
                  description: { type: Type.STRING },
                  keyDeliverable: { type: Type.STRING },
                },
                required: ["phase", "hours", "description", "keyDeliverable"],
              }
            }
          },
          required: ["sceneTitle", "visualDescription", "voiceoverText", "musicCrescendo", "timeline", "luxuryCurationInsights"],
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini production error:", error);
    res.status(500).json({ 
      error: "Failed to generate cinematic storyboard", 
      details: error.message 
    });
  }
});

// Configure Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AVENTRA Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
