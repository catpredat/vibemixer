"use client"

import { Instagram, Twitter, Link2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface StatusCardProps {
  presetName: string
  sceneName: string
  vibe: string
  onVibeChange: (vibe: string) => void
}

const vibeOptions = ["Calm", "Focused", "Sleepy", "Energetic", "Meditative"]

export function StatusCard({ presetName, sceneName, vibe, onVibeChange }: StatusCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const mockUrl = `https://vibemixer.app/preset/${presetName.toLowerCase().replace(/\s+/g, "-")}`
    navigator.clipboard.writeText(mockUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-xs rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
      {/* Scene Name */}
      <div className="mb-4">
        <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/40">
          Scene
        </span>
        <p className="text-lg font-semibold text-foreground">{sceneName}</p>
      </div>

      {/* Vibe Selector */}
      <div className="mb-5">
        <span className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-foreground/40">
          Vibe
        </span>
        <Select value={vibe} onValueChange={onVibeChange}>
          <SelectTrigger className="w-full border-white/10 bg-white/5 text-foreground backdrop-blur-sm hover:bg-white/10 focus:ring-primary">
            <SelectValue placeholder="Select vibe" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-black/90 backdrop-blur-xl">
            {vibeOptions.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="focus:bg-white/10"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Share Section */}
      <div>
        <span className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-foreground/40">
          Share
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <Instagram className="h-4 w-4 text-foreground" />
            <span className="sr-only">Share to Instagram</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <Twitter className="h-4 w-4 text-foreground" />
            <span className="sr-only">Share to X</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
            className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            {copied ? (
              <Check className="h-4 w-4 text-accent" />
            ) : (
              <Link2 className="h-4 w-4 text-foreground" />
            )}
            <span className="sr-only">Copy Link</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
