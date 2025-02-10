declare interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

declare interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
} 