"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { JokeCard } from "@/components/JokeCard"
import { TagHeader } from "@/components/TagHeader"
import { JokeSkeletonList } from "@/components/skeletons"
import { api } from '@/lib/api'
import { LoadingCard } from "@/components/LoadingCard"

export function TagPageContent() {
  const { slug } = useParams()
  const [jokes, setJokes] = useState<Joke[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const { ref, inView } = useInView()
  const [hasMore, setHasMore] = useState(true)
  const [tagInfo, setTagInfo] = useState<TagResponse['data'][0] | null>(null)

  const fetchJokes = async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.fetchJokes({ 
        page: pageNum,
        pageSize: 10,
        filters: { 
          tags: { slug: { $eq: slug } }
        }
      })
      
      if (data.meta.pagination.page >= data.meta.pagination.pageCount) {
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
        setJokes(data.data)
        setInitialLoadDone(true)
      }
    }
    loadInitialJokes()
  }, [slug])

  useEffect(() => {
    const loadMoreJokes = async () => {
      if (inView && !loading && initialLoadDone) {
        const nextPage = page + 1
        const data = await fetchJokes(nextPage)
        if (data && data.data.length > 0) {
          setJokes(prev => {
            const existingIds = new Set(prev.map(joke => joke.id))
            const newJokes = data.data.filter((joke: Joke) => !existingIds.has(joke.id))
            return [...prev, ...newJokes]
          })
          setPage(nextPage)
        }
      }
    }
    loadMoreJokes()
  }, [inView, loading, page, initialLoadDone, slug])

  useEffect(() => {
    const fetchTagInfo = async () => {
      try {
        const data = await api.fetchTagInfo(slug as string)
        if (data.data.length === 0) {
          setError('لم نتمكن من العثور على التصنيف المطلوب')
          return
        }
        setTagInfo(data.data[0])
      } catch (error) {
        console.error("Error fetching tag info:", error)
        setError('Failed to fetch tag info')
      }
    }

    if (slug) fetchTagInfo()
  }, [slug])

  const handleReaction = (jokeId: number, reaction: string) => {
    if (reaction === "laugh") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
    toast({
      title: "Reaction Recorded",
      description: `You reacted with ${reaction} to the joke!`,
    })
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
      {tagInfo && (
        <TagHeader
          title={tagInfo.title}
          description={tagInfo.description}
          count={tagInfo.jokes.count}
          hexColor={tagInfo.hex_color}
        />
      )}
      <div className="space-y-6">
        {jokes.map((joke, index) => (
          <JokeCard
            key={`joke-${joke.id}-${index}`}
            joke={joke}
            onReaction={handleReaction}
            onReport={handleReport}
          />
        ))}
      </div>
      <div ref={hasMore ? ref : null} className="h-10">
        {loading && <LoadingCard />}
        {!hasMore && jokes.length > 0 && (
          <p className="text-center text-gray-500">لقد وصلت إلى نهاية النكت في هذا التصنيف</p>
        )}
      </div>
    </div>
  )
}