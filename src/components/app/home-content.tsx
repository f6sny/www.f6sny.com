"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { JokeCard } from "@/components/jokes/joke-card"
import { JokeSkeletonList } from "@/components/skeletons"
import { LoadingCard } from "@/components/jokes/loading-card"
import client from '@/lib/api'
import { JokeHandlers } from "@/lib/handlers"

export function HomeContent() {
  const [jokes, setJokes] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const { ref, inView } = useInView()
  const [hasMore, setHasMore] = useState(true)

  const fetchJokes = async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)
      const jokes = client.collection('jokes');

      const data = await jokes.find({
        pagination: {
          page: pageNum,
          pageSize: 10,
        },
        sort: 'updatedAt:desc',
        filters: {
          joke_status: {
            $notIn: ['deleted', 'pending']
          }
        }
     
      })

      console.log('jokes', data.data)

    
      if (data.meta.pagination?.page && data.meta.pagination?.pageCount && data.meta.pagination?.page >= data.meta.pagination?.pageCount) {
        setHasMore(false)
      }
      
      return data
    } catch (error) {
      console.error("Error fetching jokes:", error)
      setError(error instanceof Error ? error.message : 'Failed to fetch jokes')
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadInitialJokes = async () => {
      const data = await fetchJokes(1)
      if (data) {
        console.log(data.data)
        setJokes(data.data as [])
        setInitialLoadDone(true)
      }
    }
    loadInitialJokes()
  }, [])

  useEffect(() => {
    const loadMoreJokes = async () => {
      if (inView && !loading && initialLoadDone) {
        const nextPage = page + 1
        const data = await fetchJokes(nextPage)
        if (data && data.data.length > 0) {
          setJokes(prev => {
            const existingIds = new Set(prev.map((joke: any) => joke.id))
            const newJokes = data.data.filter((joke: any) => !existingIds.has(joke.id))
            return [...prev, ...newJokes]
          })
          setPage(nextPage)
        }
      }
    }
    loadMoreJokes()
  }, [inView, loading, page, initialLoadDone])

  const handleReaction = async (jokeId: string, reaction: string) => {
    const updateState = JokeHandlers.getJokeListUpdater(setJokes);
    await JokeHandlers.handleReaction(jokeId, reaction, updateState);
  }

  const handleReport = (jokeId: number) => {
    toast({
      title: "Joke Reported",
      description: "Thank you for your feedback. We'll review this joke.",
    })
  }

  if (loading && !initialLoadDone) {
    return <JokeSkeletonList />
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  return (
    <div>
      <div className="space-y-6">
        {jokes.map((joke, index) => (
          <JokeCard
            key={`joke-${joke.documentId}`}
            joke={joke}
            onReaction={handleReaction}
            onReport={handleReport}
          />
        ))}
      </div>
      <div ref={hasMore ? ref : null} className="h-10">
        {loading && <LoadingCard />}
        {!hasMore && jokes.length > 0 && (
          <p className="text-center text-gray-500">لقد وصلت إلى نهاية النكت</p>
        )}
      </div>
    </div>
  )
} 