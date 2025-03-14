"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { JokeCard } from "@/components/jokes/joke-card"
import { TagHeader } from "@/components/tags/page-header"
import { JokeSkeletonList } from "@/components/skeletons"
import { LoadingCard } from "@/components/jokes/loading-card"
import client from '@/lib/api'
import { JokeHandlers } from "@/lib/handlers"

export function TagPageContent() {
  const { slug } = useParams()
  const [jokes, setJokes] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const { ref, inView } = useInView()
  const [hasMore, setHasMore] = useState(true)
  const [tagInfo, setTagInfo] = useState<any['data'][0] | null>(null)

  const fetchJokes = async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await client.collection('jokes').find({ 
        pagination: {
          page: pageNum,
          pageSize: 10,
        },
        sort: 'updatedAt:desc',
        filters: { 
          tags: { slug: { $eq: [decodeURIComponent(slug as string)] } },
          joke_status: {
            $notIn: ['deleted', 'pending']
          }
        }
      })
      
      if (data.meta?.pagination?.page && data.meta?.pagination?.pageCount && data.meta?.pagination?.page >= data.meta?.pagination?.pageCount) {
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
            const newJokes = data.data.filter((joke: any) => !existingIds.has(joke.id))
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
        const data = await client.collection('tags').find({
          filters: { slug: { $eq: decodeURIComponent(slug as string) } },
          populate: {
            jokes: {
              count: true
            }
          }
        })
        if (data.data.length > 0) {
          setTagInfo(data.data[0])
        }
      } catch (error) {
        console.error("Error fetching tag info:", error)
      }
    }
    
    if (slug) fetchTagInfo()
  }, [slug])

  const handleReaction = async (jokeId: string, reaction: string) => {
    const updateState = JokeHandlers.getJokeListUpdater(setJokes);
    await JokeHandlers.handleReaction(jokeId, reaction, updateState);
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
            onReport={JokeHandlers.handleReport}
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