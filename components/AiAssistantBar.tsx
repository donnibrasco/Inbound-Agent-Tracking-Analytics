import React, { useState } from 'react';
import { Icons } from './Icons';

interface AiAssistantBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const AiAssistantBar: React.FC<AiAssistantBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <div className="w-full mb-2">
      <div className="w-full bg-[#18181b] border border-white/5 rounded-2xl p-3 pl-4 pr-3 flex items-center shadow-xl hover:border-white/10 transition-colors group">
        {/* Avatar Area */}
        <div className="relative shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-sm font-semibold text-gray-300 shadow-inner">
            {/* Simple gradient avatar effect */}
            <div className="w-full h-full rounded-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent"></div>
          </div>
          {/* Status Dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#a78bfa] border-2 border-[#18181b] rounded-full"></div>
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col justify-center h-full mr-4">
            <div className="text-sm text-gray-200 font-medium mb-0.5">Good morning, Don</div>
            <form onSubmit={handleSubmit} className="w-full">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-500 text-sm placeholder-gray-600 font-normal leading-relaxed"
                    placeholder="| How can I assist you today? Ex: Estimate savings growth..." 
                    disabled={isLoading}
                />
            </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => onSearch(query || "Generate a summary")}
                disabled={isLoading}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isLoading ? 'bg-[#a78bfa]/50 cursor-wait' : 'bg-[#a78bfa] hover:bg-[#c4b5fd] text-black shadow-[0_0_15px_rgba(167,139,250,0.3)]'}`}
            >
                {isLoading ? (
                    <Icons.RefreshCw className="animate-spin" size={20} />
                ) : (
                    <Icons.Plus size={20} strokeWidth={2.5} />
                )}
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#27272a] text-gray-400 hover:text-white hover:bg-[#3f3f46] transition-colors border border-white/5">
                <Icons.Mic size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantBar;