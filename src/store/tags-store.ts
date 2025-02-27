import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import client from '@/lib/api'


interface TagsState {
  tags: any[]
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
          const data = await client.collection('tags').find({
            populate: {
              jokes:{
                count: true,
              }
            },
          })

          console.log(data.data)
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