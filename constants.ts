import { CallMetric, ChartDataPoint, Territory, RecentCall, OutcomeData, AttributionSource, AttributionTrend } from './types';

export const METRICS: CallMetric[] = [
  {
    label: 'Total Calls',
    value: '194',
    subtext: 'This week',
    change: 12,
    trend: 'up',
    icon: 'phone'
  },
  {
    label: 'Hours Talked',
    value: '18.5',
    subtext: 'Total call time',
    change: 8,
    trend: 'up',
    icon: 'clock'
  },
  {
    label: 'Booking Rate',
    value: '38%',
    subtext: '74 appointments',
    change: 5,
    trend: 'up',
    icon: 'calendar'
  },
  {
    label: 'Avg Duration',
    value: '5:42',
    subtext: 'Minutes per call',
    change: -3,
    trend: 'down',
    icon: 'activity'
  }
];

export const VOLUME_DATA: ChartDataPoint[] = [
  { name: 'Mon', calls: 25, bookings: 8 },
  { name: 'Tue', calls: 32, bookings: 12 },
  { name: 'Wed', calls: 28, bookings: 10 },
  { name: 'Thu', calls: 42, bookings: 18 },
  { name: 'Fri', calls: 38, bookings: 15 },
  { name: 'Sat', calls: 20, bookings: 6 },
  { name: 'Sun', calls: 15, bookings: 4 },
];

export const TERRITORIES: Territory[] = [
  { 
    id: '1', 
    name: 'North Dallas', 
    clients: 45, 
    revenue: 12400, 
    growth: 89, 
    status: 'High', 
    coordinates: { lat: 32.91, lng: -96.79 },
    history: [40, 55, 45, 60, 75, 89]
  },
  { 
    id: '2', 
    name: 'Downtown', 
    clients: 28, 
    revenue: 8200, 
    growth: 72, 
    status: 'Medium', 
    coordinates: { lat: 32.7767, lng: -96.7970 },
    history: [30, 40, 35, 50, 65, 72] 
  },
  { 
    id: '3', 
    name: 'East Dallas', 
    clients: 32, 
    revenue: 9800, 
    growth: 95, 
    status: 'High', 
    coordinates: { lat: 32.82, lng: -96.73 },
    history: [50, 55, 65, 70, 85, 95]
  },
  { 
    id: '4', 
    name: 'West Dallas', 
    clients: 18, 
    revenue: 4500, 
    growth: -45, 
    status: 'Low', 
    coordinates: { lat: 32.78, lng: -96.88 },
    history: [60, 50, 40, 20, 10, -45]
  },
  { 
    id: '5', 
    name: 'South Dallas', 
    clients: 22, 
    revenue: 5900, 
    growth: -58, 
    status: 'Low', 
    coordinates: { lat: 32.68, lng: -96.80 },
    history: [40, 30, 20, 10, -20, -58]
  },
  { 
    id: '6', 
    name: 'SE Dallas', 
    clients: 38, 
    revenue: 11200, 
    growth: 82, 
    status: 'High', 
    coordinates: { lat: 32.72, lng: -96.68 },
    history: [20, 30, 50, 60, 70, 82]
  },
];

export const RECENT_CALLS: RecentCall[] = [
  { id: '1', caller: 'John Smith', phone: '+1 (555) 123-4567', duration: '4:32', outcome: 'Booked', interest: 'High', time: '2 min ago' },
  { id: '2', caller: 'Sarah Johnson', phone: '+1 (555) 234-5678', duration: '2:15', outcome: 'Follow Up', interest: 'Medium', time: '15 min ago' },
  { id: '3', caller: 'Mike Davis', phone: '+1 (555) 345-6789', duration: '6:48', outcome: 'Booked', interest: 'High', time: '32 min ago' },
  { id: '4', caller: 'Emily Brown', phone: '+1 (555) 456-7890', duration: '1:23', outcome: 'Not Interested', interest: 'Low', time: '1 hr ago' },
  { id: '5', caller: 'David Wilson', phone: '+1 (555) 567-8901', duration: '5:12', outcome: 'Interested', interest: 'High', time: '2 hrs ago' },
];

export const OUTCOME_DATA: OutcomeData[] = [
  { name: 'Booked', value: 38, color: '#22c55e' }, // Green
  { name: 'Interested', value: 25, color: '#14b8a6' }, // Teal
  { name: 'Follow Up', value: 20, color: '#f59e0b' }, // Amber/Orange
  { name: 'Not Interested', value: 17, color: '#ef4444' }, // Red
];

export const ATTRIBUTION_SOURCES: AttributionSource[] = [
  { source: 'Organic Search', leads: 2126, sessions: 4247, engaged: 2674, avgTime: '35s', conversionRate: 15.18, booked: 322, revenue: 5553.11, color: '#10b981' }, // Emerald
  { source: 'Meta Ads', leads: 5126, sessions: 11247, engaged: 4456, avgTime: '39s', conversionRate: 8.86, booked: 454, revenue: 8993.83, color: '#8b5cf6' }, // Purple
  { source: 'PPC Ads', leads: 1540, sessions: 3036, engaged: 1156, avgTime: '43s', conversionRate: 12.04, booked: 185, revenue: 3771.95, color: '#3b82f6' }, // Blue
  { source: 'YouTube Ads', leads: 899, sessions: 1601, engaged: 632, avgTime: '40s', conversionRate: 9.22, booked: 83, revenue: 1187.30, color: '#ef4444' }, // Red
  { source: 'TikTok Posts', leads: 642, sessions: 1034, engaged: 501, avgTime: '35s', conversionRate: 19.10, booked: 122, revenue: 1291.24, color: '#ec4899' }, // Pink
  { source: 'Facebook Marketplace', leads: 430, sessions: 850, engaged: 320, avgTime: '55s', conversionRate: 22.4, booked: 96, revenue: 2100.50, color: '#6366f1' }, // Indigo
  { source: 'Referral', leads: 320, sessions: 520, engaged: 480, avgTime: '1m 12s', conversionRate: 45.5, booked: 145, revenue: 4500.00, color: '#f59e0b' }, // Amber
];

export const ATTRIBUTION_TRENDS: AttributionTrend[] = [
  { date: '04 Feb', 'Organic Search': 150, 'Meta Ads': 280, 'PPC Ads': 80, 'YouTube Ads': 40, 'TikTok Posts': 30, 'Facebook Marketplace': 20, 'Referral': 15 },
  { date: '08 Feb', 'Organic Search': 180, 'Meta Ads': 320, 'PPC Ads': 90, 'YouTube Ads': 45, 'TikTok Posts': 50, 'Facebook Marketplace': 25, 'Referral': 20 },
  { date: '12 Feb', 'Organic Search': 160, 'Meta Ads': 300, 'PPC Ads': 110, 'YouTube Ads': 35, 'TikTok Posts': 70, 'Facebook Marketplace': 30, 'Referral': 25 },
  { date: '16 Feb', 'Organic Search': 210, 'Meta Ads': 450, 'PPC Ads': 120, 'YouTube Ads': 60, 'TikTok Posts': 60, 'Facebook Marketplace': 35, 'Referral': 30 },
  { date: '20 Feb', 'Organic Search': 190, 'Meta Ads': 380, 'PPC Ads': 130, 'YouTube Ads': 70, 'TikTok Posts': 90, 'Facebook Marketplace': 40, 'Referral': 45 },
  { date: '24 Feb', 'Organic Search': 240, 'Meta Ads': 410, 'PPC Ads': 115, 'YouTube Ads': 65, 'TikTok Posts': 80, 'Facebook Marketplace': 45, 'Referral': 40 },
  { date: '28 Feb', 'Organic Search': 280, 'Meta Ads': 490, 'PPC Ads': 140, 'YouTube Ads': 80, 'TikTok Posts': 100, 'Facebook Marketplace': 50, 'Referral': 60 },
];