-- Call Recordings Table for Telnyx AI Assistant
-- Stores detailed call history including recordings, transcripts, and AI interactions

CREATE TABLE IF NOT EXISTS call_recordings (
    id SERIAL PRIMARY KEY,
    call_control_id VARCHAR(255) UNIQUE NOT NULL,
    call_session_id VARCHAR(255),
    call_leg_id VARCHAR(255),
    
    -- Call Details
    from_number VARCHAR(50),
    to_number VARCHAR(50),
    direction VARCHAR(20) CHECK (direction IN ('incoming', 'outgoing')),
    
    -- Timing Information
    start_time TIMESTAMP,
    answer_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    
    -- Call Status
    status VARCHAR(50),
    hangup_cause VARCHAR(100),
    hangup_source VARCHAR(50),
    
    -- AI Assistant Data
    ai_assistant_used BOOLEAN DEFAULT FALSE,
    ai_conversation_id VARCHAR(255),
    ai_summary TEXT,
    ai_sentiment VARCHAR(50),
    ai_intent TEXT,
    ai_outcome VARCHAR(100),
    
    -- Recording Information
    recording_url TEXT,
    recording_id VARCHAR(255),
    recording_duration INTEGER,
    recording_status VARCHAR(50),
    recording_available BOOLEAN DEFAULT FALSE,
    
    -- Transcript
    transcript TEXT,
    transcript_available BOOLEAN DEFAULT FALSE,
    
    -- Additional Metadata
    caller_name VARCHAR(255),
    caller_company VARCHAR(255),
    tags TEXT[],
    notes TEXT,
    
    -- Cost Tracking
    cost_amount DECIMAL(10,4),
    cost_currency VARCHAR(10) DEFAULT 'USD',
    
    -- Business Classification
    lead_quality VARCHAR(20) CHECK (lead_quality IN ('Hot', 'Warm', 'Cold', 'Not Qualified')),
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP,
    appointment_booked BOOLEAN DEFAULT FALSE,
    
    -- System
    raw_webhook_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_call_recordings_start_time ON call_recordings(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_call_recordings_from_number ON call_recordings(from_number);
CREATE INDEX IF NOT EXISTS idx_call_recordings_direction ON call_recordings(direction);
CREATE INDEX IF NOT EXISTS idx_call_recordings_status ON call_recordings(status);
CREATE INDEX IF NOT EXISTS idx_call_recordings_lead_quality ON call_recordings(lead_quality);
CREATE INDEX IF NOT EXISTS idx_call_recordings_recording_available ON call_recordings(recording_available);

-- Create view for easy querying of recent calls with recordings
CREATE OR REPLACE VIEW recent_calls_with_recordings AS
SELECT 
    id,
    call_control_id,
    from_number,
    to_number,
    direction,
    start_time,
    duration_seconds,
    status,
    hangup_cause,
    ai_assistant_used,
    ai_summary,
    ai_sentiment,
    ai_outcome,
    recording_url,
    recording_available,
    transcript_available,
    caller_name,
    lead_quality,
    follow_up_required,
    appointment_booked,
    created_at
FROM call_recordings
ORDER BY start_time DESC;
