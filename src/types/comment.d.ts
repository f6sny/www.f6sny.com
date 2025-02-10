declare interface Comment {
  id: number
  content: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  likes: number
}

declare interface CommentsProps {
  jokeId?: number
} 