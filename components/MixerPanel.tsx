'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sliders, CloudRain, Trees, CloudLightning, Wind, Waves, Coffee } from 'lucide-react';
import { AmbientSlider } from './AmbientSlider';
import { MusicPlayer } from './MusicPlayer';
import { Track, AMBIENT_SOUNDS } from '@/lib/audio-data';

const ICON_MAP: Record<string, any> = {
  CloudRain,
  Trees,
  CloudLightning,
  Wind,
  Waves,
  Coffee,
};

interface MixerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  view: 'music' | 'ambient';
  musicVolume: number;
  onMusicVolumeChange: (value: number) => void;
  ambientVolumes: Record<string, number>;
  onVolumeChange: (key: string, value: number) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenLibrary: () => void;
}

export const MixerPanel: React.FC<MixerPanelProps> = ({
  isOpen,
  onClose,
  view,
  musicVolume,
  onMusicVolumeChange,
  ambientVolumes,
  onVolumeChange,
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onOpenLibrary,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 h-[50%] pointer-events-auto"
          >
            <div className="h-full bg-white/10 backdrop-blur-3xl border-t border-white/20 rounded-t-[3rem] shadow-2xl flex flex-col overflow-hidden">
              {/* Handle */}
              <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="px-6 py-1.5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Sliders size={14} className="text-white/60" />
                  <h3 className="text-xs font-light text-white tracking-wide">
                    {view === 'music' ? 'Music Settings' : 'Ambient Mix'}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-3 flex flex-col gap-2.5">
                {view === 'music' ? (
                  /* Music Section - Ultra Compact */
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7px] uppercase tracking-[0.3em] text-white/20 font-medium ml-1">Music Layer</span>
                      <MusicPlayer 
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                        onTogglePlay={onTogglePlay}
                        onNext={onNext}
                        onPrev={onPrev}
                        onOpenLibrary={onOpenLibrary}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1 px-1">
                      <span className="text-[7px] uppercase tracking-[0.3em] text-white/20 font-medium">Volume</span>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={musicVolume}
                        onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  </div>
                ) : (
                  /* Ambient Section - 2x3 Grid */
                  <div className="flex flex-col gap-0.5 w-full">
                    <span className="text-[7px] uppercase tracking-[0.3em] text-white/20 font-medium ml-1">Ambient Mix</span>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-full">
                      {Object.values(AMBIENT_SOUNDS).map((sound) => (
                        <AmbientSlider 
                          key={sound.id}
                          label={sound.name} 
                          volume={ambientVolumes[sound.id]} 
                          onChange={(val) => onVolumeChange(sound.id, val)} 
                          icon={ICON_MAP[sound.icon] || Coffee}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
