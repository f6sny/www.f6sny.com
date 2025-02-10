import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'

interface Stats {
  total_jokes: number
  deleted_jokes: number
  users: number
  pending_jokes: number
  visits: number
}

interface StatsState {
  stats: Stats | null
  loading: boolean
  error: string | null
  fetchStats: () => Promise<void>
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      stats: null,
      loading: false,
      error: null,
      fetchStats: async () => {
        try {
          set({ loading: true, error: null })
          const data = await api.fetchStats()
          set({ stats: data, loading: false })
        } catch (error) {
          set({ error: 'Failed to fetch stats', loading: false })
          console.error('Error fetching stats:', error)
        }
      },
    }),
    {
      name: 'stats-storage',
      skipHydration: true,
    }
  )
) 