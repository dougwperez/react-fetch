import { useEffect, useState } from 'react'
import type { Post, User } from '../types'

export default function DependentFetchSolution() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
  }, [])

  useEffect(() => {
    if (selectedId === null) return

    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${selectedId}`)
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data))
      .finally(() => setLoadingPosts(false))
  }, [selectedId])

  function selectUser(id: number) {
    if (id === selectedId) return
    // Flip to loading from the event that caused it, not inside the effect.
    setLoadingPosts(true)
    setSelectedId(id)
  }

  return (
    <div>
      <div className="chip-row">
        {users.map((user) => (
          <button
            key={user.id}
            className={`chip${selectedId === user.id ? ' chip-on' : ''}`}
            onClick={() => selectUser(user.id)}
          >
            {user.name}
          </button>
        ))}
      </div>

      {selectedId === null ? (
        <p className="meta">Select a user.</p>
      ) : loadingPosts ? (
        <p className="meta">Loading posts…</p>
      ) : (
        <ul className="plain-list">
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
