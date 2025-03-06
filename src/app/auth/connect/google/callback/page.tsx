"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken, fetchUserData } = useAuthStore()

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the token from the URL (could be id_token or access_token)
        const token = searchParams.get("access_token");
        
        if (!token) {
          setError("No authentication token received")
          setIsProcessing(false)
          return
        }
        console.log("token", token);
        
        // If we have an access_token, we need to exchange it with the backend
        
        try {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
          const path = "auth/google/callback"
          
          const url = new URL(path, backendUrl)
          url.searchParams.append("access_token", token)
          
          const res = await fetch(url.href)
          const data = await res.json()
          console.log("data", data);
          
          // Set the JWT token from the backend response
          if (data.jwt) {
            setToken(data.jwt)
          } else {
            throw new Error("No JWT received from backend")
          }
        } catch (backendErr) {
          console.error("Error exchanging access token:", backendErr)
          setError("Failed to exchange access token with backend")
          setIsProcessing(false)
          return
        }
        
        
        // Fetch user data with the token
        try {
          await fetchUserData()
        } catch (userDataErr) {
          console.error("Error fetching user data:", userDataErr)
          // Continue even if user data fetch fails
        }
        
        // Show success message
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحبًا بك في فطسني!",
        })
        
        // Redirect to home page
        router.push("/")
      } catch (err) {
        console.error("Error processing authentication callback:", err)
        setError("حدث خطأ أثناء معالجة تسجيل الدخول")
        setIsProcessing(false)
      }
    }

    processCallback()
  }, [searchParams, router, setToken, fetchUserData])

  if (error) {
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-700 mb-2">خطأ في تسجيل الدخول</h1>
          <p className="text-red-600">{error}</p>
          
          <button 
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-xl font-bold mb-2">جاري تسجيل الدخول...</h1>
      <p className="text-gray-500">يرجى الانتظار بينما نقوم بمعالجة تسجيل الدخول الخاص بك.</p>
    </div>
  )
}