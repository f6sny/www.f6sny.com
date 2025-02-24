import { useState, useEffect } from "react"
import { strapi } from '@strapi/client';

const client = strapi({ baseURL: 'http://localhost:1337/api' });


export function useStats() {
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await client.fetch('globalcall/counters', { method: 'GET' });
        console.log('stats', await data.json())
        setStats(await data.json())
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
} 