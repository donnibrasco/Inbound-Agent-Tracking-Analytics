import React, { useState, useEffect } from 'react';
import { METRICS, VOLUME_DATA, OUTCOME_DATA, RECENT_CALLS } from './constants';
import { Icons } from './components/Icons';
import MetricCard from './components/MetricCard';
import InterestScore from './components/InterestScore';
import TerritoryMap from './components/TerritoryMap';
import AttributionSection from './components/AttributionSection';
import AiAssistantBar from './components/AiAssistantBar';
import AiInsightsView from './components/AiInsightsView';
import { analyzeDashboard } from './services/geminiService';
import { InsightData } from './types';

// Recharts imports
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const App: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<InsightData | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Auto-generate insight on load to demonstrate the "proactive" advice
  useEffect(() => {
    handleAiAnalysis();
  }, []);

  const handleAiAnalysis = async (customQuery?: string) => {
    setLoadingInsight(true);
    const insight = await analyzeDashboard(customQuery);
    setAiInsight(insight);
    setLoadingInsight(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] p-4 md:p-6 lg:p-8 text-white font-sans selection:bg-teal-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Call Analytics</h1>
            <p className="text-gray-400 text-sm mt-1">Track and analyze your business call performance</p>
          </div>
          <div className="flex items-center space-x-3">
             <div className="bg-[#111827] border border-white/10 rounded-lg flex items-center px-3 py-2 text-sm text-gray-300">
                <Icons.Calendar size={16} className="mr-2 text-gray-500" />
                Last 7 days
             </div>
             <button className="bg-[#111827] border border-white/10 p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400">
                <Icons.RefreshCw size={18} />
             </button>
          </div>
        </header>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((metric, idx) => (
            <MetricCard key={idx} metric={metric} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Volume Chart */}
          <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-xl p-6 shadow-lg">
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg">Call Volume</h3>
              <p className="text-gray-400 text-sm mt-1">Weekly call and booking trends</p>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#e5e7eb' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="calls" 
                    stroke="#14b8a6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCalls)" 
                    name="Total Calls"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBookings)" 
                    name="Bookings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center text-xs text-gray-400">
                    <span className="w-3 h-3 rounded-full bg-teal-500 mr-2"></span> Total Calls
                </div>
                <div className="flex items-center text-xs text-gray-400">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> Bookings
                </div>
            </div>
          </div>

          {/* Interest Score Side Card */}
          <div className="lg:col-span-1">
            <InterestScore />
          </div>
        </div>

        {/* Map Section */}
        <TerritoryMap />

        {/* AI Assistant Bar & Results */}
        <div className="space-y-4">
            <AiAssistantBar onSearch={handleAiAnalysis} isLoading={loadingInsight} />

            {/* AI Insight Result View */}
            {aiInsight && (
                <AiInsightsView 
                  data={aiInsight} 
                  onClose={() => setAiInsight(null)} 
                  onFollowUpClick={(q) => handleAiAnalysis(q)}
                />
            )}
        </div>

        {/* Attribution Section (Source Performance Table is top of this section) */}
        <AttributionSection />

        {/* Bottom Section: Outcomes & Recent Calls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Outcomes Donut Chart */}
           <div className="bg-[#111827] border border-white/5 rounded-xl p-6 shadow-lg">
                <div className="mb-4">
                    <h3 className="text-white font-semibold text-lg">Call Outcomes</h3>
                    <p className="text-gray-400 text-sm mt-1">Distribution of call results</p>
                </div>
                <div className="h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={OUTCOME_DATA}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {OUTCOME_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                itemStyle={{ color: '#e5e7eb' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="text-center">
                            <span className="block text-2xl font-bold text-white">100</span>
                            <span className="text-xs text-gray-500 uppercase">Total</span>
                         </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {OUTCOME_DATA.map((entry) => (
                        <div key={entry.name} className="flex items-center text-xs text-gray-400">
                            <span className="w-3 h-3 rounded mr-2" style={{ backgroundColor: entry.color }}></span>
                            {entry.name}
                        </div>
                    ))}
                </div>
           </div>

           {/* Recent Calls Table */}
           <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-xl overflow-hidden shadow-lg flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-white font-semibold text-lg">Recent Calls</h3>
                    <p className="text-gray-400 text-sm mt-1">Latest incoming calls and their outcomes</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#1f2937] text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-3">Caller</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Duration</th>
                                <th className="px-6 py-3">Outcome</th>
                                <th className="px-6 py-3">Interest</th>
                                <th className="px-6 py-3 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {RECENT_CALLS.map((call) => (
                                <tr key={call.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{call.caller}</td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs tracking-wide">{call.phone}</td>
                                    <td className="px-6 py-4 text-gray-300">{call.duration}</td>
                                    <td className="px-6 py-4">
                                        <span className={`
                                            px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${call.outcome === 'Booked' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                              call.outcome === 'Interested' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                                              call.outcome === 'Follow Up' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                              'bg-rose-500/10 text-rose-400 border-rose-500/20'}
                                        `}>
                                            {call.outcome}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium 
                                             ${call.interest === 'High' ? 'text-emerald-400' : 
                                               call.interest === 'Medium' ? 'text-amber-400' : 'text-gray-400'}
                                        `}>
                                            {call.interest}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-right">{call.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default App;