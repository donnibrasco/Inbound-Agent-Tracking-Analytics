import React from 'react';
import { AttributionSource } from '../types';
import { Icons } from './Icons';

interface AdCreativesGalleryProps {
  sources: AttributionSource[];
}

const AdCreativesGallery: React.FC<AdCreativesGalleryProps> = ({ sources }) => {
  
  const renderCreative = (source: AttributionSource) => {
    // 1. Organic Search
    if (source.source === 'Organic Search') {
      return (
        <div className="bg-card p-4 rounded-xl border border-border h-full flex flex-col transition-colors">
            <div className="flex items-center gap-2 mb-3 border-b border-border pb-3">
                <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-500">
                    <Icons.Search size={16} />
                </div>
                <span className="text-foreground font-bold text-xs uppercase tracking-wider">Search Ranking</span>
            </div>
            <div className="bg-background p-4 rounded-lg flex-1 border border-border shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-[10px] text-gray-500 font-bold">L</div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold">Lovable.dev</span>
                        <span className="text-[8px] text-gray-400">https://lovable.dev/blog/attribution</span>
                    </div>
                </div>
                <div className="text-blue-500 dark:text-blue-400 text-lg font-bold leading-tight hover:underline cursor-pointer mb-2">
                    Complete Guide to Call Attribution & Tracking
                </div>
                <div className="text-gray-500 text-xs line-clamp-3">
                    Discover how to track inbound calls from every marketing channel. Increase your ROI by understanding exactly where your leads are coming from.
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <span>Rank: #1</span>
                <span className="text-emerald-500">CTR: {source.conversionRate}%</span>
            </div>
        </div>
      );
    }

    // 2. PPC Ads
    if (source.source === 'PPC Ads') {
        return (
          <div className="bg-card p-4 rounded-xl border border-border h-full flex flex-col transition-colors">
              <div className="flex items-center gap-2 mb-3 border-b border-border pb-3">
                  <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-500">
                      <Icons.Search size={16} />
                  </div>
                  <span className="text-foreground font-bold text-xs uppercase tracking-wider">Paid Search Ad</span>
              </div>
              <div className="bg-background p-4 rounded-lg flex-1 border border-border shadow-inner">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="text-foreground text-[10px] font-extrabold uppercase bg-foreground/10 px-1.5 rounded">Ad</span>
                      <span className="text-[10px] text-gray-500 font-bold">lovable.dev</span>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 text-lg font-bold leading-tight hover:underline cursor-pointer mb-2">
                      Best Call Tracking Software - Start Free Trial
                  </div>
                  <div className="text-gray-500 text-xs line-clamp-3">
                      Stop guessing. Start tracking. See which ads drive calls and revenue. Easy setup, real-time reporting, and AI insights.
                  </div>
                  <div className="mt-3 flex gap-4 text-blue-500 font-bold text-[10px] uppercase">
                        <span className="hover:underline cursor-pointer">Pricing</span>
                        <span className="hover:underline cursor-pointer">Features</span>
                        <span className="hover:underline cursor-pointer">Demo</span>
                  </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <span>Avg CPC: $4.20</span>
                  <span className="text-blue-500">Conv: {source.conversionRate}%</span>
              </div>
          </div>
        );
      }

    // 3. Meta Ads
    if (source.source === 'Meta Ads') {
        return (
            <div className="bg-card p-4 rounded-xl border border-border h-full flex flex-col transition-colors">
                <div className="flex items-center gap-2 mb-3 border-b border-border pb-3">
                    <div className="bg-purple-500/10 p-1.5 rounded-lg text-purple-500">
                        <Icons.Image size={16} />
                    </div>
                    <span className="text-foreground font-bold text-xs uppercase tracking-wider">Social Feed Ad</span>
                </div>
                
                <div className="bg-background rounded-lg border border-border overflow-hidden flex-1 flex flex-col shadow-sm">
                    <div className="p-3 flex items-center gap-2 border-b border-border/50">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">L</div>
                        <div>
                            <div className="text-foreground text-[10px] font-bold">Lovable Analytics</div>
                            <div className="text-gray-400 text-[8px] flex items-center font-bold">Sponsored · <Icons.Globe size={8} className="ml-1"/></div>
                        </div>
                    </div>
                    <div className="px-3 py-2 text-[10px] text-gray-500 font-medium">
                        Stop burning budget on ads that don't convert. 📉 Use our AI-powered tracking to see exactly which campaigns ring your phone! 📞✨
                    </div>
                    <div className="h-28 bg-gradient-to-br from-blue-600 to-purple-600 relative flex items-center justify-center group overflow-hidden">
                        <Icons.BarChart2 size={32} className="text-white/30" />
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded font-bold uppercase">Limited Offer</div>
                    </div>
                    <div className="p-2 flex justify-between items-center bg-foreground/5">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-400 font-bold uppercase">Lovable.dev</span>
                            <span className="text-[10px] text-foreground font-bold">Boost Your ROI Today</span>
                        </div>
                        <button className="bg-blue-600 text-white text-[9px] px-3 py-1.5 rounded font-bold shadow-sm uppercase tracking-wider">Learn More</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card p-4 rounded-xl border border-border h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest italic opacity-50">
            Preview Unavailable
        </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in transition-colors">
        {sources.filter(s => s.source !== 'Referral').map((source, idx) => (
            <div key={idx} className="h-full">
                {renderCreative(source)}
            </div>
        ))}
    </div>
  );
};

export default AdCreativesGallery;