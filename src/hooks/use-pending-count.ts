"use client"

import { useState, useEffect } from "react"
import client from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"

export function usePendingCount() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user, isAuthenticated } = useAuthStore()

  const canModerate = true

  useEffect(() => {
    if (!isAuthenticated || !canModerate) {
      setCount(0)
      setLoading(false)
      return
    }

    const fetchPendingCount = async () => {
      try {
        const response = await client.fetch('/jokes/pending', {
          method: 'GET',
        })

        const pendingJokes = await response.json()
        const pendingCount = pendingJokes.length
        setCount(pendingCount)
      } catch (error) {
        console.error("Error fetching pending count:", error)
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingCount()

    // Refresh every minute
    const interval = setInterval(fetchPendingCount, 60000)
    
    return () => clearInterval(interval)
  }, [isAuthenticated, canModerate])

  return { count, loading }
} 