import { useEffect, useMemo, useState } from 'react'
import type { Post } from '../types'

export default function SearchFilterSolution() {
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data))
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return posts
    return posts.filter((post) => post.title.toLowerCase().includes(term))
  }, [posts, search])

  return (
    <div>
      <input
        className="field"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search titles…"
      />
      <p className="meta">
        {filtered.length} of {posts.length} posts
      </p>
      <ul className="plain-list">
        {filtered.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
