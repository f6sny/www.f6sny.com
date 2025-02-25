import { useState, useEffect } from "react"
import client from "@/lib/api"

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