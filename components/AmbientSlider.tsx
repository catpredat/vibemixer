'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AmbientSliderProps {
  label: string;
  volume: number;
  onChange: (value: number) => void;
  icon: LucideIcon;
}

export const AmbientSlider: React.FC<AmbientSliderProps> = ({ label, volume, onChange, icon: Icon }) => {
  return (
    <div className="flex items-center gap-2 w-full p-1 rounded-xl bg-white/5 border border-white/10">
      <div className="text-white/40 shrink-0">
        <Icon size={14} />
      </div>
      
      <div className="flex-1 relative h-4 flex items-center group cursor-pointer">
        <div className="absolute w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-150"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>

      <span className="text-[9px] font-mono text-white/30 shrink-0 w-6 text-right">
        {Math.round(volume * 100)}
      </span>
    </div>
  );
};
