import { InsightData, RecentCall } from "../types";

export const analyzeDashboard = async (customPrompt?: string): Promise<InsightData | null> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userQuery: customPrompt 
      })
    });

    if (!response.ok) throw new Error('Failed to fetch analysis');
    
    return await response.json();
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
    const response = await fetch('/api/summarize-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ call })
    });

    if (!response.ok) throw new Error('Failed to generate summary');
    
    const data = await response.json();
    return data.summary || "Summary unavailable.";
  } catch (error) {
    console.error("Error generating call summary:", error);
    return "Could not generate summary.";
  }
};