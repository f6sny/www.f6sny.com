import { useState, useEffect } from "react"
import { api } from '@/lib/api'

interface Stats {
  total_jokes: number
  deleted_jokes: number
  users: number
  pending_jokes: number
  visits: number
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.fetchStats()
        setStats(data)
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