import { useEffect, useState } from 'react'
import type { User } from '../types'

export default function FetchUsersSolution() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
  }, [])

  return (
    <ul className="plain-list">
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
