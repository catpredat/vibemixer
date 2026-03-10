'use client';

import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { MUSIC_LIBRARY, Track } from '@/lib/audio-data';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (track: Track) => void;
  currentTrackId?: string;
}

export const LibraryMenu: React.FC<LibraryMenuProps> = ({
  isOpen,
  onClose,
  onSelectTrack,
  currentTrackId,
}) => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Calm', 'Focus', 'Moody', 'Energetic'];

  const filteredTracks = MUSIC_LIBRARY.filter(track => {
    const matchesCategory = filter === 'All' || track.category === filter || track.mood === filter;
    const matchesSearch = track.title.toLowerCase().includes(search.toLowerCase()) || 
                         track.artist.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="absolute inset-0 z-50 flex items-end justify-center p-0"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          
          <div className="relative w-full h-[85%] bg-[#121212] rounded-t-[2.5rem] border-t border-white/10 shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-light text-white">Music Library</h3>
              <button onClick={onClose} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input 
                  type="text"
                  placeholder="Search tracks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="w-full overflow-x-auto no-scrollbar scroll-smooth pointer-events-auto touch-auto">
                <div className="inline-flex flex-row flex-nowrap min-w-full pb-2 gap-2 pr-10">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest whitespace-nowrap transition-all flex-shrink-0 ${
                        filter === cat 
                          ? 'bg-white text-black' 
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-2 no-scrollbar">
              {filteredTracks.map(track => (
                <button
                  key={track.id}
                  onClick={() => {
                    onSelectTrack(track);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    currentTrackId === track.id 
                      ? 'bg-white/10 border border-white/20' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-sm font-medium ${currentTrackId === track.id ? 'text-white' : 'text-white/80'}`}>
                      {track.title}
                    </span>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest">{track.artist}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {currentTrackId === track.id && (
                      <div className="flex gap-0.5 items-end h-3">
                        <div className="w-0.5 bg-white animate-music-bar-1" />
                        <div className="w-0.5 bg-white animate-music-bar-2" />
                        <div className="w-0.5 bg-white animate-music-bar-3" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
