import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { strapi } from '@strapi/client';

const client = strapi({ baseURL: 'http://localhost:1337/api' });


interface StatsState {
  stats: any | null
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
          const data = await client.fetch('globalcall/counters', { method: 'GET' });
          const jsonData = await data.json();
          console.log('stats', jsonData)
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
    }
  )
) 