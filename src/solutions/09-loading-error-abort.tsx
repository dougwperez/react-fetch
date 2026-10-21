import { useCallback, useEffect, useState } from 'react'
import type { User } from '../types'

export default function LoadingErrorAbortSolution() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    // Reset from the event, so the effect only does the fetching.
    setLoading(true)
    setError(null)
    setReloadKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetch('https://jsonplaceholder.typicode.com/users', { signal: controller.signal })
      .then((res) => {
        // fetch only rejects on network failure — a 404 still resolves.
        if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((data: User[]) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        // An abort is expected on unmount, not an error worth showing.
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  if (loading) return <p className="meta">Loading…</p>

  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
        <button className="btn" onClick={reload}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <button className="btn" onClick={reload}>
        Reload
      </button>
      <ul className="plain-list">
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
