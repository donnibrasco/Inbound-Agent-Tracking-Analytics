import React from 'react';
import { InsightData } from '../types';
import { Icons } from './Icons';

interface AiInsightsViewProps {
  data: InsightData;
  onClose: () => void;
  onFollowUpClick: (question: string) => void;
}

const AiInsightsView: React.FC<AiInsightsViewProps> = ({ data, onClose, onFollowUpClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Icons.Users size={18} className="text-blue-400" />;
      case 'clock': return <Icons.Clock size={18} className="text-gray-200" />;
      case 'alert': return <Icons.AlertTriangle size={18} className="text-rose-400" />;
      case 'check': return <Icons.CheckCircle size={18} className="text-emerald-400" />;
      case 'trending-up': return <Icons.TrendingUp size={18} className="text-indigo-400" />;
      default: return <Icons.Activity size={18} className="text-teal-400" />;
    }
  };

  return (
    <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 shadow-2xl animate-fade-in relative mt-2">
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
      >
        <Icons.X size={18} />
      </button>

      {/* Header */}
      <div className="text-gray-400 text-sm font-medium mb-5">
        {data.header}
      </div>

      {/* List Items */}
      <div className="space-y-5">
        {data.items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {getIcon(item.icon)}
            </div>
            <div className="text-sm leading-relaxed text-gray-400">
              <span className="text-gray-200 font-semibold">{item.label}: </span>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion Chip */}
      {data.followUp && (
        <div className="mt-8">
           <button 
            onClick={() => onFollowUpClick(data.followUp)}
            className="bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 text-sm px-4 py-3 rounded-xl transition-colors text-left border border-white/5 w-full md:w-auto inline-flex items-center"
           >
             <span className="mr-2 opacity-60">💡</span>
             {data.followUp}
           </button>
        </div>
      )}
    </div>
  );
};

export default AiInsightsView;