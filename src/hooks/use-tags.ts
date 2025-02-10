import { useState, useEffect } from 'react'
import { api } from '@/lib/api'



export function useTags() {
  const [tags, setTags] = useState<TagData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await api.fetchTags()
        setTags(data.data)
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  return { tags, loading }
} 