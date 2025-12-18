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
        <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5 h-full flex flex-col font-sans">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                <div className="bg-[#10b981]/20 p-1.5 rounded-lg text-[#10b981]">
                    <Icons.Search size={16} />
                </div>
                <span className="text-gray-300 font-medium text-sm">Google Search Result</span>
            </div>
            <div className="bg-[#0c121e] p-4 rounded-lg flex-1 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-white">L</div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-300">Lovable</span>
                        <span className="text-[10px] text-gray-500">https://lovable.dev/blog/attribution</span>
                    </div>
                </div>
                <div className="text-[#8ab4f8] text-lg leading-tight hover:underline cursor-pointer mb-1">
                    Complete Guide to Call Attribution & Tracking
                </div>
                <div className="text-gray-400 text-sm line-clamp-3">
                    Discover how to track inbound calls from every marketing channel. Increase your ROI by understanding exactly where your leads are coming from.
                </div>
                <div className="flex gap-2 mt-2">
                    <span className="text-xs text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full">Analytics</span>
                    <span className="text-xs text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full">Marketing</span>
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                <span>Rank: #1</span>
                <span>CTR: {source.conversionRate}%</span>
            </div>
        </div>
      );
    }

    // 2. PPC Ads
    if (source.source === 'PPC Ads') {
        return (
          <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5 h-full flex flex-col font-sans">
              <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                  <div className="bg-[#3b82f6]/20 p-1.5 rounded-lg text-[#3b82f6]">
                      <Icons.Search size={16} />
                  </div>
                  <span className="text-gray-300 font-medium text-sm">Google Ads (PPC)</span>
              </div>
              <div className="bg-[#0c121e] p-4 rounded-lg flex-1 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-xs font-bold">Sponsored</span>
                      <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-white">L</div>
                          <span className="text-[10px] text-gray-500">lovable.dev</span>
                      </div>
                  </div>
                  <div className="text-[#8ab4f8] text-lg leading-tight hover:underline cursor-pointer mb-1">
                      Best Call Tracking Software - Start Free Trial
                  </div>
                  <div className="text-gray-400 text-sm line-clamp-3">
                      Stop guessing. Start tracking. See which ads drive calls and revenue. Easy setup, real-time reporting, and AI insights.
                  </div>
                  <div className="mt-2 flex gap-4 text-[#8ab4f8] text-sm">
                        <span className="hover:underline cursor-pointer">Pricing</span>
                        <span className="hover:underline cursor-pointer">Features</span>
                        <span className="hover:underline cursor-pointer">Demo</span>
                  </div>
              </div>
              <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                  <span>CPC: $4.20</span>
                  <span>Conv: {source.conversionRate}%</span>
              </div>
          </div>
        );
      }

    // 3. Meta Ads
    if (source.source === 'Meta Ads') {
        return (
            <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5 h-full flex flex-col font-sans">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                    <div className="bg-[#8b5cf6]/20 p-1.5 rounded-lg text-[#8b5cf6]">
                        <Icons.Image size={16} />
                    </div>
                    <span className="text-gray-300 font-medium text-sm">Meta Feed Ad</span>
                </div>
                
                <div className="bg-[#242526] rounded-lg border border-white/5 overflow-hidden flex-1 flex flex-col">
                    {/* FB Header */}
                    <div className="p-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">L</div>
                        <div>
                            <div className="text-white text-xs font-semibold">Lovable Analytics</div>
                            <div className="text-gray-400 text-[10px] flex items-center">Sponsored · <Icons.Globe size={8} className="ml-1"/></div>
                        </div>
                        <Icons.MoreHorizontal size={14} className="text-gray-400 ml-auto" />
                    </div>
                    {/* FB Text */}
                    <div className="px-3 pb-2 text-xs text-gray-200">
                        Stop burning budget on ads that don't convert. 📉 Use our AI-powered tracking to see exactly which campaigns are ringing your phone! 📞✨
                    </div>
                    {/* FB Image Placeholder */}
                    <div className="h-32 bg-gradient-to-br from-indigo-900 to-purple-900 relative flex items-center justify-center group cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        <Icons.BarChart2 size={48} className="text-white/20" />
                        <div className="absolute bottom-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">Get 50% Off</div>
                    </div>
                    {/* FB CTA */}
                    <div className="bg-[#3a3b3c] p-2 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400">LOVABLE.DEV</span>
                            <span className="text-xs text-gray-200 font-semibold">Boost Your ROI Today</span>
                        </div>
                        <button className="bg-gray-600 hover:bg-gray-500 text-white text-xs px-3 py-1.5 rounded font-medium transition-colors">Learn More</button>
                    </div>
                    {/* FB Footer */}
                    <div className="p-2 flex items-center justify-between border-t border-white/5 text-gray-400">
                         <div className="flex items-center gap-1 text-[10px]">
                            <Icons.ThumbsUp size={12} /> <span>1.2k</span>
                         </div>
                         <div className="flex items-center gap-3 text-[10px]">
                             <span className="flex items-center gap-1"><Icons.MessageSquare size={12}/> 45</span>
                             <span className="flex items-center gap-1"><Icons.Share2 size={12}/> 12</span>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    // 4. YouTube Ads
    if (source.source === 'YouTube Ads') {
        return (
            <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5 h-full flex flex-col font-sans">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                    <div className="bg-[#ef4444]/20 p-1.5 rounded-lg text-[#ef4444]">
                        <Icons.Video size={16} />
                    </div>
                    <span className="text-gray-300 font-medium text-sm">YouTube Pre-Roll</span>
                </div>
                
                <div className="bg-black rounded-lg border border-white/5 overflow-hidden flex-1 relative flex flex-col">
                     {/* Video Player Mockup */}
                     <div className="bg-gray-900 aspect-video relative group cursor-pointer flex items-center justify-center">
                         <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
                         <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform z-10">
                             <Icons.Play size={20} className="text-white ml-1" fill="white" />
                         </div>
                         {/* Skip Ad Button */}
                         <div className="absolute bottom-8 right-2 bg-black/80 text-white text-[10px] px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer z-10">
                             <span>Skip Ad</span>
                             <span className="text-gray-400 ml-1">5s</span>
                         </div>
                         {/* Progress Bar */}
                         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                             <div className="w-1/3 h-full bg-[#ef4444]"></div>
                         </div>
                     </div>
                     {/* CTA Overlay Area */}
                     <div className="bg-[#27272a] p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center overflow-hidden">
                                 <span className="text-black font-bold text-xs">L</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white text-xs font-semibold">Lovable</span>
                                <span className="text-gray-400 text-[10px]">lovable.dev</span>
                            </div>
                        </div>
                        <button className="bg-[#3ea6ff] text-[#0f0f0f] text-xs font-bold px-3 py-1.5 rounded-sm hover:bg-[#65b8ff]">
                            Open App
                        </button>
                     </div>
                </div>
            </div>
        );
    }

    // 5. TikTok Posts
    if (source.source === 'TikTok Posts') {
        return (
            <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5 h-full flex flex-col font-sans">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                    <div className="bg-[#ec4899]/20 p-1.5 rounded-lg text-[#ec4899]">
                        <Icons.Video size={16} />
                    </div>
                    <span className="text-gray-300 font-medium text-sm">TikTok Content</span>
                </div>
                
                <div className="bg-black rounded-lg border border-white/5 overflow-hidden flex-1 relative flex items-center justify-center">
                     <div className="relative w-full h-64 bg-gray-900">
                         <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black/90"></div>
                         
                         {/* UI Overlay */}
                         <div className="absolute bottom-4 left-3 right-12">
                             <div className="text-white text-sm font-bold shadow-black drop-shadow-md">@lovable_analytics</div>
                             <div className="text-white text-xs opacity-90 leading-tight mt-1">Day in the life of a sales rep using call tracking 📈 #sales #tech #growth</div>
                             <div className="text-white text-[10px] mt-2 flex items-center gap-1">
                                 <Icons.Music size={10} /> <span>Original Sound - Lovable</span>
                             </div>
                         </div>
                         
                         {/* Right Sidebar */}
                         <div className="absolute bottom-4 right-2 flex flex-col items-center gap-3">
                             <div className="flex flex-col items-center">
                                 <div className="w-8 h-8 rounded-full bg-white p-0.5 mb-1"><div className="w-full h-full bg-black rounded-full"></div></div>
                             </div>
                             <div className="flex flex-col items-center">
                                 <Icons.Heart size={20} className="text-white drop-shadow-md" fill="white" />
                                 <span className="text-white text-[10px] drop-shadow-md">24.5k</span>
                             </div>
                             <div className="flex flex-col items-center">
                                 <Icons.MessageSquare size={20} className="text-white drop-shadow-md" />
                                 <span className="text-white text-[10px] drop-shadow-md">842</span>
                             </div>
                             <div className="flex flex-col items-center">
                                 <Icons.Share2 size={20} className="text-white drop-shadow-md" />
                                 <span className="text-white text-[10px] drop-shadow-md">1.2k</span>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        );
    }

    // 6. Facebook Marketplace
    if (source.source === 'Facebook Marketplace') {
        return (
            <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5 h-full flex flex-col font-sans">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
                    <div className="bg-[#6366f1]/20 p-1.5 rounded-lg text-[#6366f1]">
                        <Icons.ShoppingBag size={16} />
                    </div>
                    <span className="text-gray-300 font-medium text-sm">Marketplace Listing</span>
                </div>
                
                <div className="bg-[#242526] rounded-lg border border-white/5 overflow-hidden flex-1 flex flex-col">
                    <div className="h-32 bg-gray-700 relative flex items-center justify-center">
                        <Icons.Image size={32} className="text-gray-500" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">2 Days Ago</div>
                    </div>
                    <div className="p-3">
                        <div className="text-white font-semibold text-sm">$499</div>
                        <div className="text-gray-200 text-sm leading-tight mt-0.5">Business Phone System Setup - Full Package</div>
                        <div className="text-gray-500 text-xs mt-1">Dallas, TX</div>
                        
                        <div className="mt-3 flex gap-2">
                             <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 rounded font-medium transition-colors">Message</button>
                             <button className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded"><Icons.Share2 size={14}/></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Fallback
    return (
        <div className="bg-[#1f2937] p-4 rounded-xl border border-white/5 h-full flex items-center justify-center text-gray-500 text-sm">
            No creative available
        </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {sources.filter(s => s.source !== 'Referral').map((source, idx) => (
            <div key={idx} className="h-full">
                {renderCreative(source)}
            </div>
        ))}
    </div>
  );
};

export default AdCreativesGallery;