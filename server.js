import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { dataContext, userQuery } = req.body;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Server API Key configuration missing' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contextString = JSON.stringify(dataContext);
    
    const basePrompt = `
      Analyze the following business call analytics data for 'Don'.
      
      Data:
      ${contextString}
      
      Task:
      Provide 3 key insights about performance, opportunities, and risks.
      Suggest a relevant follow-up question.
      
      Output JSON format matching the schema.
    `;

    const finalPrompt = userQuery 
      ? `Data context: ${contextString}. \nUser Question: ${userQuery}. \nProvide 3 specific data points or insights that answer the question, and one follow-up question.` 
      : basePrompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: { 
              type: Type.STRING, 
              description: "A short context header, e.g., 'Based on the latest data:'" 
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  icon: { 
                    type: Type.STRING, 
                    description: "Select most appropriate visual: 'trending-up', 'users', 'alert', 'check', 'clock'" 
                  },
                  label: { 
                    type: Type.STRING, 
                    description: "The bold topic title, e.g., 'Team Workload', 'Conversion Rate'" 
                  },
                  value: { 
                    type: Type.STRING, 
                    description: "The detailed explanation text." 
                  }
                },
                required: ["icon", "label", "value"]
              }
            },
            followUp: { 
              type: Type.STRING, 
              description: "A suggested next question for the user to ask" 
            }
          },
          required: ["header", "items", "followUp"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    res.json(JSON.parse(text));

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

// Catch-all route to serve React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});