import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth } from '@/lib/auth'

interface User {
  id: number
  documentId?: string
  username: string
  email: string
  biography?: string
  display_name?: string
  avatar?:  { url: string }
  confirmed?: boolean
  blocked?: boolean
  role?: any
  date_of_birth?: string
  gender?: "male" | "female"
  restriction?: "strict" | "moderate" | "open"
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        // Set the token for future API requests
        auth.setToken(token);
        
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        // Clear the token
        auth.setToken('');
        
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },
    }),
    {
      name: 'auth-storage',
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // When the stored value is loaded, set the token for API requests
      onRehydrateStorage: () => (state) => {
        if (state?.token && auth.setToken) {
          auth.setToken(state.token)
        }
      },
    }
  )
) 