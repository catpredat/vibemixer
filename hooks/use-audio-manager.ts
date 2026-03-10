"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { Howl, Howler } from "howler"

export interface AudioTrackState {
  id: string
  name: string
  icon: string
  type: "nature" | "music"
  volume: number
  speed: number
  url: string
}

// 1. ปรับ Path ให้ชี้มาที่โฟลเดอร์ public/sounds ในเครื่องคุณ
const AUDIO_URLS: Record<string, string> = {
  rain: "/sounds/Rain.mp3",
  forest: "/sounds/Forest.mp3",   // ใช้ Forest แทนถ้ายังไม่มีไฟล์ forest
  thunder: "/sounds/Rain.mp3", 
  waves: "/sounds/Beach.mp3",
  insects: "/sounds/Forest.mp3",
  birds: "/sounds/Forest.mp3",
  music: "/sounds/Forest.mp3", 
}

export const initialAudioTracks: AudioTrackState[] = [
  { id: "rain", name: "Rain", icon: "rain", type: "nature", volume: 0, speed: 1.0, url: AUDIO_URLS.rain },
  { id: "forest", name: "forest", icon: "forest", type: "nature", volume: 0, speed: 1.0, url: AUDIO_URLS.forest },
  { id: "thunder", name: "Thunder", icon: "thunder", type: "nature", volume: 0, speed: 1.0, url: AUDIO_URLS.thunder },
  { id: "waves", name: "Waves", icon: "waves", type: "nature", volume: 0, speed: 1.0, url: AUDIO_URLS.waves },
  { id: "insects", name: "Insects", icon: "insects", type: "nature", volume: 0, speed: 1.0, url: AUDIO_URLS.insects },
  { id: "birds", name: "Birds", icon: "birds", type: "nature", volume: 0, speed: 1.0, url: AUDIO_URLS.birds },
  { id: "music", name: "Music", icon: "music", type: "music", volume: 0, speed: 1.0, url: AUDIO_URLS.music },
]

export type PlaybackState = "stopped" | "playing" | "paused"

export function useAudioManager(tracks: AudioTrackState[]) {
  const howlsRef = useRef<Map<string, Howl>>(new Map())
  const [isAudioStarted, setIsAudioStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackState, setPlaybackState] = useState<PlaybackState>("stopped")
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const howls = new Map<string, Howl>()
    let loadedCount = 0

    tracks.forEach((track) => {
      const howl = new Howl({
        src: [track.url],
        loop: true,
        volume: 0,
        rate: track.speed,
        html5: true, 
        preload: true,
        onload: () => {
          console.log(`✅ Loaded audio: ${track.url}`)
          loadedCount++
          if (loadedCount === tracks.length) setIsLoading(false)
        },
        onloaderror: (id, err) => {
          console.error(`❌ Error loading: ${track.url}`, err)
          loadedCount++
          // แม้จะโหลดไม่สำเร็จก็ให้เลิก Loading เพื่อให้แอปไปต่อได้
          if (loadedCount === tracks.length) setIsLoading(false)
        },
      })
      howls.set(track.id, howl)
    })

    howlsRef.current = howls

    return () => {
      howls.forEach((howl) => howl.unload())
    }
  }, [])

  const startAudio = useCallback(() => {
    console.log("🚀 Starting Audio Engine...")
    // สำคัญ: ปลุก AudioContext สำหรับเบราว์เซอร์
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume()
    }

    howlsRef.current.forEach((howl, trackId) => {
      const track = tracks.find((t) => t.id === trackId)
      if (track) {
        howl.volume(track.volume)
        howl.play()
      }
    })

    setIsAudioStarted(true)
    setPlaybackState("playing")
  }, [tracks])

  const masterPlay = useCallback(() => {
    howlsRef.current.forEach((howl, trackId) => {
      const track = tracks.find((t) => t.id === trackId)
      if (track && !howl.playing()) {
        howl.volume(track.volume)
        howl.play()
      }
    })
    setPlaybackState("playing")
  }, [tracks])

  const masterPause = useCallback(() => {
    howlsRef.current.forEach((howl) => howl.pause())
    setPlaybackState("paused")
  }, [])

  const masterStop = useCallback(() => {
    howlsRef.current.forEach((howl) => {
      howl.stop()
      howl.seek(0)
    })
    setPlaybackState("stopped")
  }, [])

  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    const howl = howlsRef.current.get(trackId)
    if (howl) {
      // แม้ยังไม่กด Start ก็ยอมให้ปรับค่ารอไว้ได้
      howl.volume(volume)
    }
  }, [])

  const setTrackSpeed = useCallback((trackId: string, speed: number) => {
    const howl = howlsRef.current.get(trackId)
    if (howl) {
      howl.rate(speed)
    }
  }, [])

  const fadeOutAndStop = useCallback((durationMs: number = 5000) => {
    howlsRef.current.forEach((howl) => {
      howl.fade(howl.volume(), 0, durationMs)
      setTimeout(() => {
        howl.stop()
        setPlaybackState("stopped")
      }, durationMs)
    })
  }, [])

  const stopAll = useCallback(() => {
    howlsRef.current.forEach((howl) => {
      howl.stop()
    })
    setPlaybackState("stopped")
  }, [])

  return {
    isAudioStarted,
    isLoading,
    playbackState,
    startAudio,
    masterPlay,
    masterPause,
    masterStop,
    setTrackVolume,
    setTrackSpeed,
    fadeOutAndStop,
    stopAll,
  }
}