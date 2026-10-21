import { useCallback, useEffect, useState } from 'react'

// Progress lives in localStorage — per browser, per origin. Nothing here needs a
// server, and ten booleans don't need a database. Note that Vite handing you a
// different port (5174 when 5173 is taken) is a different origin, so a different
// store. Every access is guarded: Safari private mode throws on write, and we'd
// rather lose the progress than the app.
const KEY = 'rfc:completed:v1'

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? new Set(parsed.filter((id) => typeof id === 'string')) : new Set()
  } catch {
    return new Set()
  }
}

function write(completed: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...completed]))
  } catch {
    // Storage unavailable (private mode, disabled cookies). Progress stays in
    // memory for this session only.
  }
}

export type Progress = {
  completed: Set<string>
  isDone: (id: string) => boolean
  toggle: (id: string) => void
  reset: () => void
  count: number
}

export function useProgress(): Progress {
  const [completed, setCompleted] = useState(read)

  // Persisting in an effect rather than inside the updater keeps the updater
  // pure, which is what React asks for — StrictMode runs updaters twice.
  useEffect(() => {
    write(completed)
  }, [completed])

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }, [])

  const reset = useCallback(() => setCompleted(new Set()), [])

  return {
    completed,
    isDone: (id) => completed.has(id),
    toggle,
    reset,
    count: completed.size,
  }
}
