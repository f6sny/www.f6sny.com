"use client"

import { useAuthStore } from "@/store/auth-store"
import { calculateProfileCompleteness } from "@/lib/profile-utils"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

interface ProfileCompletenessProps {
  hideButton?: boolean;
}

export function ProfileCompleteness({ hideButton = false }: ProfileCompletenessProps) {
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  
  // Automatically hide button if we're already on the settings page
  const isOnSettingsPage = pathname?.includes('/account/settings')
  const shouldHideButton = hideButton || isOnSettingsPage
  
  const { percentage, isComplete, missingFields, message } = calculateProfileCompleteness(user)
  
  if (isComplete) return null
  
  return (
    <div className="mb-6 bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">اكتمال الملف الشخصي ({percentage}%)</h3>
        {!shouldHideButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push("/account/settings")}
          >
            إكمال الملف
          </Button>
        )}
      </div>
      
      <Progress value={percentage} className="h-2 mb-3" />
      
      <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
        <AlertCircle className="h-4 w-4 ml-2" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      {missingFields.length > 0 && (
        <div className="mt-2 text-sm text-gray-500">
          <span>الحقول المتبقية: </span>
          {missingFields.map((field, index) => (
            <span key={field}>
              {field}{index < missingFields.length - 1 ? "، " : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  )
} 