// Data service for fetching from API endpoints

const API_BASE = '';

export const fetchMetrics = async (category?: string) => {
  const url = category ? `${API_BASE}/api/metrics?category=${category}` : `${API_BASE}/api/metrics`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch metrics');
  return response.json();
};

export const fetchAiMetrics = async () => {
  const response = await fetch(`${API_BASE}/api/ai-metrics`);
  if (!response.ok) throw new Error('Failed to fetch AI metrics');
  return response.json();
};

export const fetchAgentOutcomes = async () => {
  const response = await fetch(`${API_BASE}/api/agent-outcomes`);
  if (!response.ok) throw new Error('Failed to fetch agent outcomes');
  return response.json();
};

export const fetchVolumeData = async (days = 7) => {
  const response = await fetch(`${API_BASE}/api/volume-data?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch volume data');
  return response.json();
};

export const fetchTerritories = async () => {
  const response = await fetch(`${API_BASE}/api/territories`);
  if (!response.ok) throw new Error('Failed to fetch territories');
  return response.json();
};

export const fetchRecentCalls = async (limit = 10) => {
  const response = await fetch(`${API_BASE}/api/recent-calls?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch recent calls');
  return response.json();
};

export const fetchOutcomeData = async () => {
  const response = await fetch(`${API_BASE}/api/outcome-data`);
  if (!response.ok) throw new Error('Failed to fetch outcome data');
  return response.json();
};

export const fetchAttributionSources = async () => {
  const response = await fetch(`${API_BASE}/api/attribution-sources`);
  if (!response.ok) throw new Error('Failed to fetch attribution sources');
  return response.json();
};

export const fetchAttributionTrends = async () => {
  const response = await fetch(`${API_BASE}/api/attribution-trends`);
  if (!response.ok) throw new Error('Failed to fetch attribution trends');
  return response.json();
};

export const addCall = async (callData: any) => {
  const response = await fetch(`${API_BASE}/api/calls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(callData)
  });
  if (!response.ok) throw new Error('Failed to add call');
  return response.json();
};

export const updateMetric = async (label: string, value: string, change: number) => {
  const response = await fetch(`${API_BASE}/api/metrics/${encodeURIComponent(label)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, change })
  });
  if (!response.ok) throw new Error('Failed to update metric');
  return response.json();
};

export default {
  fetchMetrics,
  fetchAiMetrics,
  fetchAgentOutcomes,
  fetchVolumeData,
  fetchTerritories,
  fetchRecentCalls,
  fetchOutcomeData,
  fetchAttributionSources,
  fetchAttributionTrends,
  addCall,
  updateMetric
};
