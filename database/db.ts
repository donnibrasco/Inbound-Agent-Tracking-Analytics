import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'call_insights_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'call_insights_hub',
  password: process.env.DB_PASSWORD || 'SecurePass123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

// Call Metrics
export const getCallMetrics = async (category?: string) => {
  const text = category 
    ? 'SELECT * FROM call_metrics WHERE category = $1 ORDER BY id'
    : 'SELECT * FROM call_metrics ORDER BY id';
  const params = category ? [category] : [];
  const result = await query(text, params);
  return result.rows.map(row => ({
    label: row.label,
    value: row.value,
    subtext: row.subtext,
    change: parseFloat(row.change),
    trend: row.trend,
    icon: row.icon
  }));
};

// AI Agent Metrics
export const getAiAgentMetrics = async () => {
  const result = await query('SELECT * FROM ai_agent_metrics ORDER BY id');
  return result.rows;
};

// Agent Outcomes
export const getAgentOutcomes = async () => {
  const result = await query('SELECT * FROM agent_outcomes ORDER BY value DESC');
  return result.rows.map(row => ({
    name: row.name,
    value: row.value,
    color: row.color
  }));
};

// Volume Data
export const getVolumeData = async (days = 7) => {
  const result = await query(
    'SELECT * FROM volume_data ORDER BY date DESC LIMIT $1',
    [days]
  );
  return result.rows.reverse();
};

// Territories
export const getTerritories = async () => {
  const result = await query('SELECT * FROM territories ORDER BY territory_id');
  return result.rows.map(row => ({
    id: row.territory_id,
    name: row.name,
    clients: row.clients,
    revenue: parseFloat(row.revenue),
    growth: parseFloat(row.growth),
    status: row.status,
    coordinates: { lat: parseFloat(row.latitude), lng: parseFloat(row.longitude) },
    history: row.history
  }));
};

// Recent Calls
export const getRecentCalls = async (limit = 10) => {
  const result = await query(
    'SELECT * FROM recent_calls ORDER BY call_date DESC LIMIT $1',
    [limit]
  );
  return result.rows.map(row => ({
    id: row.call_id,
    caller: row.caller,
    phone: row.phone,
    duration: row.duration,
    outcome: row.outcome,
    interest: row.interest,
    type: row.type,
    time: row.time
  }));
};

// Outcome Data
export const getOutcomeData = async () => {
  const result = await query('SELECT * FROM outcome_data ORDER BY value DESC');
  return result.rows.map(row => ({
    name: row.name,
    value: row.value,
    color: row.color
  }));
};

// Attribution Sources
export const getAttributionSources = async () => {
  const result = await query('SELECT * FROM attribution_sources ORDER BY leads DESC');
  return result.rows.map(row => ({
    source: row.source,
    leads: row.leads,
    sessions: row.sessions,
    engaged: row.engaged,
    avgTime: row.avg_time,
    conversionRate: parseFloat(row.conversion_rate),
    booked: row.booked,
    revenue: parseFloat(row.revenue),
    color: row.color
  }));
};

// Attribution Trends
export const getAttributionTrends = async () => {
  const result = await query('SELECT * FROM attribution_trends ORDER BY id');
  return result.rows.map(row => ({
    date: row.date,
    'Organic Search': row.organic_search,
    'Meta Ads': row.meta_ads,
    'PPC Ads': row.ppc_ads,
    'YouTube Ads': row.youtube_ads,
    'TikTok Posts': row.tiktok_posts,
    'Facebook Marketplace': row.facebook_marketplace,
    'Referral': row.referral
  }));
};

// Add a new call
export const addRecentCall = async (callData: any) => {
  const text = `
    INSERT INTO recent_calls (call_id, caller, phone, duration, outcome, interest, type, time, call_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [
    callData.id || `call_${Date.now()}`,
    callData.caller,
    callData.phone,
    callData.duration,
    callData.outcome,
    callData.interest,
    callData.type,
    callData.time || 'Just now',
    new Date()
  ];
  const result = await query(text, values);
  return result.rows[0];
};

// Update metrics
export const updateMetric = async (label: string, value: string, change: number) => {
  const text = `
    UPDATE call_metrics 
    SET value = $1, change = $2, updated_at = CURRENT_TIMESTAMP
    WHERE label = $3
    RETURNING *
  `;
  const result = await query(text, [value, change, label]);
  return result.rows[0];
};

export default {
  query,
  getCallMetrics,
  getAiAgentMetrics,
  getAgentOutcomes,
  getVolumeData,
  getTerritories,
  getRecentCalls,
  getOutcomeData,
  getAttributionSources,
  getAttributionTrends,
  addRecentCall,
  updateMetric
};
