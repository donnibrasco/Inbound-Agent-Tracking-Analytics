import React from 'react';
import { CallMetric } from '../types';
import { Icons } from './Icons';

interface MetricCardProps {
  metric: CallMetric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const Icon = Icons[metric.icon === 'phone' ? 'Phone' : metric.icon === 'clock' ? 'Clock' : metric.icon === 'calendar' ? 'Calendar' : 'Activity'];
  const isPositive = metric.change > 0;

  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-400 text-sm font-medium">{metric.label}</span>
        <div className={`p-2 rounded-lg bg-[#1f2937] text-teal-400`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-1">
        <div className="text-3xl font-bold text-white tracking-tight">{metric.value}</div>
        <div className="flex items-center mt-2 text-xs">
          <span className={`${isPositive ? 'text-emerald-400' : 'text-rose-400'} font-medium mr-1.5`}>
            {isPositive ? '+' : ''}{metric.change}%
          </span>
          <span className="text-gray-500">{metric.subtext}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;