"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { JokeCard } from "@/components/jokes/joke-card"
import { JokeSkeletonList } from "@/components/skeletons"
import { LoadingCard } from "@/components/jokes/loading-card"
import { useInView } from "react-intersection-observer"
import client from '@/lib/api'
import { JokeHandlers } from "@/lib/handlers"
import { Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  
  const [jokes, setJokes] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const { ref, inView } = useInView()
  const [hasMore, setHasMore] = useState(true)
  const [totalResults, setTotalResults] = useState(0)

  const fetchJokes = async (pageNum: number) => {
    if (!query) return null
    const searchTerm = decodeURIComponent(query)
    
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
          $or: [
            { content: { $containsi: searchTerm } },
            { author: { username: { $containsi: searchTerm } } },
            { author: { display_name: { $containsi: searchTerm } } },
            { tags: { title: { $containsi: searchTerm } } }
          ],
          joke_status: {
            $notIn: ['deleted', 'pending']
          }
        }
      })
      
      if (data.meta?.pagination) {
        setTotalResults(data.meta.pagination.total)
        
        if (data.meta.pagination.page >= data.meta.pagination.pageCount) {
          setHasMore(false)
        }
      }
      
      return data
    } catch (error) {
      console.error("Error searching jokes:", error)
      setError(error instanceof Error ? error.message : 'Failed to search jokes')
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Reset state when query changes
    setJokes([])
    setPage(1)
    setHasMore(true)
    setInitialLoadDone(false)
    
    const loadInitialJokes = async () => {
      const data = await fetchJokes(1)
      if (data) {
        setJokes(data.data)
        setInitialLoadDone(true)
      }
    }
    
    loadInitialJokes()
  }, [query])

  useEffect(() => {
    const loadMoreJokes = async () => {
      if (inView && !loading && initialLoadDone && hasMore) {
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
  }, [inView, loading, page, initialLoadDone, hasMore, query])

  const handleReaction = async (jokeId: string, reaction: string) => {
    const updateState = JokeHandlers.getJokeListUpdater(setJokes);
    await JokeHandlers.handleReaction(jokeId, reaction, updateState);
  }

  if (!query) {
    return (
      <div className="">
        <div className="">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">ابحث عن نكتة</h1>
          <p className="text-gray-500">
            استخدم شريط البحث في الأعلى للبحث عن نكتة أو مستخدم أو تصنيف
          </p>
        </div>
      </div>
    )
  }

  if (loading && !initialLoadDone) {
    return (
      <div className="">
        <h1 className="">نتائج البحث عن: {query}</h1>
        <JokeSkeletonList />
      </div>
    )
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-2">نتائج البحث عن: {query}</h1>
      <p className="text-gray-500 mb-6">تم العثور على {totalResults} نتيجة</p>
      
      {error && (
        <div className="text-center text-red-500 p-4 mb-6">{error}</div>
      )}
      
      {jokes.length === 0 && initialLoadDone ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">لم يتم العثور على أي نتائج تطابق بحثك</p>
          <p className="text-gray-400 mt-2">حاول استخدام كلمات مفتاحية مختلفة</p>
        </div>
      ) : (
        <>
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
          
          <div ref={hasMore ? ref : null} className="h-10 mt-4">
            {loading && <LoadingCard />}
            {!hasMore && jokes.length > 0 && (
              <p className="text-center text-gray-500">لقد وصلت إلى نهاية نتائج البحث</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

