-- Database Schema for Call Insights Hub

-- Call Metrics Table
CREATE TABLE IF NOT EXISTS call_metrics (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    value VARCHAR(50) NOT NULL,
    subtext VARCHAR(100),
    change DECIMAL(5,2),
    trend VARCHAR(10) CHECK (trend IN ('up', 'down')),
    icon VARCHAR(50),
    category VARCHAR(50) DEFAULT 'main',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Agent Metrics Table
CREATE TABLE IF NOT EXISTS ai_agent_metrics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    inbound INTEGER,
    outbound INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent Outcomes Table
CREATE TABLE IF NOT EXISTS agent_outcomes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    value INTEGER,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volume Data Table (Weekly/Daily stats)
CREATE TABLE IF NOT EXISTS volume_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    calls INTEGER,
    bookings INTEGER,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Territories Table
CREATE TABLE IF NOT EXISTS territories (
    id SERIAL PRIMARY KEY,
    territory_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    clients INTEGER,
    revenue DECIMAL(10,2),
    growth DECIMAL(5,2),
    status VARCHAR(20) CHECK (status IN ('High', 'Medium', 'Low')),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    history JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recent Calls Table
CREATE TABLE IF NOT EXISTS recent_calls (
    id SERIAL PRIMARY KEY,
    call_id VARCHAR(20) UNIQUE NOT NULL,
    caller VARCHAR(100),
    phone VARCHAR(20),
    duration VARCHAR(20),
    outcome VARCHAR(50) CHECK (outcome IN ('Booked', 'Follow Up', 'Not Interested', 'Interested', 'Transferred', 'Resolved')),
    interest VARCHAR(20) CHECK (interest IN ('High', 'Medium', 'Low')),
    type VARCHAR(20) CHECK (type IN ('Inbound', 'Outbound')),
    time VARCHAR(50),
    call_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Outcome Data Table
CREATE TABLE IF NOT EXISTS outcome_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    value INTEGER,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attribution Sources Table
CREATE TABLE IF NOT EXISTS attribution_sources (
    id SERIAL PRIMARY KEY,
    source VARCHAR(100) NOT NULL,
    leads INTEGER,
    sessions INTEGER,
    engaged INTEGER,
    avg_time VARCHAR(20),
    conversion_rate DECIMAL(5,2),
    booked INTEGER,
    revenue DECIMAL(10,2),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attribution Trends Table
CREATE TABLE IF NOT EXISTS attribution_trends (
    id SERIAL PRIMARY KEY,
    date VARCHAR(20) NOT NULL,
    organic_search INTEGER,
    meta_ads INTEGER,
    ppc_ads INTEGER,
    youtube_ads INTEGER,
    tiktok_posts INTEGER,
    facebook_marketplace INTEGER,
    referral INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_territories_status ON territories(status);
CREATE INDEX idx_recent_calls_outcome ON recent_calls(outcome);
CREATE INDEX idx_recent_calls_type ON recent_calls(type);
CREATE INDEX idx_attribution_sources_source ON attribution_sources(source);
CREATE INDEX idx_volume_data_date ON volume_data(date);
