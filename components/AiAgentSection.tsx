import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CallMetric, AiAgentMetric, AgentOutcome } from '../types';
import MetricCard from './MetricCard';
import { Icons } from './Icons';

interface AiAgentSectionProps {
  detailedMetrics?: CallMetric[];
  performanceData?: AiAgentMetric[];
  outcomes?: AgentOutcome[];
}

const AiAgentSection: React.FC<AiAgentSectionProps> = ({ 
  detailedMetrics = [], 
  performanceData = [], 
  outcomes = [] 
}) => {
  const [activeDirection, setActiveDirection] = useState<'inbound' | 'outbound'>('inbound');
  
  // Filter metrics based on selected direction
  const filteredMetrics = useMemo(() => {
    return detailedMetrics.map(metric => {
      // Simulate direction-based variations
      const multiplier = activeDirection === 'inbound' ? 1 : 0.85;
      return {
        ...metric,
        value: typeof metric.value === 'string' 
          ? metric.value 
          : Math.round(parseFloat(metric.value) * multiplier).toString(),
        change: metric.change * (activeDirection === 'inbound' ? 1 : 0.9)
      };
    });
  }, [detailedMetrics, activeDirection]);

  // Filter outcomes based on direction
  const filteredOutcomes = useMemo(() => {
    return outcomes.map(outcome => ({
      ...outcome,
      value: activeDirection === 'inbound' ? outcome.value : Math.round(outcome.value * 0.8)
    }));
  }, [outcomes, activeDirection]);

  const totalCalls = useMemo(() => {
    return filteredOutcomes.reduce((sum, outcome) => sum + outcome.value, 0);
  }, [filteredOutcomes]);

  return (
    <div id="ai-agent" className="space-y-6 pt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Voice Receptionist</h2>
          <p className="text-gray-500 text-sm mt-1">Deep analysis of ElevenLabs AI performance across all channels</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl">
          <button 
            onClick={() => setActiveDirection('inbound')}
            className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
              activeDirection === 'inbound' 
                ? 'bg-accent/10 text-accent shadow-sm' 
                : 'hover:bg-white/5 text-gray-500'
            }`}
          >
            Inbound
          </button>
          <button 
            onClick={() => setActiveDirection('outbound')}
            className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
              activeDirection === 'outbound' 
                ? 'bg-accent/10 text-accent shadow-sm' 
                : 'hover:bg-white/5 text-gray-500'
            }`}
          >
            Outbound
          </button>
        </div>
      </div>

      {/* Specific AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMetrics.map((metric, idx) => (
          <MetricCard key={idx} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbound vs Outbound Comparison */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-foreground font-semibold text-lg">Inbound vs Outbound</h3>
              <p className="text-gray-500 text-sm">Comparing AI efficacy by call direction</p>
            </div>
          </div>
          <div className="h-[320px]" style={{ minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'gray', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'gray', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="inbound" name="Inbound" fill="#14b8a6" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="outbound" name="Outbound" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Call Outcome Distribution */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-foreground font-semibold text-lg">Agent Outcomes</h3>
            <p className="text-gray-500 text-sm">Distribution of AI-handled results</p>
          </div>
          <div className="flex-1 relative" style={{ minHeight: '280px', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredOutcomes}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {filteredOutcomes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-foreground">{totalCalls}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{activeDirection} Calls</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {filteredOutcomes.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs text-gray-500">{entry.name}</span>
                <span className="text-xs font-bold text-foreground ml-auto">{totalCalls > 0 ? Math.round((entry.value / totalCalls) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAgentSection;