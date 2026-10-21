// A tiny subscribable store that mirrors everything written to console.*
// so the app can render it in a panel instead of hiding it in devtools.

export type Level = 'log' | 'info' | 'warn' | 'error'

export type Entry = {
  id: number
  level: Level
  text: string
  at: number
}

const MAX_ENTRIES = 300

let entries: Entry[] = []
let nextId = 1
const listeners = new Set<() => void>()

let flushQueued = false

// User code often logs *during* render. Notifying subscribers synchronously
// would setState mid-render, so coalesce notifications into a microtask.
function emit() {
  if (flushQueued) return
  flushQueued = true
  queueMicrotask(() => {
    flushQueued = false
    for (const listener of listeners) listener()
  })
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getEntries(): Entry[] {
  return entries
}

export function clearEntries(): void {
  entries = []
  emit()
}

export function push(level: Level, text: string): void {
  entries = [...entries, { id: nextId++, level, text, at: Date.now() }].slice(-MAX_ENTRIES)
  emit()
}

// eslint-disable-next-line no-control-regex
const ANSI = /\u001b\[[0-9;]*m/g

const stripAnsi = (text: string) => text.replace(ANSI, '')

function stringify(value: unknown): string {
  if (typeof value === 'string') return value
  if (value instanceof Error) return `${value.name}: ${value.message}`
  if (typeof value === 'function') return `ƒ ${value.name || '(anonymous)'}`
  if (typeof value === 'undefined') return 'undefined'

  const seen = new WeakSet<object>()
  try {
    return JSON.stringify(
      value,
      (_key, val: unknown) => {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) return '[Circular]'
          seen.add(val)
        }
        return val
      },
      2,
    )
  } catch {
    return String(value)
  }
}

function format(args: unknown[]): string {
  return args.map(stringify).join(' ')
}

let installed = false

/** Patch console once, at app start. The original still writes to devtools. */
export function installConsoleHook(): void {
  if (installed) return
  installed = true

  const levels: Level[] = ['log', 'info', 'warn', 'error']

  for (const level of levels) {
    const original = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      // React's dev build re-logs each message with ANSI colouring for its
      // component stacks. Let that pass through to devtools, but don't
      // duplicate it in the panel.
      const isReactRelog = typeof args[0] === 'string' && ANSI.test(args[0])
      ANSI.lastIndex = 0
      if (!isReactRelog) push(level, stripAnsi(format(args)))
      original(...args)
    }
  }

  window.addEventListener('error', (event) => {
    push('error', event.message)
  })

  window.addEventListener('unhandledrejection', (event) => {
    push('error', `Unhandled rejection: ${stringify(event.reason)}`)
  })
}
