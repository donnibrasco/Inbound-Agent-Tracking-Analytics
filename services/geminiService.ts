import { GoogleGenAI, Type } from "@google/genai";
import { METRICS, VOLUME_DATA, TERRITORIES, ATTRIBUTION_SOURCES } from "../constants";
import { InsightData, RecentCall } from "../types";

export const analyzeDashboard = async (customPrompt?: string): Promise<InsightData | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const dataSummary = {
      metrics: METRICS,
      weeklyVolume: VOLUME_DATA,
      territories: TERRITORIES,
      marketingChannels: ATTRIBUTION_SOURCES
    };

    const contextString = JSON.stringify(dataSummary);
    const finalPrompt = customPrompt 
      ? `Data context: ${contextString}. \nUser Question: ${customPrompt}. \nProvide 3 specific data points or insights that answer the question, and one follow-up question.` 
      : `Analyze the following business call analytics data for 'Don'. \nData: ${contextString} \nProvide 3 key insights about performance, opportunities, and risks. Suggest a relevant follow-up question.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: finalPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: {
              type: Type.STRING,
              description: "A short context header for the analysis result."
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  icon: {
                    type: Type.STRING,
                    description: "Icon: 'trending-up', 'users', 'alert', 'check', 'clock'"
                  },
                  label: {
                    type: Type.STRING,
                    description: "Topic of the insight"
                  },
                  value: {
                    type: Type.STRING,
                    description: "Explanation of the insight"
                  }
                },
                required: ["icon", "label", "value"]
              }
            },
            followUp: {
              type: Type.STRING,
              description: "A follow-up question"
            }
          },
          required: ["header", "items", "followUp"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as InsightData;
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return {
      header: "Analysis Unavailable",
      items: [
        {
          icon: "alert",
          label: "Connection Error",
          value: "Unable to connect to the analysis server."
        }
      ],
      followUp: "Try again later"
    };
  }
};

export const summarizeCall = async (call: RecentCall): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Based on the following call details, generate a 1-sentence professional summary for a business log. Highlight the primary outcome and the key point discussed.
    
    Call Data:
    - Caller: ${call.caller}
    - Duration: ${call.duration}
    - Status: ${call.outcome}
    - Interest: ${call.interest}
    - Direction: ${call.type}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.text || "Summary unavailable.";
  } catch (error) {
    console.error("Error generating call summary:", error);
    return "Could not generate summary.";
  }
};