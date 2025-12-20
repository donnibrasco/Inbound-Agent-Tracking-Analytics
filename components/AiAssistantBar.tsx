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
      <div className="w-full bg-card border border-border rounded-2xl p-3 pl-4 pr-3 flex items-center shadow-xl hover:border-accent/30 transition-all duration-300 group">
        {/* Avatar Area */}
        <div className="relative shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-sm font-bold text-gray-500 shadow-inner">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent/20 to-transparent"></div>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent border-2 border-card rounded-full shadow-sm"></div>
        </div>

        {/* Input Area */}
        <div className="flex-1 flex flex-col justify-center h-full mr-4">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Good morning, Don</div>
            <form onSubmit={handleSubmit} className="w-full">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-foreground text-sm placeholder-gray-400 font-medium leading-relaxed"
                    placeholder="How can I assist you today? Ex: Estimate savings growth..." 
                    disabled={isLoading}
                />
            </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => onSearch(query || "Generate a summary")}
                disabled={isLoading}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${isLoading ? 'bg-accent/50 cursor-wait' : 'bg-accent hover:bg-accent/80 text-background shadow-lg'}`}
            >
                {isLoading ? (
                    <Icons.RefreshCw className="animate-spin" size={20} />
                ) : (
                    <Icons.Plus size={20} strokeWidth={3} />
                )}
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-foreground/5 text-gray-500 hover:text-foreground hover:bg-foreground/10 transition-colors border border-border">
                <Icons.Mic size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantBar;