import React from 'react';
import { Icons } from './Icons';

const InterestScore: React.FC = () => {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl p-6 shadow-lg h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-semibold text-lg">Interest Score</h3>
          <p className="text-gray-400 text-sm mt-1">Average caller interest level</p>
        </div>
        <div className="p-2 rounded-lg bg-[#1f2937] text-teal-400">
            <Icons.Activity size={18} />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-end items-baseline">
            <span className="text-5xl font-bold text-white tracking-tighter">7.8</span>
            <span className="text-gray-500 text-xl ml-2">/ 10</span>
        </div>

        <div className="mt-6 relative h-3 w-full bg-gray-800 rounded-full overflow-hidden">
             {/* Progress Bar Background */}
            <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '78%' }}
            />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
            <span>Score</span>
            <span>78%</span>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-sm text-emerald-400 font-medium">
                +12% <span className="text-gray-500 font-normal">improvement this week</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default InterestScore;