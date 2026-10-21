import { useEffect, useState } from 'react'
import type { Photo } from '../types'

const PER_PAGE = 12

const thumbnail = (id: string) => `https://picsum.photos/id/${id}/200/200`

export default function PaginationSolution() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('https://picsum.photos/v2/list?page=1&limit=100')
      .then((res) => res.json())
      .then((data: Photo[]) => setPhotos(data))
  }, [])

  const totalPages = Math.max(1, Math.ceil(photos.length / PER_PAGE))
  const start = (page - 1) * PER_PAGE
  const visible = photos.slice(start, start + PER_PAGE)

  return (
    <div>
      <div className="pager">
        <button className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span className="meta">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      <div className="grid">
        {visible.map((photo) => (
          <figure key={photo.id} className="card">
            <img src={thumbnail(photo.id)} alt={photo.author} width={200} height={200} />
            <figcaption className="meta">{photo.author}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
