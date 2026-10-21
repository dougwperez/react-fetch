import { useCallback, useMemo, useState } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import ConsolePanel from './components/ConsolePanel'
import { compile, type CompileResult } from './lib/compile'
import { clearEntries } from './lib/logStore'
import { DEFAULT_CSS, entries, type Entry } from './registry'

type Tab = 'tsx' | 'css' | 'solution'
type Buffer = { tsx: string; css: string }

const storageKey = (id: string, kind: 'tsx' | 'css') => `rfc:${kind}:${id}`

function load(id: string, kind: 'tsx' | 'css', fallback: string): string {
  try {
    return localStorage.getItem(storageKey(id, kind)) ?? fallback
  } catch {
    return fallback
  }
}

function save(id: string, kind: 'tsx' | 'css', value: string): void {
  try {
    localStorage.setItem(storageKey(id, kind), value)
  } catch {
    // Private windows and blocked site data — not worth failing the edit over.
  }
}

export default function App() {
  const [activeId, setActiveId] = useState(entries[0].id)
  const [tab, setTab] = useState<Tab>('tsx')
  const [seed, setSeed] = useState(0)
  const [runId, setRunId] = useState(0)
  const [result, setResult] = useState<CompileResult | null>(null)
  const [bottom, setBottom] = useState<'console' | 'compiled'>('console')

  const [buffers, setBuffers] = useState<Record<string, Buffer>>(() => {
    const initial: Record<string, Buffer> = {}
    for (const entry of entries) {
      initial[entry.id] = {
        tsx: load(entry.id, 'tsx', entry.starter),
        css: load(entry.id, 'css', DEFAULT_CSS),
      }
    }
    return initial
  })

  const active: Entry = useMemo(
    () => entries.find((entry) => entry.id === activeId) ?? entries[0],
    [activeId],
  )
  const buffer = buffers[active.id]

  const update = useCallback(
    (kind: 'tsx' | 'css', value: string) => {
      setBuffers((prev) => ({ ...prev, [active.id]: { ...prev[active.id], [kind]: value } }))
      save(active.id, kind, value)
    },
    [active.id],
  )

  const run = useCallback(() => {
    clearEntries()
    setResult(compile(tab === 'solution' ? active.solution : buffers[active.id].tsx))
    setRunId((n) => n + 1)
  }, [active.solution, active.id, buffers, tab])

  // Stale output from another challenge is worse than none, so clear on switch.
  function selectChallenge(id: string) {
    if (id === active.id) return
    setActiveId(id)
    setResult(null)
    setTab('tsx')
    clearEntries()
  }

  function reset() {
    if (tab === 'solution') return
    const value = tab === 'css' ? DEFAULT_CSS : active.starter
    update(tab, value)
    setSeed((n) => n + 1)
  }

  const editorValue =
    tab === 'solution' ? active.solution : tab === 'css' ? buffer.css : buffer.tsx

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="brand">Fetch Challenges</h1>
        <nav>
          {entries.map((entry) => (
            <button
              key={entry.id}
              className={`nav-item${entry.id === active.id ? ' nav-item-on' : ''}`}
              onClick={() => selectChallenge(entry.id)}
            >
              <span className="nav-num">{entry.id}</span>
              {entry.title}
            </button>
          ))}
        </nav>
      </aside>

      <section className="col col-editor">
        <header className="head">
          <div>
            <h2 className="title">
              {active.id}. {active.title}
            </h2>
            <code className="path">src/challenges/{active.file}</code>
          </div>
        </header>

        <details className="brief">
          <summary>Brief</summary>
          <pre>{active.brief}</pre>
        </details>

        <div className="tabs">
          {(['tsx', 'css', 'solution'] as const).map((name) => (
            <button
              key={name}
              className={`tab${tab === name ? ' tab-on' : ''}`}
              onClick={() => setTab(name)}
            >
              {name === 'tsx' ? 'Your code' : name === 'css' ? 'CSS' : 'Solution'}
            </button>
          ))}

          <div className="tabs-right">
            <button className="btn btn-sm" onClick={reset} disabled={tab === 'solution'}>
              Reset
            </button>
            <button className="btn btn-sm btn-run" onClick={run}>
              Run ⌘↵
            </button>
          </div>
        </div>

        <Editor
          docKey={`${active.id}:${tab}:${seed}`}
          value={editorValue}
          language={tab === 'css' ? 'css' : 'tsx'}
          readOnly={tab === 'solution'}
          onChange={tab === 'solution' ? undefined : (next) => update(tab, next)}
          onRun={run}
        />
      </section>

      <section className="col col-output">
        <Preview
          Component={result?.ok ? result.Component : null}
          error={result && !result.ok ? result.error : null}
          userCss={buffer.css}
          runId={runId}
          hasRun={result !== null}
        />

        <div className="bottom">
          <div className="tabs tabs-bottom">
            {(['console', 'compiled'] as const).map((name) => (
              <button
                key={name}
                className={`tab${bottom === name ? ' tab-on' : ''}`}
                onClick={() => setBottom(name)}
              >
                {name === 'console' ? 'Console' : 'Compiled JS'}
              </button>
            ))}
          </div>

          {bottom === 'console' ? (
            <ConsolePanel />
          ) : (
            <pre className="compiled">
              {result?.js ? result.js : '// Run your code to see the compiled output.'}
            </pre>
          )}
        </div>
      </section>
    </div>
  )
}
