'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Visualizer } from '@/components/Visualizer';
import { MixerPanel } from '@/components/MixerPanel';
import { LibraryMenu } from '@/components/LibraryMenu';
import { MUSIC_LIBRARY as INITIAL_MUSIC, AMBIENT_SOUNDS as INITIAL_AMBIENT, Track } from '@/lib/audio-data';
import { Play, Sliders, Timer, Clock, Eye, EyeOff, Music2, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function VibeMixer() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'music' | 'ambient' | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [videoUrl, setVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-over-the-mountains-4402-preview.mp4');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Dynamic Data States
  const [musicLibrary, setMusicLibrary] = useState<Track[]>(INITIAL_MUSIC);
  const [ambientSounds, setAmbientSounds] = useState(INITIAL_AMBIENT);
  
  const [ambientVolumes, setAmbientVolumes] = useState<Record<string, number>>({
    rain: 0.3,
    forest: 0.2,
    thunder: 0,
    wind: 0,
    waves: 0,
    cafe: 0,
  });

  const ambientHowls = useRef<Record<string, Howl>>({});
  const musicHowl = useRef<Howl | null>(null);

  // 1. PWA Registration & Remote Config Fetch
  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(() => console.log('VibeMixer: Ready to install'))
          .catch(err => console.error('SW Registration Failed', err));
      });
    }

    // Fetch Remote Config
    fetch('/config.json')
      .then(res => res.json())
      .then(data => {
        if (data.music) setMusicLibrary(data.music);
        if (data.ambient) setAmbientSounds(data.ambient);
        console.log('VibeMixer: Config updated from cloud');
      })
      .catch(() => console.log('VibeMixer: Using local audio data'));
  }, []);

  // Timer Logic
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      Object.values(ambientHowls.current).forEach(howl => howl.stop());
      if (musicHowl.current) musicHowl.current.stop();
      setIsPlaying(false);
      setTimeLeft(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Media Session API Logic - สำหรับควบคุมผ่านหน้า Lock Screen และหูฟัง
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: 'VibeMixer Cinematic',
        album: 'Ambient Experience',
        artwork: [
          { src: 'https://cdn-icons-png.flaticon.com/512/3659/3659744.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => toggleMusic());
      navigator.mediaSession.setActionHandler('pause', () => toggleMusic());
      navigator.mediaSession.setActionHandler('previoustrack', () => handlePrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => handleNext());
    }
  }, [currentTrack, isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeAmbients = Object.entries(ambientVolumes)
    .filter(([_, vol]) => vol > 0)
    .map(([key]) => ambientSounds[key as keyof typeof ambientSounds]?.name || key);

  // Initialize Ambient Sounds
  useEffect(() => {
    const currentHowls = ambientHowls.current;
    Object.entries(ambientSounds).forEach(([key, data]) => {
      currentHowls[key] = new Howl({
        src: [data.url],
        loop: true,
        volume: ambientVolumes[key],
        html5: true,
      });
    });

    return () => {
      Object.values(currentHowls).forEach(howl => howl.unload());
    };
  }, [ambientSounds]);

  // Sync Ambient Volumes
  useEffect(() => {
    Object.entries(ambientVolumes).forEach(([key, volume]) => {
      if (ambientHowls.current[key]) {
        ambientHowls.current[key].volume(volume);
      }
    });
  }, [ambientVolumes]);

  // Sync Music Volume
  useEffect(() => {
    if (musicHowl.current) {
      musicHowl.current.volume(musicVolume);
    }
  }, [musicVolume]);

  const handleStart = () => {
    setIsStarted(true);
    Object.values(ambientHowls.current).forEach(howl => howl.play());
    if (!currentTrack) {
      handleSelectTrack(musicLibrary[0]);
    }
  };

  const setVolume = (key: string, value: number) => {
    setAmbientVolumes(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectTrack = (track: Track) => {
    if (musicHowl.current) {
      musicHowl.current.stop();
      musicHowl.current.unload();
    }

    setCurrentTrack(track);
    setVideoUrl(track.videoUrl);
    setVideoLoaded(false);
    setIsPlaying(true);

    musicHowl.current = new Howl({
      src: [track.url],
      html5: true,
      volume: musicVolume,
      onend: () => handleNext(),
    });

    musicHowl.current.play();
  };

  const toggleMusic = () => {
    if (!musicHowl.current) return;
    if (isPlaying) {
      musicHowl.current.pause();
    } else {
      musicHowl.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = musicLibrary.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % musicLibrary.length;
    handleSelectTrack(musicLibrary[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = musicLibrary.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + musicLibrary.length) % musicLibrary.length;
    handleSelectTrack(musicLibrary[prevIndex]);
  };

  return (
    <main className="relative h-screen w-full flex items-center justify-center font-sans overflow-hidden">
      <div className="fixed inset-0 z-[-100] bg-[#050505]" />

      <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.video
            key={videoUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: videoLoaded ? 0.7 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            onLoadedData={() => setVideoLoaded(true)}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 z-[-5] bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] animate-gradient opacity-30" />

      <div className="relative w-full max-w-md h-full sm:h-[90vh] sm:aspect-[9/16] overflow-hidden bg-black/20 sm:rounded-[3rem] sm:border-[8px] sm:border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-[2px]">
        
        <div className="relative z-10 h-full flex flex-col items-center justify-between p-8 gpu-accelerated pointer-events-none">
          <header className="w-full flex justify-between items-start pt-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
              <h1 className="text-xl font-light tracking-tighter text-white/80">VibeMixer</h1>
              <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-medium">Cinematic Ambient</span>
            </motion.div>
            
            <AnimatePresence>
              {isStarted && currentTrack && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-end text-right">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Now Playing</span>
                  <span className="text-xs font-light text-white/90 truncate max-w-[120px]">{currentTrack.title}</span>
                  {activeAmbients.length > 0 && (
                    <span className="text-[7px] text-white/20 font-medium uppercase tracking-widest mt-1">
                      {activeAmbients.join(' + ')} Active
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center w-full -mt-20">
            <AnimatePresence mode="wait">
              {!isStarted ? (
                <motion.button
                  key="start-btn"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                  onClick={handleStart}
                  className="group relative flex flex-col items-center gap-6 pointer-events-auto"
                >
                  <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-xl group-hover:bg-white/10 transition-all duration-500">
                    <Play size={28} className="text-white ml-1 group-hover:scale-110 transition-transform" fill="currentColor" />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-light group-hover:text-white transition-colors">Enter Experience</span>
                </motion.button>
              ) : (
                <AnimatePresence>
                  {showVisualizer && (
                    <motion.div key="visualizer" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center gap-8">
                      <Visualizer isPlaying={isPlaying} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </AnimatePresence>
          </div>

          <footer className="w-full flex justify-center pb-8">
            <div className="flex flex-col items-center gap-4">
              <AnimatePresence>
                {isStarted && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-1">
                    {[40, 70, 45, 90, 65, 30, 85, 50, 75, 40, 60, 35].map((h, i) => (
                      <div key={i} className="w-0.5 h-1.5 bg-white/10 rounded-full" />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </footer>
        </div>

        {/* Floating Action Buttons */}
        <AnimatePresence>
          {isStarted && (
            <div className="absolute bottom-8 right-8 z-30 flex flex-col items-end gap-3">
              <AnimatePresence>
                {isTimerOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} className="flex flex-col gap-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 mb-2">
                    {[15, 30, 60].map((mins) => (
                      <button key={mins} onClick={() => { setTimeLeft(mins * 60); setIsTimerOpen(false); }} className="px-4 py-2 text-[10px] uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        {mins}m
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-row items-center gap-4">
                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setActivePanel('music')} className={`w-12 h-12 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all shadow-2xl ${activePanel === 'music' ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'}`}>
                  <Music2 size={20} />
                </motion.button>

                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setActivePanel('ambient')} className={`w-12 h-12 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all shadow-2xl ${activePanel === 'ambient' ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'}`}>
                  <Wind size={20} />
                </motion.button>

                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setShowVisualizer(!showVisualizer)} className={`w-12 h-12 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all shadow-2xl ${showVisualizer ? 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20' : 'bg-white/30 text-white'}`}>
                  {showVisualizer ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>

                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setIsTimerOpen(!isTimerOpen)} className={`relative w-12 h-12 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all shadow-2xl ${timeLeft !== null ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'}`}>
                  {timeLeft !== null ? (
                    <span className="text-[9px] font-mono font-bold">{formatTime(timeLeft)}</span>
                  ) : (
                    <Timer size={20} />
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </AnimatePresence>

        <MixerPanel 
          isOpen={activePanel !== null} onClose={() => setActivePanel(null)} view={activePanel || 'music'}
          musicVolume={musicVolume} onMusicVolumeChange={setMusicVolume}
          ambientVolumes={ambientVolumes} onVolumeChange={setVolume}
          currentTrack={currentTrack} isPlaying={isPlaying} onTogglePlay={toggleMusic}
          onNext={handleNext} onPrev={handlePrev} onOpenLibrary={() => setIsLibraryOpen(true)}
        />

        <LibraryMenu 
          isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)}
          onSelectTrack={handleSelectTrack} currentTrackId={currentTrack?.id}
        />
      </div>
    </main>
  );
}