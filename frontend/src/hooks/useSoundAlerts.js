import { useRef, useCallback } from 'react'

// Generate tones using Web Audio API — no external files needed
function createTone(audioCtx, frequency, duration, type = 'sine', volume = 0.3) {
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)

  oscillator.start(audioCtx.currentTime)
  oscillator.stop(audioCtx.currentTime + duration)
}

const SOUNDS = {
  critical: (ctx) => {
    // Urgent triple beep
    createTone(ctx, 880, 0.15, 'square', 0.25)
    setTimeout(() => createTone(ctx, 880, 0.15, 'square', 0.25), 200)
    setTimeout(() => createTone(ctx, 1100, 0.3, 'square', 0.3), 400)
  },
  high: (ctx) => {
    // Double beep
    createTone(ctx, 660, 0.15, 'sine', 0.2)
    setTimeout(() => createTone(ctx, 660, 0.15, 'sine', 0.2), 250)
  },
  medium: (ctx) => {
    // Single soft beep
    createTone(ctx, 440, 0.2, 'sine', 0.15)
  },
  low: (ctx) => {
    // Very soft click
    createTone(ctx, 330, 0.1, 'sine', 0.08)
  },
}

export function useSoundAlerts(enabled = true) {
  const audioCtxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Resume if suspended (browser autoplay policy)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const playAlert = useCallback((severity = 'medium') => {
    if (!enabled) return
    try {
      const ctx = getCtx()
      const soundFn = SOUNDS[severity] || SOUNDS.medium
      soundFn(ctx)
    } catch {
      // Silently fail if audio not available
    }
  }, [enabled, getCtx])

  return { playAlert }
}
