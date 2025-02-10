import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'

interface TagsState {
  tags: TagData[]
  loading: boolean
  error: string | null
  fetchTags: () => Promise<void>
}

export const useTagsStore = create<TagsState>()(
  persist(
    (set) => ({
      tags: [],
      loading: false,
      error: null,
      fetchTags: async () => {
        try {
          set({ loading: true, error: null })
          const data = await api.fetchTags()
          set({ tags: data.data, loading: false })
        } catch (error) {
          set({ error: 'Failed to fetch tags', loading: false })
          console.error('Error fetching tags:', error)
        }
      },
    }),
    {
      name: 'tags-storage',
      skipHydration: true, // Important for NextJS
    }
  )
) 