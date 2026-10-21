// Shared shapes for the APIs used across the challenges.
// Feel free to ignore these and define your own — that's good practice too.

export type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: { street: string; suite: string; city: string; zipcode: string }
  company: { name: string; catchPhrase: string; bs: string }
}

export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export type Todo = {
  userId: number
  id: number
  title: string
  completed: boolean
}

export type Photo = {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export type Forecast = {
  daily_units: Record<string, string>
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
  }
}
