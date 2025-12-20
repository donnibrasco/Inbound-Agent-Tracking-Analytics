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
      case 'users': return <Icons.Users size={18} className="text-blue-500" />;
      case 'clock': return <Icons.Clock size={18} className="text-gray-500" />;
      case 'alert': return <Icons.AlertTriangle size={18} className="text-rose-500" />;
      case 'check': return <Icons.CheckCircle size={18} className="text-emerald-500" />;
      case 'trending-up': return <Icons.TrendingUp size={18} className="text-accent" />;
      default: return <Icons.Activity size={18} className="text-teal-500" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl animate-fade-in relative mt-2 transition-colors duration-300">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-400 hover:text-foreground transition-colors p-1"
      >
        <Icons.X size={18} />
      </button>

      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-5">
        {data.header}
      </div>

      <div className="space-y-5">
        {data.items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div className="mt-0.5 shrink-0 p-2 bg-foreground/5 rounded-lg">
              {getIcon(item.icon)}
            </div>
            <div className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              <span className="text-foreground font-bold">{item.label}: </span>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {data.followUp && (
        <div className="mt-8">
           <button 
            onClick={() => onFollowUpClick(data.followUp)}
            className="bg-foreground/5 hover:bg-foreground/10 text-foreground text-sm px-5 py-3 rounded-xl transition-all border border-border w-full md:w-auto inline-flex items-center font-semibold shadow-sm"
           >
             <span className="mr-2 opacity-80 text-lg">💡</span>
             {data.followUp}
           </button>
        </div>
      )}
    </div>
  );
};

export default AiInsightsView;