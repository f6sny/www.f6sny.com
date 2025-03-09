"use client"

import { useEffect } from 'react'
import { useTagsStore } from '@/store/tags-store'
import { useStatsStore } from '@/store/stats-store'

export function useHydrateStores() {
  const fetchTags = useTagsStore((state) => state.fetchTags)
  const fetchStats = useStatsStore((state) => state.fetchStats)

  useEffect(() => {
    // Hydrate stores on client side
    useTagsStore.persist.rehydrate()
    useStatsStore.persist.rehydrate()

    // Initial fetch if needed
    fetchTags()
    fetchStats()

    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchTags()
      fetchStats()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [fetchTags, fetchStats])
} 