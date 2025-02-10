declare interface Joke {
  id: number
  content: string
  status: string
  slug: string
  createdAt: string
  updatedAt: string
  documentId: string
  publishedAt: string
  votes: Array<{
    id: number
    value: "up" | "down" | "neutral"
    ip_address: string | null
    createdAt: string
    updatedAt: string
  }>
  tags: Array<{
    id: number
    title: string
    description: string
    hex_color: string
    slug: string
  }>
  author: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    biography: string
    avatar?: string
  } | null
}

declare interface JokeCardProps {
  joke: Joke
  onReaction: (jokeId: number, reaction: string) => void
  onReport: (jokeId: number) => void
} 