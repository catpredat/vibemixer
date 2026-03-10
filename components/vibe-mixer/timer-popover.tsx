"use client"

import { X, Minus, Plus, TimerOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TimerPopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  minutes: number
  onMinutesChange: (minutes: number) => void
  fadeOut: boolean
  onFadeOutChange: (fadeOut: boolean) => void
  onStart: () => void
  timerActive: boolean
  timeRemaining: number
  onCancel: () => void
}

const presetMinutes = [15, 30, 60]

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function TimerPopover({
  open,
  onOpenChange,
  minutes,
  onMinutesChange,
  fadeOut,
  onFadeOutChange,
  onStart,
  timerActive,
  timeRemaining,
  onCancel,
}: TimerPopoverProps) {
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
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-4"
          >
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              {/* Close Button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 rounded-lg p-1 hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-foreground/70" />
                <span className="sr-only">Close timer</span>
              </button>

              {/* Header */}
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Sleep Timer
              </h2>

              {timerActive ? (
                // Active Timer View
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-primary tabular-nums">
                      {formatTime(timeRemaining)}
                    </span>
                    <p className="mt-2 text-sm text-foreground/50">
                      remaining until audio stops
                    </p>
                  </div>

                  {fadeOut && (
                    <p className="mb-6 text-xs text-foreground/40">
                      Audio will fade out gradually
                    </p>
                  )}

                  <Button
                    onClick={() => {
                      onCancel()
                      onOpenChange(false)
                    }}
                    variant="destructive"
                    className="w-full"
                  >
                    <TimerOff className="mr-2 h-4 w-4" />
                    Cancel Timer
                  </Button>
                </div>
              ) : (
                // Timer Setup View
                <>
                  {/* Timer Display */}
                  <div className="mb-6 flex items-center justify-center gap-6">
                    <button
                      onClick={() => onMinutesChange(Math.max(5, minutes - 5))}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <Minus className="h-4 w-4 text-foreground" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-bold text-foreground tabular-nums">
                        {minutes}
                      </span>
                      <span className="text-xs text-foreground/50">minutes</span>
                    </div>
                    <button
                      onClick={() => onMinutesChange(Math.min(180, minutes + 5))}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <Plus className="h-4 w-4 text-foreground" />
                    </button>
                  </div>

                  {/* Preset Times */}
                  <div className="mb-6 flex justify-center gap-2">
                    {presetMinutes.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => onMinutesChange(preset)}
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          minutes === preset
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/5 text-foreground border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {preset}m
                      </button>
                    ))}
                  </div>

                  {/* Fade Out Toggle */}
                  <div className="mb-6 flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <Label
                      htmlFor="fade-out"
                      className="text-sm text-foreground cursor-pointer"
                    >
                      Fade out audio
                    </Label>
                    <Switch
                      id="fade-out"
                      checked={fadeOut}
                      onCheckedChange={onFadeOutChange}
                    />
                  </div>

                  {/* Start Button */}
                  <Button
                    onClick={onStart}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Start Timer
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
