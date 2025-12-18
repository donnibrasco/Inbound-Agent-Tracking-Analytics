import { METRICS, VOLUME_DATA, TERRITORIES, ATTRIBUTION_SOURCES } from "../constants";
import { InsightData } from "../types";

export const analyzeDashboard = async (customPrompt?: string): Promise<InsightData | null> => {
  try {
    // Prepare a summary of the data to send to the backend
    const dataSummary = {
      metrics: METRICS,
      weeklyVolume: VOLUME_DATA,
      territories: TERRITORIES,
      marketingChannels: ATTRIBUTION_SOURCES
    };

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataContext: dataSummary,
        userQuery: customPrompt
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data as InsightData;

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