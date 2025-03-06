import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth } from '@/lib/auth'

export interface User {
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
  isLoading?: boolean
  login: (identifier: string, password: string) => Promise<User>
  register: (username: string, email: string, password: string) => Promise<User>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setToken: (token: string) => void
  fetchUserData: () => Promise<User>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (identifier: string, password: string) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) throw new Error(data.error?.message || 'Login failed');
          
          // Set the token for future API requests
          auth.setToken(data.jwt);
          
          set({ user: data.user, token: data.jwt, isAuthenticated: true });
          
          // Return the user data
          return data.user;
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
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
      register: async (username: string, email: string, password: string) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) throw new Error(data.error?.message || 'Registration failed');
          
          // Set the token for future API requests
          auth.setToken(data.jwt);
          
          set({ 
            user: data.user,
            token: data.jwt,
            isAuthenticated: true 
          });
          
          // Store token in localStorage
          localStorage.setItem('token', data.jwt);
          
          return data.user;
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },
      setToken: (token: string) => {
        // Store the token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwt', token);
        }
        
        // Update the state
        set({ token });
        
        // Update the API client's authorization header
        if (auth) {
          auth.setToken(token);
        }
      },
      fetchUserData: async () => {
        try {
          // Get the current token
          const token = get().token;
          
          if (!token) {
            throw new Error("No authentication token");
          }
          
          // Fetch the user data from the API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const userData = await response.json();
          
          // Update the state
          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false
          });
          
          return userData;
        } catch (error) {
          console.error("Error fetching user data:", error);
          
          // Clear the auth state on error
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: null
          });
          
          // Clear the token from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt');
          }
          
          throw error;
        }
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