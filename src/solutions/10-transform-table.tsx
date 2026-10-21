import { useEffect, useState } from 'react'
import type { Forecast } from '../types'

type Row = {
  date: string
  max: number
  min: number
  range: number
  rain: number
}

const ENDPOINT =
  'https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276' +
  '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum' +
  '&timezone=UTC&forecast_days=14'

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function TransformTableSolution() {
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then((data: Forecast) => {
        const { time, temperature_2m_max, temperature_2m_min, precipitation_sum } = data.daily

        // Zip the parallel arrays — index i is the same day in every one of them.
        setRows(
          time.map((date, i) => {
            const max = temperature_2m_max[i]
            const min = temperature_2m_min[i]
            return {
              date,
              max,
              min,
              range: Number((max - min).toFixed(1)),
              rain: precipitation_sum[i],
            }
          }),
        )
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Something went wrong'),
      )
  }, [])

  if (error) return <p className="error">{error}</p>

  const warmest = rows.reduce<Row | null>(
    (best, row) => (best === null || row.max > best.max ? row : best),
    null,
  )

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Day</th>
          <th>High °C</th>
          <th>Low °C</th>
          <th>Range</th>
          <th>Rain mm</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.date}>
            <td>
              {formatDay(row.date)}
              {row.date === warmest?.date && <span className="badge">warmest</span>}
            </td>
            <td>{row.max}</td>
            <td>{row.min}</td>
            <td>{row.range}</td>
            <td>{row.rain}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
