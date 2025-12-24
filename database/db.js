import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'call_insights_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'call_insights_hub',
  password: process.env.DB_PASSWORD || 'SecurePass123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text, params) => pool.query(text, params);

// Call Metrics - Calculate from real call_recordings data
export const getCallMetrics = async (category) => {
  // Calculate real metrics from call_recordings table
  const result = await query(`
    SELECT 
      COUNT(*) as total_calls,
      COUNT(*) FILTER (WHERE appointment_booked = true) as booked,
      COUNT(*) FILTER (WHERE lead_quality IN ('Hot', 'Warm')) as qualified_leads,
      ROUND(AVG(duration_seconds)) as avg_duration
    FROM call_recordings
    WHERE ai_assistant_id = $1
  `, [process.env.TELNYX_AI_ASSISTANT_ID]);
  
  const stats = result.rows[0];
  const totalCalls = parseInt(stats.total_calls) || 0;
  const booked = parseInt(stats.booked) || 0;
  const qualified = parseInt(stats.qualified_leads) || 0;
  const avgDuration = parseInt(stats.avg_duration) || 0;
  const conversionRate = totalCalls > 0 ? Math.round((booked / totalCalls) * 100) : 0;
  
  const metrics = [
    {
      label: 'Total Inbound Calls',
      value: totalCalls.toString(),
      subtext: 'This month',
      change: 0,
      trend: 'up',
      icon: 'Phone'
    },
    {
      label: 'Appointments Booked',
      value: booked.toString(),
      subtext: `${conversionRate}% conversion`,
      change: 0,
      trend: 'up',
      icon: 'Calendar'
    },
    {
      label: 'Qualified Leads',
      value: qualified.toString(),
      subtext: 'Hot & Warm leads',
      change: 0,
      trend: 'up',
      icon: 'TrendingUp'
    },
    {
      label: 'Avg Call Duration',
      value: `${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`,
      subtext: 'Per conversation',
      change: 0,
      trend: 'neutral',
      icon: 'Clock'
    }
  ];
  
  return metrics;
};

// AI Agent Metrics - Calculate from real data
export const getAiAgentMetrics = async () => {
  const result = await query(`
    SELECT 
      COUNT(*) as total_calls,
      ROUND(AVG(duration_seconds)) as avg_duration,
      COUNT(*) FILTER (WHERE ai_sentiment = 'positive') as positive_calls,
      COUNT(*) FILTER (WHERE appointment_booked = true) as appointments
    FROM call_recordings
    WHERE ai_assistant_id = $1
  `, [process.env.TELNYX_AI_ASSISTANT_ID]);
  
  const stats = result.rows[0];
  const totalCalls = parseInt(stats.total_calls) || 0;
  const satisfaction = totalCalls > 0 ? Math.round((parseInt(stats.positive_calls) / totalCalls) * 100) : 0;
  
  return [
    { label: 'Total Conversations', value: totalCalls.toString(), icon: 'MessageSquare' },
    { label: 'Avg Duration', value: `${Math.floor(stats.avg_duration / 60)}m`, icon: 'Clock' },
    { label: 'Satisfaction Rate', value: `${satisfaction}%`, icon: 'ThumbsUp' },
    { label: 'Appointments Set', value: stats.appointments.toString(), icon: 'Calendar' }
  ];
};

// Agent Outcomes - Calculate from real data
export const getAgentOutcomes = async () => {
  const result = await query(`
    SELECT 
      lead_quality as name,
      COUNT(*) as value
    FROM call_recordings
    WHERE ai_assistant_id = $1 AND lead_quality IS NOT NULL
    GROUP BY lead_quality
    ORDER BY value DESC
  `, [process.env.TELNYX_AI_ASSISTANT_ID]);
  
  const colorMap = {
    'Hot': '#ef4444',
    'Warm': '#f59e0b',
    'Cold': '#3b82f6',
    'No Answer': '#6b7280'
  };
  
  return result.rows.map(row => ({
    name: row.name,
    value: parseInt(row.value),
    color: colorMap[row.name] || '#6b7280'
  }));
};

// Volume Data - Calculate from real call_recordings
export const getVolumeData = async (days = 7) => {
  const result = await query(`
    SELECT 
      DATE(start_time) as date,
      COUNT(*) as leads,
      COUNT(*) FILTER (WHERE appointment_booked = true) as booked
    FROM call_recordings
    WHERE ai_assistant_id = $1
      AND start_time >= NOW() - INTERVAL '${days} days'
    GROUP BY DATE(start_time)
    ORDER BY date ASC
  `, [process.env.TELNYX_AI_ASSISTANT_ID]);
  
  return result.rows.map(row => ({
    date: row.date,
    leads: parseInt(row.leads),
    booked: parseInt(row.booked)
  }));
};

// Territories - Calculate from call phone numbers
export const getTerritories = async () => {
  try {
    const result = await query(`
      SELECT 
        from_number,
        COUNT(*) as call_count
      FROM call_recordings
      WHERE ai_assistant_id = $1
        AND from_number IS NOT NULL
      GROUP BY from_number
      ORDER BY call_count DESC
    `, [process.env.TELNYX_AI_ASSISTANT_ID]);
    
    // Map area codes to locations (North America)
    const areaCodeMap = {
      '825': { name: 'Calgary, AB', lat: 51.0447, lng: -114.0719, province: 'Alberta, Canada' },
      '403': { name: 'Calgary, AB', lat: 51.0447, lng: -114.0719, province: 'Alberta, Canada' },
      '587': { name: 'Edmonton, AB', lat: 53.5461, lng: -113.4938, province: 'Alberta, Canada' },
      '780': { name: 'Edmonton, AB', lat: 53.5461, lng: -113.4938, province: 'Alberta, Canada' },
      '604': { name: 'Vancouver, BC', lat: 49.2827, lng: -123.1207, province: 'British Columbia, Canada' },
      '778': { name: 'Vancouver, BC', lat: 49.2827, lng: -123.1207, province: 'British Columbia, Canada' },
      '416': { name: 'Toronto, ON', lat: 43.6532, lng: -79.3832, province: 'Ontario, Canada' },
      '647': { name: 'Toronto, ON', lat: 43.6532, lng: -79.3832, province: 'Ontario, Canada' },
      '306': { name: 'Saskatchewan', lat: 50.4452, lng: -104.6189, province: 'Saskatchewan, Canada' },
      // Add more area codes as needed
    };
    
    return result.rows.map((row, index) => {
      // Extract area code from phone number (digits 2-4 after country code)
      const phoneClean = row.from_number.replace(/\D/g, '');
      const areaCode = phoneClean.substring(1, 4); // Skip country code (1), get next 3 digits
      const location = areaCodeMap[areaCode] || { 
        name: `Area ${areaCode}`, 
        lat: 45 + (index * 2), 
        lng: -100 + (index * 3),
        province: 'Unknown'
      };
      
      const callCount = parseInt(row.call_count);
      
      return {
        id: String(index + 1),
        name: location.name,
        clients: callCount,
        revenue: 0, // Can be calculated based on conversion
        growth: 0,
        status: callCount > 2 ? 'High' : 'Low',
        coordinates: { lat: location.lat, lng: location.lng },
        history: [callCount] // Array of numbers for sparkline
      };
    });
  } catch (error) {
    console.error('Error fetching territories:', error);
    return [];
  }
};

// Recent Calls - Get from call_recordings
export const getRecentCalls = async (limit = 10) => {
  const result = await query(
    `SELECT * FROM call_recordings 
     WHERE ai_assistant_id = $1 
     ORDER BY start_time DESC LIMIT $2`,
    [process.env.TELNYX_AI_ASSISTANT_ID, limit]
  );
  return result.rows.map(row => ({
    id: row.id,
    caller: row.from_number,
    phone: row.from_number,
    duration: `${Math.floor(row.duration_seconds / 60)}m ${row.duration_seconds % 60}s`,
    outcome: row.lead_quality || 'Unknown',
    interest: row.lead_quality === 'Hot' ? 'High' : row.lead_quality === 'Warm' ? 'Medium' : 'Low',
    type: row.direction === 'incoming' ? 'Inbound' : 'Outbound',
    time: row.start_time
  }));
};

// Outcome Data (same as agent outcomes)
export const getOutcomeData = async () => {
  return getAgentOutcomes();
};

// Attribution Sources - Return empty (no marketing data yet)
export const getAttributionSources = async () => {
  return [];
};

// Attribution Trends - Return empty (no marketing data yet)
export const getAttributionTrends = async () => {
  return [];
};


// Add a new call
export const addRecentCall = async (callData) => {
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
export const updateMetric = async (label, value, change) => {
  const text = `
    UPDATE call_metrics 
    SET value = $1, change = $2, updated_at = CURRENT_TIMESTAMP
    WHERE label = $3
    RETURNING *
  `;
  const result = await query(text, [value, change, label]);
  return result.rows[0];
};

// Call Recordings - New methods for call history with recordings
export const getCallRecordings = async (filters = {}) => {
  let query_text = 'SELECT * FROM call_recordings WHERE 1=1';
  const params = [];
  let paramCounter = 1;

  // Filter by AI assistant ID if provided
  if (filters.ai_assistant_id) {
    query_text += ` AND ai_assistant_id = $${paramCounter}`;
    params.push(filters.ai_assistant_id);
    paramCounter++;
  }

  if (filters.direction && filters.direction !== 'all') {
    query_text += ` AND direction = $${paramCounter}`;
    params.push(filters.direction);
    paramCounter++;
  }

  if (filters.leadQuality) {
    query_text += ` AND lead_quality = $${paramCounter}`;
    params.push(filters.leadQuality);
    paramCounter++;
  }

  if (filters.hasRecording) {
    query_text += ` AND recording_available = true`;
  }

  if (filters.hasTranscript) {
    query_text += ` AND transcript_available = true`;
  }

  query_text += ' ORDER BY start_time DESC LIMIT 100';

  const result = await query(query_text, params);
  return result.rows;
};

export const addCallRecording = async (callData) => {
  const text = `
    INSERT INTO call_recordings (
      call_control_id, call_session_id, call_leg_id,
      from_number, to_number, direction,
      start_time, answer_time, end_time, duration_seconds,
      status, hangup_cause, hangup_source,
      ai_assistant_used, ai_assistant_id, ai_conversation_id, ai_summary, ai_sentiment, ai_intent, ai_outcome,
      recording_url, recording_id, recording_duration, recording_status, recording_available,
      transcript, transcript_available,
      caller_name, caller_company, tags, notes,
      cost_amount, cost_currency,
      lead_quality, follow_up_required, follow_up_date, appointment_booked,
      raw_webhook_data
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
      $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38
    )
    ON CONFLICT (call_control_id) 
    DO UPDATE SET
      answer_time = EXCLUDED.answer_time,
      end_time = EXCLUDED.end_time,
      duration_seconds = EXCLUDED.duration_seconds,
      status = EXCLUDED.status,
      hangup_cause = EXCLUDED.hangup_cause,
      hangup_source = EXCLUDED.hangup_source,
      ai_assistant_id = COALESCE(EXCLUDED.ai_assistant_id, call_recordings.ai_assistant_id),
      ai_summary = EXCLUDED.ai_summary,
      ai_sentiment = EXCLUDED.ai_sentiment,
      ai_outcome = EXCLUDED.ai_outcome,
      recording_url = EXCLUDED.recording_url,
      recording_available = EXCLUDED.recording_available,
      transcript = EXCLUDED.transcript,
      transcript_available = EXCLUDED.transcript_available,
      lead_quality = EXCLUDED.lead_quality,
      appointment_booked = EXCLUDED.appointment_booked,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  const values = [
    callData.call_control_id,
    callData.call_session_id || null,
    callData.call_leg_id || null,
    callData.from_number,
    callData.to_number,
    callData.direction,
    callData.start_time,
    callData.answer_time || null,
    callData.end_time || null,
    callData.duration_seconds || 0,
    callData.status || 'completed',
    callData.hangup_cause || null,
    callData.hangup_source || null,
    callData.ai_assistant_used || false,
    callData.ai_assistant_id || null,
    callData.ai_conversation_id || null,
    callData.ai_summary || null,
    callData.ai_sentiment || null,
    callData.ai_intent || null,
    callData.ai_outcome || null,
    callData.recording_url || null,
    callData.recording_id || null,
    callData.recording_duration || null,
    callData.recording_status || null,
    callData.recording_available || false,
    callData.transcript || null,
    callData.transcript_available || false,
    callData.caller_name || null,
    callData.caller_company || null,
    callData.tags || null,
    callData.notes || null,
    callData.cost_amount || null,
    callData.cost_currency || 'USD',
    callData.lead_quality || null,
    callData.follow_up_required || false,
    callData.follow_up_date || null,
    callData.appointment_booked || false,
    callData.raw_webhook_data ? JSON.stringify(callData.raw_webhook_data) : null
  ];

  const result = await query(text, values);
  return result.rows[0];
};

export const updateCallRecording = async (callControlId, updates) => {
  const fields = [];
  const values = [];
  let paramCounter = 1;

  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      fields.push(`${key} = $${paramCounter}`);
      values.push(updates[key]);
      paramCounter++;
    }
  });

  if (fields.length === 0) return null;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(callControlId);

  const text = `
    UPDATE call_recordings 
    SET ${fields.join(', ')}
    WHERE call_control_id = $${paramCounter}
    RETURNING *
  `;

  const result = await query(text, values);
  return result.rows[0];
};

export const getCallRecordingByControlId = async (callControlId) => {
  const result = await query(
    'SELECT * FROM call_recordings WHERE call_control_id = $1',
    [callControlId]
  );
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
  updateMetric,
  getCallRecordings,
  addCallRecording,
  updateCallRecording,
  getCallRecordingByControlId
};
