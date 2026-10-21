import { useEffect, useMemo, useState } from 'react'
import type { Todo } from '../types'

export default function TodoStatsSolution() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.json())
      .then((data: Todo[]) => setTodos(data))
  }, [])

  const { rows, overall } = useMemo(() => {
    const byUser = new Map<number, { total: number; completed: number }>()

    for (const todo of todos) {
      const entry = byUser.get(todo.userId) ?? { total: 0, completed: 0 }
      entry.total += 1
      if (todo.completed) entry.completed += 1
      byUser.set(todo.userId, entry)
    }

    const rows = [...byUser.entries()]
      .map(([userId, s]) => ({
        userId,
        total: s.total,
        completed: s.completed,
        pct: Math.round((s.completed / s.total) * 100),
      }))
      .sort((a, b) => a.userId - b.userId)

    const completed = todos.filter((t) => t.completed).length
    const overall = todos.length ? Math.round((completed / todos.length) * 100) : 0

    return { rows, overall }
  }, [todos])

  return (
    <div>
      <p className="meta">Overall completion: {overall}%</p>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Completed</th>
            <th>Total</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.userId}>
              <td>{row.userId}</td>
              <td>{row.completed}</td>
              <td>{row.total}</td>
              <td>{row.pct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
