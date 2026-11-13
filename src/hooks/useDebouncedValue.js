import { useState, useEffect } from 'react'

// Returns `value`, delayed by `delayMs`. With delayMs <= 0 it returns `value` at once.
// Used so very large inputs are converted after typing pauses, not on every key.
export default function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value)

  // While no delay applies, keep the stored copy in step. If the delay switches on
  // later (input grows past the threshold), the stored copy is the last value,
  // not stale text from the start of the session.
  // Setting state during render is allowed here because it is conditional.
  if (delayMs <= 0 && debounced !== value) {
    setDebounced(value)
  }

  useEffect(() => {
    if (delayMs <= 0) return undefined
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return delayMs <= 0 ? value : debounced
}