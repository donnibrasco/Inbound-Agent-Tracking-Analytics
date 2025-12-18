export interface CallMetric {
  label: string;
  value: string;
  subtext: string;
  change: number; // percentage
  trend: 'up' | 'down';
  icon: 'phone' | 'clock' | 'calendar' | 'activity';
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
  history: number[]; // Added for sparkline graph
}

export interface RecentCall {
  id: string;
  caller: string;
  phone: string;
  duration: string;
  outcome: 'Booked' | 'Follow Up' | 'Not Interested' | 'Interested';
  interest: 'High' | 'Medium' | 'Low';
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
  [key: string]: string | number; // For dynamic source keys
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