import { useEffect, useRef, useCallback } from 'react'

/**
 * Polls a fetch function every `interval` ms.
 * Calls onNewItems(newItems) when new items appear (compared by id field).
 */
export function useAutoRefresh({ fetchFn, interval = 30000, onNewItems, enabled = true }) {
  const knownIds = useRef(new Set())
  const timerRef = useRef(null)

  const poll = useCallback(async () => {
    try {
      const items = await fetchFn()
      const newItems = items.filter(item => !knownIds.current.has(item.id))
      if (newItems.length > 0) {
        newItems.forEach(item => knownIds.current.add(item.id))
        onNewItems?.(newItems)
      } else {
        // Still register all ids on first run
        items.forEach(item => knownIds.current.add(item.id))
      }
    } catch {
      // silently ignore poll errors
    }
  }, [fetchFn, onNewItems])

  useEffect(() => {
    if (!enabled) return
    poll() // initial seed — don't fire notifications on first load
    timerRef.current = setInterval(poll, interval)
    return () => clearInterval(timerRef.current)
  }, [enabled, interval, poll])
}
