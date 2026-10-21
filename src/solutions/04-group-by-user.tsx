import { useEffect, useMemo, useState } from 'react'
import type { Post } from '../types'

export default function GroupByUserSolution() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data))
  }, [])

  const grouped = useMemo(() => {
    const counts = posts.reduce<Record<number, number>>((acc, post) => {
      acc[post.userId] = (acc[post.userId] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([userId, count]) => ({ userId: Number(userId), count }))
      .sort((a, b) => b.count - a.count)
  }, [posts])

  return (
    <ul className="plain-list">
      {grouped.map(({ userId, count }) => (
        <li key={userId}>
          User {userId} <span className="meta">— {count} posts</span>
        </li>
      ))}
    </ul>
  )
}
