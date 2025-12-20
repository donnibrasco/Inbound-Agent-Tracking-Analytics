
export interface CallMetric {
  label: string;
  value: string;
  subtext: string;
  change: number; 
  trend: 'up' | 'down';
  icon: 'phone' | 'clock' | 'calendar' | 'activity' | 'cpu' | 'mic' | 'headphones' | 'message-square';
}

export interface AiAgentMetric {
  name: string;
  inbound: number;
  outbound: number;
}

export interface AgentOutcome {
  name: string;
  value: number;
  color: string;
  // Added index signature to fix "Index signature for type 'string' is missing" error in Recharts
  [key: string]: string | number;
}

export interface ChartDataPoint {
  name: string;
  calls: number;
  bookings: number;
  [key: string]: string | number;
}

export interface Territory {
  id: string;
  name: string;
  clients: number;
  revenue: number;
  growth: number;
  status: 'High' | 'Medium' | 'Low';
  coordinates: { lat: number; lng: number };
  history: number[]; 
}

export interface RecentCall {
  id: string;
  caller: string;
  phone: string;
  duration: string;
  outcome: 'Booked' | 'Follow Up' | 'Not Interested' | 'Interested' | 'Transferred' | 'Resolved';
  interest: 'High' | 'Medium' | 'Low';
  type: 'Inbound' | 'Outbound';
  time: string;
}

export interface OutcomeData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface AttributionSource {
  source: string;
  leads: number;
  sessions: number;
  engaged: number;
  avgTime: string;
  conversionRate: number;
  booked: number;
  revenue: number;
  color: string;
}

export interface AttributionTrend {
  date: string;
  [key: string]: string | number;
}

export interface InsightItem {
  icon: 'trending-up' | 'users' | 'alert' | 'check' | 'clock';
  label: string;
  value: string;
}

export interface InsightData {
  header: string;
  items: InsightItem[];
  followUp: string;
}
