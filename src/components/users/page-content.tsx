"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import { JokeCard } from "@/components/jokes/joke-card"
import { UserHeader } from "@/components/users/page-header"
import { JokeSkeletonList } from "@/components/skeletons"
import client from '@/lib/api'
import { LoadingCard } from "@/components/jokes/loading-card"
import { JokeHandlers } from "@/lib/handlers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function UserPageContent() {
  const { username } = useParams()
  const [jokes, setJokes] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const { ref, inView } = useInView()
  const [hasMore, setHasMore] = useState(true)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("jokes")

  const fetchJokes = async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await client.collection('jokes').find({ 
        filters: {
          author: {
            username: {
              $eq: username as string
            }
          },
          joke_status: {
            $notIn: ['deleted', 'pending']
          }
        },
        pagination: {
          page: pageNum,
          pageSize: 10
        }
      })
      
      if (data.data.length === 0 || 
          (data.meta?.pagination?.page && data.meta?.pagination?.pageCount && 
           data.meta?.pagination?.page >= data.meta?.pagination?.pageCount)) {
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
        if (data.data.length === 0) {
          setHasMore(false)
        }
        setInitialLoadDone(true)
      }
    }
    loadInitialJokes()
  }, [username])

  useEffect(() => {
    const loadMoreJokes = async () => {
      if (inView && !loading && initialLoadDone && activeTab === "jokes") {
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
  }, [inView, loading, page, initialLoadDone, username, activeTab])

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await client.collection('users').find({
          filters: { username: { $eq: username as string } },
          populate: ['avatar']
        })
        
        if (data.data.length > 0) {
          // Get joke count
          const jokesCount = await client.collection('jokes').find({
            filters: {
              author: {
                username: {
                  $eq: username as string
                }
              },
              joke_status: {
                $notIn: ['deleted', 'pending']
              }
            },
            pagination: {
              page: 1,
              pageSize: 1
            }
          })
          
          setUserInfo({
            ...data.data[0],
            jokes: {
              count: jokesCount.meta?.pagination?.total || 0
            }
          })
        }
      } catch (error) {
        console.error("Error fetching user info:", error)
      }
    }
    
    if (username) fetchUserInfo()
  }, [username])

  const handleReaction = async (jokeId: string, reaction: string) => {
    const updateState = JokeHandlers.getJokeListUpdater(setJokes);
    await JokeHandlers.handleReaction(jokeId, reaction, updateState);
  }

  // Reset pagination when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "jokes") {
      setPage(1);
      setHasMore(true);
    }
  };

  if (loading && !initialLoadDone) {
    return <JokeSkeletonList />
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  return (
    <div>
      {userInfo && (
        <UserHeader
          username={userInfo.username}
          name={`${userInfo.display_name}`}
          biography={userInfo.biography}
          avatar={userInfo.avatar}
          jokeCount={userInfo.jokes.count}
        />
      )}
      
      <div className="mt-6">
        <Tabs dir="rtl" defaultValue="jokes" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jokes" className="flex items-center justify-center gap-2">
              <span>النكات</span>
              {userInfo && (
                <span className="inline-flex items-center justify-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-800">
                  {userInfo.jokes.count}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center justify-center gap-2">
              <span>التعليقات</span>
              <span className="inline-flex items-center justify-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-800">
                0
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="jokes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>النكات</CardTitle>
                <CardDescription>
                التي قام {userInfo?.display_name || userInfo?.username || username} بنشرها
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jokes.length > 0 ? (
                  <div className="space-y-6">
                    {jokes.map((joke, index) => (
                      <JokeCard
                        key={`joke-${joke.id}-${index}`}
                        joke={joke}
                        onReaction={handleReaction}
                        onReport={JokeHandlers.handleReport}
                      />
                    ))}
                    
                    <div ref={hasMore ? ref : null} className="h-10">
                      {loading && <LoadingCard />}
                      {!hasMore && jokes.length > 0 && (
                        <p className="text-center text-gray-500">لقد وصلت إلى نهاية النكت لهذا المستخدم</p>
                      )}
                    </div>
                  </div>
                ) : initialLoadDone && !loading ? (
                  <div className="text-center py-10 text-gray-500">
                    لم يشارك هذا المستخدم أي نكات بعد
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>التعليقات</CardTitle>
                <CardDescription>
                  التي قام {userInfo?.display_name || userInfo?.username || username} بنشرها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  لم يشارك {userInfo?.display_name || userInfo?.username || username} بأي تعليقات بعد.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 