"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Play, Loader2 } from "lucide-react"

interface AudioStartOverlayProps {
  isVisible: boolean
  isLoading: boolean
  onStart: () => void
}

export function AudioStartOverlay({
  isVisible,
  isLoading,
  onStart,
}: AudioStartOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Logo/Title */}
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-wider text-foreground md:text-5xl">
                VibeMixer
              </h1>
              <p className="mt-2 text-sm text-foreground/60">
                Create your perfect ambience
              </p>
            </div>

            {/* Start Button */}
            <motion.button
              onClick={onStart}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 transition-all hover:bg-white/15 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 text-foreground animate-spin" />
              ) : (
                <Play className="h-8 w-8 text-foreground fill-foreground ml-1" />
              )}
            </motion.button>

            <p className="text-xs text-foreground/50">
              {isLoading ? "Loading audio..." : "Tap to begin"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
