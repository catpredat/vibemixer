"use client"

import { Clock, Save, Share2, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopNavProps {
  presetName: string
  onTimerClick: () => void
  onSaveClick: () => void
  onShareClick: () => void
  timerActive?: boolean
  timeRemaining?: number
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function TopNav({
  presetName,
  onTimerClick,
  onSaveClick,
  onShareClick,
  timerActive,
  timeRemaining = 0,
}: TopNavProps) {
  return (
    <header className="flex items-center justify-between p-4 md:p-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-2xl border border-white/10">
          <Waves className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            VibeMixer
          </span>
          <span className="text-xs text-muted-foreground">
            {presetName}
          </span>
        </div>
      </div>

      {/* Timer countdown (center, if active) */}
      {timerActive && (
        <div className="absolute left-1/2 -translate-x-1/2 transform">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/10">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground tabular-nums">
              Sleep in {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTimerClick}
          className={`h-10 w-10 rounded-xl backdrop-blur-2xl border transition-all ${
            timerActive 
              ? "bg-primary/20 border-primary/30 hover:bg-primary/30" 
              : "bg-white/10 border-white/10 hover:bg-white/15"
          }`}
        >
          <Clock className={`h-4 w-4 ${timerActive ? "text-primary" : "text-foreground"}`} />
          <span className="sr-only">Set Timer</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSaveClick}
          className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/10 hover:bg-white/15 transition-all"
        >
          <Save className="h-4 w-4 text-foreground" />
          <span className="sr-only">Save Preset</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onShareClick}
          className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/10 hover:bg-white/15 transition-all"
        >
          <Share2 className="h-4 w-4 text-foreground" />
          <span className="sr-only">Share Preset</span>
        </Button>
      </div>
    </header>
  )
}
