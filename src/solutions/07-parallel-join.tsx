import { useEffect, useState } from 'react'
import type { Post, User } from '../types'

type Authored = Post & { author: string }

export default function ParallelJoinSolution() {
  const [rows, setRows] = useState<Authored[]>([])

  useEffect(() => {
    // Both requests leave at once — Promise.all, not two sequential awaits.
    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts').then((r) => r.json()),
      fetch('https://jsonplaceholder.typicode.com/users').then((r) => r.json()),
    ]).then(([posts, users]: [Post[], User[]]) => {
      const nameById = new Map(users.map((user) => [user.id, user.name]))
      setRows(
        posts.map((post) => ({
          ...post,
          author: nameById.get(post.userId) ?? 'Unknown',
        })),
      )
    })
  }, [])

  return (
    <ul className="plain-list">
      {rows.slice(0, 20).map((row) => (
        <li key={row.id}>
          {row.title} <span className="meta">— by {row.author}</span>
        </li>
      ))}
    </ul>
  )
}
