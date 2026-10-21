import { useSyncExternalStore } from 'react'
import { clearEntries, getEntries, subscribe } from '../lib/logStore'

function time(at: number): string {
  return new Date(at).toLocaleTimeString(undefined, { hour12: false })
}

export default function ConsolePanel() {
  const entries = useSyncExternalStore(subscribe, getEntries)

  return (
    <div className="console">
      <div className="console-bar">
        <span className="meta">{entries.length} messages</span>
        <button className="btn btn-sm" onClick={clearEntries}>
          Clear
        </button>
      </div>

      <div className="console-body">
        {entries.length === 0 ? (
          <p className="meta empty">
            Nothing logged yet. <code>console.log()</code> from your code shows up here.
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className={`log log-${entry.level}`}>
              <span className="log-time">{time(entry.at)}</span>
              <pre className="log-text">{entry.text}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
