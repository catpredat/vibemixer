'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react';
import { Track } from '@/lib/audio-data';

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenLibrary: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onOpenLibrary,
}) => {
  return (
    <div className="w-full p-2 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
      <div className="flex flex-col min-w-0">
        <h2 className="text-sm font-light tracking-tight text-white truncate">
          {currentTrack?.title || 'Select a track'}
        </h2>
        <p className="text-[8px] text-white/30 font-medium uppercase tracking-[0.2em] truncate">
          {currentTrack?.artist || 'VibeMixer'}
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onPrev}
            className="text-white/30 hover:text-white transition-colors"
          >
            <SkipBack size={16} />
          </button>
          
          <button 
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
          </button>

          <button 
            onClick={onNext}
            className="text-white/30 hover:text-white transition-colors"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <button 
          onClick={onOpenLibrary}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 transition-all"
        >
          <ListMusic size={14} />
        </button>
      </div>
    </div>
  );
};
