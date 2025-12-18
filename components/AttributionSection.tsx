import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ATTRIBUTION_SOURCES, ATTRIBUTION_TRENDS } from '../constants';
import { Icons } from './Icons';
import AdCreativesGallery from './AdCreativesGallery';

const AttributionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'creatives'>('performance');

  return (
    <div className="space-y-6">
      {/* Section Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
             <h3 className="text-white font-bold text-xl">Marketing Performance</h3>
             <p className="text-gray-400 text-sm mt-1">Analyze channels and creative assets</p>
          </div>
          <div className="bg-[#111827] p-1 rounded-xl border border-white/10 inline-flex shadow-sm">
             <button 
                onClick={() => setActiveTab('performance')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'performance' ? 'bg-[#27272a] text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
             >
                <Icons.BarChart2 size={16} className="mr-2" />
                Performance
             </button>
             <button 
                onClick={() => setActiveTab('creatives')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'creatives' ? 'bg-[#27272a] text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
             >
                <Icons.LayoutGrid size={16} className="mr-2" />
                Ad Creatives
             </button>
          </div>
      </div>

      {activeTab === 'performance' ? (
        <div className="space-y-6 animate-fade-in">
            {/* Detailed Attribution Table (Top) */}
            <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-white font-semibold text-lg">Source Breakdown</h3>
                        <p className="text-gray-400 text-sm mt-1">Detailed acquisition metrics by channel</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-xs bg-[#1f2937] hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors border border-white/10 flex items-center">
                            <Icons.ExternalLink size={14} className="mr-2" />
                            Export Report
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#1f2937] text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Leads (Users)</th>
                                <th className="px-6 py-4">Sessions</th>
                                <th className="px-6 py-4">Engaged</th>
                                <th className="px-6 py-4">Avg Time</th>
                                <th className="px-6 py-4">Conv. Rate</th>
                                <th className="px-6 py-4">Booked</th>
                                <th className="px-6 py-4 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {ATTRIBUTION_SOURCES.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white flex items-center">
                                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: row.color }}></span>
                                        {row.source}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{row.leads.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-400">{row.sessions.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-400">{row.engaged.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-300">{row.avgTime}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${row.conversionRate > 15 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700/30 text-gray-300'}`}>
                                            {row.conversionRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white font-semibold">{row.booked}</td>
                                    <td className="px-6 py-4 text-right text-emerald-400 font-mono">
                                        ${row.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                            {/* Totals Row */}
                            <tr className="bg-[#1f2937]/50 font-semibold text-white">
                                <td className="px-6 py-4">Total</td>
                                <td className="px-6 py-4">{ATTRIBUTION_SOURCES.reduce((acc, curr) => acc + curr.leads, 0).toLocaleString()}</td>
                                <td className="px-6 py-4">{ATTRIBUTION_SOURCES.reduce((acc, curr) => acc + curr.sessions, 0).toLocaleString()}</td>
                                <td className="px-6 py-4">{ATTRIBUTION_SOURCES.reduce((acc, curr) => acc + curr.engaged, 0).toLocaleString()}</td>
                                <td className="px-6 py-4">-</td>
                                <td className="px-6 py-4 text-gray-400 text-xs font-normal">avg 18.9%</td>
                                <td className="px-6 py-4">{ATTRIBUTION_SOURCES.reduce((acc, curr) => acc + curr.booked, 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-emerald-400">
                                    ${ATTRIBUTION_SOURCES.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Attribution Trends Chart (Bottom Left - Spanning 2 cols) */}
                <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-white font-semibold text-lg">Lead Source Trends</h3>
                            <p className="text-gray-400 text-sm mt-1">Daily lead volume by channel</p>
                        </div>
                        <div className="bg-[#1f2937] px-3 py-1 rounded-md text-xs text-gray-400 border border-white/5">
                            Last 30 Days
                        </div>
                    </div>
                    
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ATTRIBUTION_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                                <XAxis 
                                    dataKey="date" 
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
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                
                                {/* Dynamic Lines based on Constants */}
                                {ATTRIBUTION_SOURCES.map((source) => (
                                    <Line 
                                        key={source.source}
                                        type="monotone" 
                                        dataKey={source.source} 
                                        stroke={source.color} 
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lead vs Booked Comparison (Bottom Right - 1 col) */}
                <div className="bg-[#111827] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-white font-semibold text-lg">Conversion Efficiency</h3>
                        <p className="text-gray-400 text-sm mt-1">Leads vs Booked Calls</p>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ATTRIBUTION_SOURCES} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.3} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="source" 
                                    type="category" 
                                    width={100} 
                                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                                    interval={0}
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                />
                                <Bar dataKey="leads" name="Leads" fill="#374151" radius={[0, 4, 4, 0]} barSize={10} />
                                <Bar dataKey="booked" name="Booked" fill="#10b981" radius={[0, 4, 4, 0]} barSize={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-[#1f2937] rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase">Total Revenue</div>
                            <div className="text-white font-bold text-lg text-emerald-400">$27.5k</div>
                        </div>
                        <div className="bg-[#1f2937] rounded-lg p-3">
                            <div className="text-gray-400 text-xs uppercase">Avg ROAS</div>
                            <div className="text-white font-bold text-lg text-indigo-400">3.8x</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <AdCreativesGallery sources={ATTRIBUTION_SOURCES} />
      )}
    </div>
  );
};

export default AttributionSection;