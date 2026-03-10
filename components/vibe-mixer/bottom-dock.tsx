"use client"

import Image from "next/image"
import type { Scene } from "@/app/page"
import type { PlaybackState } from "@/hooks/use-audio-manager"
import { cn } from "@/lib/utils"
import { Play, Pause, Square } from "lucide-react"

interface BottomDockProps {
  scenes: Scene[]
  currentScene: Scene
  onSceneChange: (scene: Scene) => void
  playbackState: PlaybackState
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  timerActive?: boolean
  timeRemaining?: number
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function BottomDock({
  scenes,
  currentScene,
  onSceneChange,
  playbackState,
  onPlay,
  onPause,
  onStop,
  timerActive,
  timeRemaining = 0,
}: BottomDockProps) {
  // Split scenes for left and right sides
  const leftScenes = scenes.slice(0, Math.ceil(scenes.length / 2))
  const rightScenes = scenes.slice(Math.ceil(scenes.length / 2))

  return (
    <div className="flex justify-center pb-6 px-4">
      {/* Unified Glassmorphic Dock */}
      <div className="flex w-full max-w-5xl items-center rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 p-2 md:p-3 gap-4 md:gap-6 shadow-2xl shadow-black/30">
        {/* Left Scene Thumbnails */}
        <div className="flex flex-1 justify-start gap-2">
          {leftScenes.map((scene) => (
            <SceneThumbnail
              key={scene.id}
              scene={scene}
              isActive={currentScene.id === scene.id}
              onClick={() => onSceneChange(scene)}
            />
          ))}
        </div>

        {/* Center Master Controls - Elevated Pill (perfectly centered) */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xl px-3 py-2 border border-white/20 shadow-lg shadow-black/20">
            {/* Play Button - Hero Size */}
            <button
              onClick={onPlay}
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
                playbackState === "playing"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-white/10 hover:bg-white/20 text-foreground"
              )}
            >
              <Play className="h-5 w-5 ml-0.5" />
              {/* Glow effect when playing */}
              {playbackState === "playing" && (
                <span className="absolute inset-0 rounded-full bg-primary/30 blur-md -z-10 animate-pulse" />
              )}
              <span className="sr-only">Play all</span>
            </button>

            {/* Pause Button */}
            <button
              onClick={onPause}
              disabled={playbackState !== "playing"}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                playbackState === "paused"
                  ? "bg-accent/80 text-accent-foreground"
                  : "hover:bg-white/15 text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              <Pause className="h-4 w-4" />
              <span className="sr-only">Pause all</span>
            </button>

            {/* Stop Button */}
            <button
              onClick={onStop}
              disabled={playbackState === "stopped"}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                "hover:bg-white/15 text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              <Square className="h-3.5 w-3.5" />
              <span className="sr-only">Stop all</span>
            </button>
          </div>

          {/* Timer indicator below controls */}
          {timerActive && (
            <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
              <span className="text-xs font-medium text-primary tabular-nums">
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        {/* Right Scene Thumbnails */}
        <div className="flex flex-1 justify-end gap-2">
          {rightScenes.map((scene) => (
            <SceneThumbnail
              key={scene.id}
              scene={scene}
              isActive={currentScene.id === scene.id}
              onClick={() => onSceneChange(scene)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SceneThumbnail({
  scene,
  isActive,
  onClick,
}: {
  scene: Scene
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300",
        isActive
          ? "ring-2 ring-primary ring-offset-2 ring-offset-transparent scale-105"
          : "hover:ring-1 hover:ring-white/40 hover:scale-102 opacity-80 hover:opacity-100"
      )}
    >
      <div className="relative h-12 w-20 md:h-14 md:w-24">
        <Image
          src={scene.thumbnail}
          alt={scene.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isActive
              ? "bg-primary/10"
              : "bg-black/40 group-hover:bg-black/20"
          )}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1">
        <span className="text-[8px] font-medium text-white/90 md:text-[9px]">
          {scene.name}
        </span>
      </div>
    </button>
  )
}
