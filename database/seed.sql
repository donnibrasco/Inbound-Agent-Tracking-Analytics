-- Seed Data for Call Insights Hub

-- Call Metrics
INSERT INTO call_metrics (label, value, subtext, change, trend, icon, category) VALUES
('Total AI Calls', '842', 'This month', 24, 'up', 'cpu', 'main'),
('Avg Talk Time', '4:18', 'Engagement avg', 12, 'up', 'mic', 'main'),
('Connection Rate', '92%', 'Successful pick-ups', 4, 'up', 'activity', 'main'),
('Booking Rate', '41%', 'AI-led conversions', 8, 'up', 'calendar', 'main'),
('Sentiment Score', '8.4', 'Out of 10.0', 5, 'up', 'message-square', 'ai_detailed'),
('Avg Turns', '12', 'Per call session', 15, 'up', 'activity', 'ai_detailed'),
('Transfer Rate', '14%', 'Escalated to human', -2, 'down', 'phone', 'ai_detailed'),
('Latency', '640ms', 'Response speed', -12, 'down', 'clock', 'ai_detailed');

-- AI Agent Metrics
INSERT INTO ai_agent_metrics (name, inbound, outbound) VALUES
('Connection %', 98, 86),
('Talk Time (s)', 280, 195),
('Resolution %', 72, 55),
('Turns Taken', 12, 8);

-- Agent Outcomes
INSERT INTO agent_outcomes (name, value, color) VALUES
('Booked', 340, '#10b981'),
('Resolved', 210, '#3b82f6'),
('Transferred', 180, '#f59e0b'),
('Dropped', 112, '#ef4444');

-- Volume Data
INSERT INTO volume_data (name, calls, bookings, date) VALUES
('Mon', 125, 48, CURRENT_DATE - INTERVAL '6 days'),
('Tue', 132, 52, CURRENT_DATE - INTERVAL '5 days'),
('Wed', 128, 50, CURRENT_DATE - INTERVAL '4 days'),
('Thu', 142, 58, CURRENT_DATE - INTERVAL '3 days'),
('Fri', 138, 55, CURRENT_DATE - INTERVAL '2 days'),
('Sat', 120, 46, CURRENT_DATE - INTERVAL '1 day'),
('Sun', 115, 44, CURRENT_DATE);

-- Territories
INSERT INTO territories (territory_id, name, clients, revenue, growth, status, latitude, longitude, history) VALUES
('1', 'North Dallas', 45, 12400, 89, 'High', 32.91, -96.79, '[40, 55, 45, 60, 75, 89]'::jsonb),
('2', 'Downtown', 28, 8200, 72, 'Medium', 32.7767, -96.7970, '[30, 40, 35, 50, 65, 72]'::jsonb),
('3', 'East Dallas', 32, 9800, 95, 'High', 32.82, -96.73, '[50, 55, 65, 70, 85, 95]'::jsonb),
('4', 'West Dallas', 18, 4500, -45, 'Low', 32.78, -96.88, '[60, 50, 40, 20, 10, -45]'::jsonb),
('5', 'South Dallas', 22, 5900, -58, 'Low', 32.68, -96.80, '[40, 30, 20, 10, -20, -58]'::jsonb),
('6', 'SE Dallas', 38, 11200, 82, 'High', 32.72, -96.68, '[20, 30, 50, 60, 70, 82]'::jsonb);

-- Recent Calls
INSERT INTO recent_calls (call_id, caller, phone, duration, outcome, interest, type, time, call_date) VALUES
('1', 'John Smith', '+1 (555) 123-4567', '4:32', 'Booked', 'High', 'Inbound', '2 min ago', NOW() - INTERVAL '2 minutes'),
('2', 'Sarah Johnson', '+1 (555) 234-5678', '2:15', 'Transferred', 'Medium', 'Outbound', '15 min ago', NOW() - INTERVAL '15 minutes'),
('3', 'Mike Davis', '+1 (555) 345-6789', '6:48', 'Booked', 'High', 'Inbound', '32 min ago', NOW() - INTERVAL '32 minutes'),
('4', 'Emily Brown', '+1 (555) 456-7890', '1:23', 'Not Interested', 'Low', 'Outbound', '1 hr ago', NOW() - INTERVAL '1 hour'),
('5', 'David Wilson', '+1 (555) 567-8901', '5:12', 'Resolved', 'High', 'Inbound', '2 hrs ago', NOW() - INTERVAL '2 hours');

-- Outcome Data
INSERT INTO outcome_data (name, value, color) VALUES
('Booked', 38, '#22c55e'),
('Interested', 25, '#14b8a6'),
('Follow Up', 20, '#f59e0b'),
('Not Interested', 17, '#ef4444');

-- Attribution Sources
INSERT INTO attribution_sources (source, leads, sessions, engaged, avg_time, conversion_rate, booked, revenue, color) VALUES
('Organic Search', 2126, 4247, 2674, '35s', 15.18, 322, 5553.11, '#10b981'),
('Meta Ads', 5126, 11247, 4456, '39s', 8.86, 454, 8993.83, '#8b5cf6'),
('PPC Ads', 1540, 3036, 1156, '43s', 12.04, 185, 3771.95, '#3b82f6'),
('YouTube Ads', 899, 1601, 632, '40s', 9.22, 83, 1187.30, '#ef4444'),
('TikTok Posts', 642, 1034, 501, '35s', 19.10, 122, 1291.24, '#ec4899'),
('Facebook Marketplace', 430, 850, 320, '55s', 22.4, 96, 2100.50, '#6366f1'),
('Referral', 320, 520, 480, '1m 12s', 45.5, 145, 4500.00, '#f59e0b');

-- Attribution Trends
INSERT INTO attribution_trends (date, organic_search, meta_ads, ppc_ads, youtube_ads, tiktok_posts, facebook_marketplace, referral) VALUES
('04 Feb', 150, 280, 80, 40, 30, 20, 15),
('08 Feb', 180, 320, 90, 45, 50, 25, 20),
('12 Feb', 160, 300, 110, 35, 70, 30, 25),
('16 Feb', 210, 450, 120, 60, 60, 35, 30),
('20 Feb', 190, 380, 130, 70, 90, 40, 45),
('24 Feb', 240, 410, 115, 65, 80, 45, 40),
('28 Feb', 280, 490, 140, 80, 100, 50, 60);
