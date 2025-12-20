import React from 'react';
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
import { AI_DETAILED_METRICS, AI_PERFORMANCE_DATA, AGENT_OUTCOMES } from '../constants';
import MetricCard from './MetricCard';
import { Icons } from './Icons';

const AiAgentSection: React.FC = () => {
  return (
    <div id="ai-agent" className="space-y-6 pt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Voice Receptionist</h2>
          <p className="text-gray-500 text-sm mt-1">Deep analysis of ElevenLabs AI performance across all channels</p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-xl">
          <button className="px-4 py-2 bg-accent/10 text-accent text-xs font-bold rounded-lg uppercase tracking-wider">Inbound</button>
          <button className="px-4 py-2 hover:bg-white/5 text-gray-500 text-xs font-bold rounded-lg uppercase tracking-wider">Outbound</button>
        </div>
      </div>

      {/* Specific AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AI_DETAILED_METRICS.map((metric, idx) => (
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
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AI_PERFORMANCE_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <div className="flex-1 relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={AGENT_OUTCOMES}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {AGENT_OUTCOMES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-foreground">842</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Calls</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {AGENT_OUTCOMES.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs text-gray-500">{entry.name}</span>
                <span className="text-xs font-bold text-foreground ml-auto">{Math.round((entry.value / 842) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAgentSection;