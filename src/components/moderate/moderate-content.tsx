"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/auth-store"
import client from "@/lib/api"
import { JokeCard } from "@/components/jokes/joke-card"
import { Loader2, AlertCircle,  } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Frown, Laugh, Meh } from "lucide-react"
import { JokeHandlers } from "@/lib/handlers"

export function ModerateContent() {
  const [pendingJokes, setPendingJokes] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()

  // Check if user is admin or moderator
  const canModerate = true

  useEffect(() => {

    if (!canModerate) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    fetchPendingJokes()
  }, [canModerate, router])

  const fetchPendingJokes = async () => {
    setLoading(true)
    try {
      // Fetch pending jokes that the user hasn't voted on
      const response = await client.fetch('/jokes/pending', {
        method: 'GET',
      })

      const pendingJokes = await response.json()
      
      setPendingJokes(pendingJokes || [])
    } catch (error) {
      console.error("Error fetching pending jokes:", error)
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من جلب النكات المعلقة",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updatePendingJokes = () => {
    fetchPendingJokes()
  }

  const handleReaction = async (jokeId: string, reaction: string) => {
    setActionLoading(true);
    await JokeHandlers.handleReaction(jokeId, reaction, updatePendingJokes);
    setActionLoading(false);
  }

  const handleNext = () => {
    if (currentIndex < pendingJokes.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>جاري تحميل النكات المعلقة...</span>
        </div>
      </div>
    )
  }

  if (!canModerate) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTitle>غير مصرح</AlertTitle>
          <AlertDescription>
            ليس لديك صلاحية للوصول إلى هذه الصفحة
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (pendingJokes.length === 0) {
    return (
      <div className="">
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertTitle className="text-red-700 text-lg font-bold">لايوجد نكت بإنتظار المراقبة الآن 💔</AlertTitle>
          <AlertDescription className="text-red-600">
            أو إنك شطبت عليهم كلهم طال عمرك, تعال وقت ثاني وإن شاء الله نجيب لك زيادة 😘
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const currentJoke = pendingJokes[currentIndex]

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">مراجعة المحتوى</h1>
        <p className="text-gray-500">
          إذا النكتة عجبت ناس واجد بنعرضها, وإذا ماعجبت ناس واجد راح نمسحها قبل العرض
        </p>
        <p className="text-gray-500 mt-2">
          {currentIndex + 1} من {pendingJokes.length} نكتة معلقة
        </p>
      </div>

      <div className="mb-4">
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-700 font-bold">ساعدنا!</AlertTitle>
          <AlertDescription className="text-amber-600">
            قم بتقييم هذه النكتة إذا كانت تستحق الظهور أو لا.
          </AlertDescription>
        </Alert>
      </div>

      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-800">النكتة تقول</h2>
      </div>

      <div className="mb-6">
        {currentJoke && (
          <JokeCard 
            joke={currentJoke} 
            onReaction={() => Promise.resolve()} 
            onReport={() => {}}
          />
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">وانت وش تقول ؟</h3>
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={() => currentJoke && handleReaction(currentJoke.documentId, "laugh")} 
            variant="outline"
            className="flex-1 max-w-xs border-green-300 hover:bg-green-50 hover:text-green-700"
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <Laugh className="h-6 w-6 text-green-500 mr-2" />}
            تستاهل
          </Button>
          
          <Button 
            onClick={() => currentJoke && handleReaction(currentJoke.documentId, "meh")} 
            variant="outline"
            className="flex-1 max-w-xs border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <Meh className="h-6 w-6 text-gray-500 mr-2" />}
            عادية
          </Button>
          
          <Button 
            onClick={() => currentJoke && handleReaction(currentJoke.documentId, "frown")} 
            variant="outline"
            className="flex-1 max-w-xs border-red-300 hover:bg-red-50 hover:text-red-700"
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <Frown className="h-6 w-6 text-red-500 mr-2" />}
            ما تستاهل
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex gap-2">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || actionLoading}
            variant="outline"
          >
            السابق
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex >= pendingJokes.length - 1 || actionLoading}
            variant="outline"
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  )
} 