import { useState, useEffect } from 'react'
import client from '@/lib/api'
export function useTags() {
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await client.collection('tags').find({
          populate: {
            jokes: {
              count: true,
            },
          },
        })
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