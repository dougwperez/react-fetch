import { useEffect, useMemo, useState } from 'react'
import type { User } from '../types'

type Direction = 'asc' | 'desc'

export default function SortUsersSolution() {
  const [users, setUsers] = useState<User[]>([])
  const [direction, setDirection] = useState<Direction>('asc')

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
  }, [])

  const sorted = useMemo(() => {
    // Copy before sorting — .sort() mutates in place.
    return [...users].sort((a, b) =>
      direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    )
  }, [users, direction])

  return (
    <div>
      <button
        className="btn"
        onClick={() => setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
      >
        Name {direction === 'asc' ? '↑' : '↓'}
      </button>
      <ul className="plain-list">
        {sorted.map((user) => (
          <li key={user.id}>
            {user.name} <span className="meta">— {user.address.city}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
