"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { JokeCard } from "@/components/JokeCard"
import { toast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"
import { Comments } from "@/components/Comments"
import { api } from '@/lib/api'

export function JokePageContent() {
  const { slug } = useParams()
  const [joke, setJoke] = useState<Joke | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        setLoading(true)
        const data = await api.fetchJokes({ 
          filters: { slug: { $eq: slug } },
          page: 1,
          pageSize: 1
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
        onReport={handleReport}
      />
      <Comments />
    </div>
  )
} 