import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import client from "@/lib/api"


interface StatsState {
  stats: any | null
  loading: boolean
  error: string | null
  fetchStats: () => Promise<void>
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: null,
      loading: false,
      error: null,
      fetchStats: async () => {
        if (get().stats !== null && !get().loading) {
          return;
        }
        
        set({ loading: true, error: null })
        try {
          const data = await client.fetch('globalcall/counters', { method: 'GET' });
          const jsonData = await data.json();
          set({ stats: jsonData, loading: false })
        } catch (error) {
          set({ error: 'Failed to fetch stats', loading: false })
          console.error('Error fetching stats:', error)
        }
      },
    }),
    {
      name: 'stats-storage',
      skipHydration: true,
      partialize: (state) => ({ stats: state.stats }),
    }
  )
) 