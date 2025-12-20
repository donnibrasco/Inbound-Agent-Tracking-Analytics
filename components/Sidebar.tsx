import React from 'react';
import { Icons } from './Icons';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'BarChart' },
    { id: 'ai-agent', label: 'AI Voice Agent', icon: 'Headphones' },
    { id: 'marketing', label: 'Marketing ROI', icon: 'Target' },
    { id: 'territories', label: 'Territory Map', icon: 'MapPin' },
    { id: 'activity', label: 'Recent Activity', icon: 'Clock' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col pt-8 transition-colors duration-300">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-background font-bold shadow-sm">C</div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">InsightsHub</h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = Icons[item.icon as keyof typeof Icons];
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-accent/10 text-accent font-semibold shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-accent' : 'text-gray-400 group-hover:text-foreground'} />
              <span className="text-sm">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-foreground/5 rounded-xl p-3 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">AI Live Status</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">System performing optimally. 842 calls processed today.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;