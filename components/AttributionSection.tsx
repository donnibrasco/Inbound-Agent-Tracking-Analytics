import React, { useState, useMemo } from 'react';
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
import { AttributionSource } from '../types';

type SortKey = keyof AttributionSource;
type RateFilter = 'all' | 'high' | 'medium' | 'low';

const AttributionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'creatives'>('performance');
  const [sortKey, setSortKey] = useState<SortKey>('leads');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [rateFilter, setRateFilter] = useState<RateFilter>('all');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedSources = useMemo(() => {
    let result = [...ATTRIBUTION_SOURCES];
    if (rateFilter === 'high') result = result.filter(s => s.conversionRate >= 15);
    else if (rateFilter === 'medium') result = result.filter(s => s.conversionRate >= 10 && s.conversionRate < 15);
    else if (rateFilter === 'low') result = result.filter(s => s.conversionRate < 10);

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      if (typeof aVal === 'number' && typeof bVal === 'number') return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      return 0;
    });
    return result;
  }, [sortKey, sortOrder, rateFilter]);

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <Icons.MoreHorizontal size={12} className="ml-1 opacity-20" />;
    return sortOrder === 'asc' ? <Icons.TrendingUp size={12} className="ml-1 text-accent" /> : <Icons.TrendingDown size={12} className="ml-1 text-accent" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
             <h3 className="text-foreground font-bold text-xl">Marketing Performance</h3>
             <p className="text-gray-500 text-sm mt-1">Analyze channels and creative assets</p>
          </div>
          <div className="bg-card p-1 rounded-xl border border-border inline-flex shadow-sm transition-colors duration-300">
             <button 
                onClick={() => setActiveTab('performance')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'performance' ? 'bg-foreground/10 text-foreground shadow-sm' : 'text-gray-500 hover:text-foreground'}`}
             >
                <Icons.BarChart2 size={16} className="mr-2" />
                Performance
             </button>
             <button 
                onClick={() => setActiveTab('creatives')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'creatives' ? 'bg-foreground/10 text-foreground shadow-sm' : 'text-gray-500 hover:text-foreground'}`}
             >
                <Icons.LayoutGrid size={16} className="mr-2" />
                Ad Creatives
             </button>
          </div>
      </div>

      {activeTab === 'performance' ? (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg transition-colors duration-300">
                <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-foreground font-semibold text-lg">Source Breakdown</h3>
                        <p className="text-gray-500 text-sm mt-1">Detailed acquisition metrics by channel</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-foreground/5 border border-border rounded-lg px-2 py-1">
                          <span className="text-[10px] text-gray-500 uppercase font-bold mr-2 ml-1">Rate Filter:</span>
                          <select 
                            value={rateFilter}
                            onChange={(e) => setRateFilter(e.target.value as RateFilter)}
                            className="bg-transparent text-xs text-foreground outline-none cursor-pointer py-1"
                          >
                            <option value="all">All Performance</option>
                            <option value="high">High (>15%)</option>
                            <option value="medium">Medium (10-15%)</option>
                            <option value="low">Low (<10%)</option>
                          </select>
                        </div>
                        <button className="text-xs bg-foreground/5 hover:bg-foreground/10 text-foreground px-3 py-2 rounded-lg transition-colors border border-border flex items-center font-bold">
                            <Icons.ExternalLink size={14} className="mr-2" />
                            Export Report
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-foreground/5 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                            <tr className="select-none">
                                <th className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('source')}>Source {renderSortIcon('source')}</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('leads')}>Leads {renderSortIcon('leads')}</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('sessions')}>Sessions {renderSortIcon('sessions')}</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('engaged')}>Engaged {renderSortIcon('engaged')}</th>
                                <th className="px-6 py-4">Avg Time</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('conversionRate')}><span className="text-accent">Booking Rate</span> {renderSortIcon('conversionRate')}</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('booked')}>Booked {renderSortIcon('booked')}</th>
                                <th className="px-6 py-4 text-right cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('revenue')}>Revenue {renderSortIcon('revenue')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredAndSortedSources.map((row, idx) => (
                                <tr key={idx} className="hover:bg-foreground/5 transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-foreground flex items-center">
                                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: row.color }}></span>
                                        {row.source}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-medium">{row.leads.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-400">{row.sessions.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-400">{row.engaged.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-500">{row.avgTime}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[11px] font-bold ${row.conversionRate > 15 ? 'bg-emerald-500/10 text-emerald-500' : row.conversionRate < 10 ? 'bg-rose-500/10 text-rose-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                            {row.conversionRate}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-foreground font-bold">{row.booked}</td>
                                    <td className="px-6 py-4 text-right text-emerald-500 font-mono font-bold">
                                        ${row.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-foreground font-semibold text-lg">Lead Source Trends</h3>
                            <p className="text-gray-500 text-sm mt-1">Daily lead volume by channel</p>
                        </div>
                        <div className="bg-foreground/5 px-3 py-1 rounded-md text-[10px] font-bold text-gray-500 border border-border uppercase tracking-wider">
                            Last 30 Days
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ATTRIBUTION_TRENDS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'gray', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'gray', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                {ATTRIBUTION_SOURCES.map((source) => (
                                    <Line key={source.source} type="monotone" dataKey={source.source} stroke={source.color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-foreground font-semibold text-lg">Conversion Efficiency</h3>
                        <p className="text-gray-500 text-sm mt-1">Leads vs Booked Calls</p>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ATTRIBUTION_SOURCES} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="source" type="category" width={80} tick={{ fill: 'gray', fontSize: 10 }} interval={0} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                                <Bar dataKey="leads" name="Leads" fill="gray" radius={[0, 4, 4, 0]} barSize={10} opacity={0.3} />
                                <Bar dataKey="booked" name="Booked" fill="#10b981" radius={[0, 4, 4, 0]} barSize={10} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-foreground/5 rounded-lg p-3 border border-border">
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Revenue</div>
                            <div className="text-emerald-500 font-bold text-lg">$27.5k</div>
                        </div>
                        <div className="bg-foreground/5 rounded-lg p-3 border border-border">
                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Avg ROAS</div>
                            <div className="text-accent font-bold text-lg">3.8x</div>
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