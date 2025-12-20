import React from 'react';
import { CallMetric } from '../types';
import { Icons } from './Icons';

interface MetricCardProps {
  metric: CallMetric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const iconKey = (metric.icon.charAt(0).toUpperCase() + metric.icon.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())) as keyof typeof Icons;
  const Icon = Icons[iconKey] || Icons.Activity;
  const isPositive = metric.change > 0;
  const isNeutral = metric.change === 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md hover:border-accent/30 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{metric.label}</span>
        <div className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
          <Icon size={18} />
        </div>
      </div>
      <div className="">
        <div className="text-3xl font-extrabold text-foreground tracking-tight">{metric.value}</div>
        <div className="flex items-center mt-3 text-[11px] font-bold">
          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : isNeutral ? 'bg-gray-500/10 text-gray-500' : 'bg-rose-500/10 text-rose-500'} mr-2`}>
            {isPositive ? <Icons.TrendingUp size={10} /> : <Icons.TrendingDown size={10} />}
            {isPositive ? '+' : ''}{metric.change}%
          </span>
          <span className="text-gray-400 font-medium">{metric.subtext}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;