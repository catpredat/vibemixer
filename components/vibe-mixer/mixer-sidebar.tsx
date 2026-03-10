"use client"

import { CloudRain, Wind, Zap, Waves, Bug, Bird, Music, X, Volume2, Activity } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import type { AudioTrackState } from "@/hooks/use-audio-manager"

interface MixerSidebarProps {
  open: boolean
  onClose: () => void
  tracks: AudioTrackState[]
  onVolumeChange: (trackId: string, volume: number) => void
  onSpeedChange: (trackId: string, speed: number) => void
}

const iconMap: Record<string, React.ElementType> = {
  rain: CloudRain,
  wind: Wind,
  thunder: Zap,
  waves: Waves,
  insects: Bug,
  birds: Bird,
  music: Music,
}

export function MixerSidebar({
  open,
  onClose,
  tracks,
  onVolumeChange,
  onSpeedChange,
}: MixerSidebarProps) {
  const natureTracks = tracks.filter((t) => t.type === "nature")
  const musicTrack = tracks.find((t) => t.type === "music")

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-40 flex h-full w-[320px] flex-col bg-white/5 backdrop-blur-xl border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/70">
                  Sound Mixer
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-foreground/70" />
                <span className="sr-only">Close mixer</span>
              </button>
            </div>

            {/* Content - scrollable within viewport */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Nature Sounds - 2x3 Grid */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">
                  Nature Sounds
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {natureTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <NatureTrackCard
                        track={track}
                        onVolumeChange={onVolumeChange}
                        onSpeedChange={onSpeedChange}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Music Section - Single Track */}
              {musicTrack && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-primary">
                    Music
                  </h3>
                  <MusicTrackCard
                    track={musicTrack}
                    onVolumeChange={onVolumeChange}
                  />
                </motion.div>
              )}

              {/* Tip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3"
              >
                <p className="text-[10px] text-foreground/50 text-center">
                  All sounds start muted. Fade in your preferred mix using the sliders.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface NatureTrackCardProps {
  track: AudioTrackState
  onVolumeChange: (trackId: string, volume: number) => void
  onSpeedChange: (trackId: string, speed: number) => void
}

function NatureTrackCard({ track, onVolumeChange, onSpeedChange }: NatureTrackCardProps) {
  const Icon = iconMap[track.icon] || Volume2
  const volumePercent = Math.round(track.volume * 100)
  const isActive = track.volume > 0

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      {/* Header with icon and label */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`relative flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10 ${isActive ? 'text-accent' : 'text-foreground/40'}`}>
          <Icon className="h-3.5 w-3.5" />
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Activity className="h-2.5 w-2.5 text-accent" />
            </motion.div>
          )}
        </div>
        <span className="text-xs text-foreground/70">{track.name}</span>
        <span className="ml-auto text-[10px] text-foreground/50">{volumePercent}%</span>
      </div>

      {/* Volume Slider */}
      <div className="mb-2">
        <Slider
          value={[volumePercent]}
          onValueChange={([value]) => onVolumeChange(track.id, value / 100)}
          max={100}
          step={1}
          className="[&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-accent [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:border-accent [&_[data-slot=slider-thumb]]:bg-accent"
        />
      </div>

      {/* Speed Slider */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-foreground/40 w-6">Spd</span>
        <Slider
          value={[(track.speed - 0.5) / 1.5 * 100]}
          onValueChange={([value]) => onSpeedChange(track.id, 0.5 + (value / 100) * 1.5)}
          max={100}
          step={1}
          className="flex-1 [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-primary/50 [&_[data-slot=slider-thumb]]:h-2 [&_[data-slot=slider-thumb]]:w-2 [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:bg-primary"
        />
        <span className="text-[9px] text-foreground/40 w-6 text-right">{track.speed.toFixed(1)}x</span>
      </div>
    </div>
  )
}

interface MusicTrackCardProps {
  track: AudioTrackState
  onVolumeChange: (trackId: string, volume: number) => void
}

function MusicTrackCard({ track, onVolumeChange }: MusicTrackCardProps) {
  const Icon = iconMap[track.icon] || Music
  const volumePercent = Math.round(track.volume * 100)
  const isActive = track.volume > 0

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 ${isActive ? 'text-primary' : 'text-foreground/40'}`}>
          <Icon className="h-5 w-5" />
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Activity className="h-3 w-3 text-primary" />
            </motion.div>
          )}
        </div>

        {/* Label & Slider */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground/80">{track.name}</span>
            <span className="text-xs text-foreground/50">{volumePercent}%</span>
          </div>
          <Slider
            value={[volumePercent]}
            onValueChange={([value]) => onVolumeChange(track.id, value / 100)}
            max={100}
            step={1}
            className="[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-thumb]]:bg-primary"
          />
        </div>
      </div>
    </div>
  )
}
