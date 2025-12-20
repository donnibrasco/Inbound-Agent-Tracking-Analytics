import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TERRITORIES } from '../constants';
import { Icons } from './Icons';

// Helper to generate a simple SVG sparkline string
const generateSparkline = (data: number[], width: number, height: number, color: string) => {
  if (!data || data.length < 2) return '';
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const availHeight = height - padding * 2;

  const pointsArr = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    // Invert Y because SVG coordinates start from top-left
    const normalizedVal = (val - min) / range;
    const y = height - padding - (normalizedVal * availHeight); 
    return `${x},${y}`;
  });
  const points = pointsArr.join(' ');
  const lastPoint = pointsArr[pointsArr.length - 1].split(',');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
      <defs>
        <linearGradient id="gradient-${color.replace('#', '')}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="3" fill="${color}" />
    </svg>
  `;
};

const TerritoryMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [32.7767, -96.7970],
        zoom: 10,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter / Positron based on theme could be complex, 
      // but dark_all looks great in dark and we can use CSS filters for light if needed.
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      L.control.attribution({
        position: 'bottomleft'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    TERRITORIES.forEach((t) => {
      const colorHex = t.status === 'High' ? '#10b981' : t.status === 'Medium' ? '#f59e0b' : '#f43f5e';
      const colorClass = t.status === 'High' ? 'bg-emerald-500' : t.status === 'Medium' ? 'bg-amber-500' : 'bg-rose-500';
      
      const customIcon = L.divIcon({
        className: 'custom-territory-marker',
        html: `
          <div class="relative group">
            <div class="w-4 h-4 rounded-full border-2 border-card shadow-lg ${colorClass} relative z-10 transition-transform duration-300 hover:scale-125"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${colorClass} opacity-20 animate-ping"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([t.coordinates.lat, t.coordinates.lng], { icon: customIcon }).addTo(map);
      
      const sparklineSvg = generateSparkline(t.history, 160, 40, colorHex);

      const popupContent = `
        <div class="min-w-[180px] p-2 bg-card rounded-lg border border-border">
          <div class="font-bold text-foreground mb-1 text-base">${t.name}</div>
          <div class="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span>Clients: ${t.clients}</span>
            <span class="${t.growth > 0 ? 'text-emerald-500' : 'text-rose-500'} font-semibold">${t.growth > 0 ? '+' : ''}${t.growth}%</span>
          </div>
          <div class="border-t border-border pt-2">
            <div class="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">Growth Trend</div>
            ${sparklineSvg}
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'custom-popup'
      });
      
      marker.on('mouseover', function () { this.openPopup(); });
      marker.on('mouseout', function () { this.closePopup(); });
    });
  }, []);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-3 min-h-[400px] transition-colors duration-300">
      
      <div className="col-span-2 relative border-r border-border min-h-[300px]">
        <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-background" />

        <div className="absolute top-6 left-6 z-10 flex items-center space-x-2 pointer-events-none">
            <div className="bg-card/80 backdrop-blur-sm p-2 rounded-lg flex items-center space-x-2 border border-border shadow-sm">
              <Icons.MapPin className="text-accent" size={16}/>
              <h3 className="text-foreground font-semibold text-sm">Dallas Territory Map</h3>
            </div>
        </div>

        <div className="absolute top-6 right-6 z-10 flex space-x-2 text-xs font-medium">
             <div className="bg-card/80 backdrop-blur-sm p-2 rounded-lg border border-border shadow-sm flex space-x-3">
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div><span className="text-gray-500">High</span></div>
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div><span className="text-gray-500">Med</span></div>
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-rose-500 mr-2"></div><span className="text-gray-500">Low</span></div>
            </div>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col bg-card border border-border rounded-md overflow-hidden shadow-xl z-10">
            <button onClick={handleZoomIn} className="p-2 hover:bg-foreground/5 text-gray-500 border-b border-border transition-colors"><Icons.Plus size={16} /></button>
            <button onClick={handleZoomOut} className="p-2 hover:bg-foreground/5 text-gray-500 transition-colors"><span className="text-lg font-bold leading-none block px-1">-</span></button>
        </div>
      </div>

      <div className="bg-card flex flex-col z-10 relative">
          <div className="p-4 border-b border-border">
             <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Region Performance</h4>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] p-2 custom-scrollbar">
            {TERRITORIES.map((territory) => (
                <div 
                  key={territory.id} 
                  className="p-4 hover:bg-foreground/5 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                  onClick={() => {
                     mapInstanceRef.current?.flyTo([territory.coordinates.lat, territory.coordinates.lng], 12);
                  }}
                >
                    <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${territory.status === 'High' ? 'bg-emerald-500' : territory.status === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                        <div>
                            <div className="text-foreground text-sm font-medium">{territory.name}</div>
                            <div className="text-gray-500 text-xs">{territory.clients} clients</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-foreground text-sm font-bold">${(territory.revenue / 1000).toFixed(1)}k</div>
                        <div className={`text-xs flex items-center justify-end font-bold ${territory.growth > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {territory.growth > 0 ? <Icons.TrendingUp size={10} className="mr-1"/> : <Icons.TrendingDown size={10} className="mr-1"/>}
                            {Math.abs(territory.growth)}%
                        </div>
                    </div>
                </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default TerritoryMap;