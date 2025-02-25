"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { JokeCard } from "@/components/jokes/joke-card"
import { Comments } from "@/components/comments/section"
import client from '@/lib/api'
import { JokeHandlers } from "@/lib/handlers"

export function JokePageContent() {
  const { slug } = useParams()
  const [joke, setJoke] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        setLoading(true)
        const data = await client.collection('jokes').find({ 
          filters: { slug: { $eq: decodeURIComponent(slug as string) } },
          pagination: { 
            page: 1,
            pageSize: 1
          }
        })
        
        if (data.data.length === 0) {
          setError('لم نتمكن من العثور على النكتة المطلوبة')
          return
        }
        
        if (data.data.length > 1) {
          setError('وجدنا أكثر من نكتة بنفس العنوان! الرجاء إبلاغ المسؤول')
          return
        }

        setJoke(data.data[0])
      } catch (error) {
        setError('Failed to fetch joke')
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchJoke()
  }, [slug])

  const handleReaction = async (jokeId: string, reaction: string) => {
    const updateState = JokeHandlers.getSingleJokeUpdater(setJoke);
    await JokeHandlers.handleReaction(jokeId, reaction, updateState);
  }

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-1">
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-500 mt-2">
                يمكنك العودة إلى <a href="/" className="underline">الصفحة الرئيسية</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!joke) {
    return null
  }

  return (
    <div className="space-y-8">
      <JokeCard 
        joke={joke}
        onReaction={handleReaction}
        onReport={JokeHandlers.handleReport}
      />
      <Comments />
    </div>
  )
} 