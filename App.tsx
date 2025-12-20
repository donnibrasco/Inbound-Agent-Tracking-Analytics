import React, { useState, useEffect, useMemo } from 'react';
import { METRICS, VOLUME_DATA, OUTCOME_DATA, RECENT_CALLS } from './constants';
import { Icons } from './components/Icons';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import InterestScore from './components/InterestScore';
import TerritoryMap from './components/TerritoryMap';
import AttributionSection from './components/AttributionSection';
import AiAgentSection from './components/AiAgentSection';
import AiAssistantBar from './components/AiAssistantBar';
import AiInsightsView from './components/AiInsightsView';
import { analyzeDashboard, summarizeCall } from './services/geminiService';
import { InsightData } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const App: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<InsightData | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);
  const [callSortConfig, setCallSortConfig] = useState<{ key: 'interest' | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'desc' });


  useEffect(() => {
    handleAiAnalysis();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleAiAnalysis = async (customQuery?: string) => {
    setLoadingInsight(true);
    const insight = await analyzeDashboard(customQuery);
    setAiInsight(insight);
    setLoadingInsight(false);
  };

  const handleGenerateSummary = async (callId: string) => {
    const call = RECENT_CALLS.find(c => c.id === callId);
    if (!call) return;

    setLoadingSummaries(prev => ({ ...prev, [callId]: true }));
    const summary = await summarizeCall(call);
    setSummaries(prev => ({ ...prev, [callId]: summary }));
    setLoadingSummaries(prev => ({ ...prev, [callId]: false }));
    setExpandedSummaryId(callId); // Automatically expand after generating
  };

  const handleToggleSummary = (callId: string) => {
    if (expandedSummaryId === callId) {
        setExpandedSummaryId(null);
    } else {
        setExpandedSummaryId(callId);
    }
  };
  
  const handleCallLogSort = (key: 'interest') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (callSortConfig.key === key && callSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setCallSortConfig({ key, direction });
  };
  
  const sortedRecentCalls = useMemo(() => {
    const sortableCalls = [...RECENT_CALLS];
    if (callSortConfig.key === 'interest') {
        const interestOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        sortableCalls.sort((a, b) => {
            const valA = interestOrder[a.interest];
            const valB = interestOrder[b.interest];
            if (valA < valB) return callSortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return callSortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return sortableCalls;
  }, [callSortConfig]);
  
  const renderCallLogSortIcon = (key: 'interest') => {
    if (callSortConfig.key !== key) return <Icons.MoreHorizontal size={12} className="ml-1 opacity-20" />;
    return callSortConfig.direction === 'asc' ? <Icons.TrendingUp size={12} className="ml-1 text-accent" /> : <Icons.TrendingDown size={12} className="ml-1 text-accent" />;
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {METRICS.map((metric, idx) => (
                <MetricCard key={idx} metric={metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-foreground font-semibold text-lg">Call Traffic Volume</h3>
                  <p className="text-gray-500 text-sm">Weekly lead flow vs closed bookings</p>
                </div>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'gray', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'gray', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                      />
                      <Area type="monotone" dataKey="calls" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" name="Total Calls" />
                      <Area type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="lg:col-span-1">
                <InterestScore />
              </div>
            </div>
          </div>
        );
      case 'ai-agent':
        return <div className="animate-in fade-in duration-500"><AiAgentSection /></div>;
      case 'marketing':
        return <div className="animate-in fade-in duration-500"><AttributionSection /></div>;
      case 'territories':
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-foreground">Market Distribution</h2>
            <TerritoryMap />
          </div>
        );
      case 'activity':
        return (
          <div className="animate-in fade-in duration-500 grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="mb-4">
                        <h3 className="text-foreground font-semibold text-lg">Lead Outcomes</h3>
                        <p className="text-gray-500 text-sm">Sentiment and distribution</p>
                    </div>
                    <div className="h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={OUTCOME_DATA}
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {OUTCOME_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="text-center">
                                <span className="block text-2xl font-bold text-foreground">100%</span>
                                <span className="text-[10px] text-gray-500 uppercase font-bold">Processed</span>
                             </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {OUTCOME_DATA.map((entry) => (
                            <div key={entry.name} className="flex items-center text-xs text-gray-500">
                                <span className="w-2.5 h-2.5 rounded-sm mr-2" style={{ backgroundColor: entry.color }}></span>
                                {entry.name}
                            </div>
                        ))}
                    </div>
               </div>

               <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 border-b border-border bg-white/5">
                        <h3 className="text-foreground font-semibold text-lg">Live Call Log</h3>
                        <p className="text-gray-500 text-sm mt-1">Real-time update of AI engagements</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-card text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="px-4 py-3">Caller</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 cursor-pointer hover:text-foreground transition-colors select-none" onClick={() => handleCallLogSort('interest')}>
                                      <div className="flex items-center">
                                        Interest
                                        {renderCallLogSortIcon('interest')}
                                      </div>
                                    </th>
                                    <th className="px-4 py-3">Duration</th>
                                    <th className="px-4 py-3">AI Insight</th>
                                    <th className="px-4 py-3 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {sortedRecentCalls.map((call) => (
                                  <React.Fragment key={call.id}>
                                    <tr className="group hover:bg-accent/5 transition-colors">
                                        <td className="px-4 py-3">
                                          <div className="font-semibold text-foreground group-hover:text-accent transition-colors">{call.caller}</div>
                                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">{call.phone}</div>
                                          <div className="text-[10px] text-gray-400 mt-1">{call.type}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${call.outcome === 'Booked' ? 'bg-emerald-500/10 text-emerald-500' : call.outcome === 'Transferred' ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                                {call.outcome}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                              <div className={`w-1.5 h-1.5 rounded-full ${call.interest === 'High' ? 'bg-emerald-500' : call.interest === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                              <span className="font-medium text-xs">{call.interest}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="font-medium text-xs text-foreground">{call.duration}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {summaries[call.id] ? (
                                                <button
                                                    onClick={() => handleToggleSummary(call.id)}
                                                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80 transition-colors"
                                                >
                                                    <Icons.ChevronRight size={12} className={`transition-transform ${expandedSummaryId === call.id ? 'rotate-90' : ''}`} />
                                                    {expandedSummaryId === call.id ? 'Hide Summary' : 'View Summary'}
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleGenerateSummary(call.id)}
                                                    disabled={loadingSummaries[call.id]}
                                                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent/80 transition-colors disabled:opacity-50"
                                                >
                                                    {loadingSummaries[call.id] ? (
                                                        <Icons.RefreshCw size={12} className="animate-spin" />
                                                    ) : (
                                                        <Icons.Sparkles size={12} />
                                                    )}
                                                    {loadingSummaries[call.id] ? 'Summarizing...' : 'AI Summary'}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-right text-xs whitespace-nowrap">{call.time}</td>
                                    </tr>
                                    {expandedSummaryId === call.id && summaries[call.id] && (
                                      <tr className="bg-foreground/5 animate-in fade-in duration-300">
                                          <td colSpan={6} className="px-4 py-3 border-b border-border">
                                              <div className="flex items-start gap-3 pl-4">
                                                  <Icons.Sparkles size={14} className="text-accent mt-0.5 shrink-0" />
                                                  <p className="text-xs text-gray-400 leading-relaxed">{summaries[call.id]}</p>
                                              </div>
                                          </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
               </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
          <header className="flex items-center justify-between pb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight capitalize">{activeSection.replace('-', ' ')}</h1>
              <p className="text-gray-500 text-sm mt-1">Real-time performance monitoring and AI attribution</p>
            </div>
            <div className="flex items-center gap-4">
               <button 
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-card border border-border text-gray-400 hover:text-accent transition-colors shadow-sm"
                  title="Toggle Theme"
               >
                  {theme === 'dark' ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
               </button>
               <div className="bg-card border border-border rounded-xl flex items-center px-4 py-2 text-sm text-gray-500 font-medium">
                  <Icons.Calendar size={16} className="mr-2 text-accent" />
                  Feb 01 - Feb 28, 2024
               </div>
            </div>
          </header>
          <div className="mb-10">
              <AiAssistantBar onSearch={handleAiAnalysis} isLoading={loadingInsight} />
              {aiInsight && (
                  <AiInsightsView 
                    data={aiInsight} 
                    onClose={() => setAiInsight(null)} 
                    onFollowUpClick={(q) => handleAiAnalysis(q)}
                  />
              )}
          </div>
          <div className="flex-1">
            {renderSection()}
          </div>
          <footer className="mt-auto pt-20 pb-10 text-center text-gray-500 text-xs border-t border-border">
            &copy; 2024 InsightsHub Call Attribution AI. All rights reserved. 
            <span className="mx-2">•</span> 
            Privacy Policy 
            <span className="mx-2">•</span> 
            Terms of Service
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;