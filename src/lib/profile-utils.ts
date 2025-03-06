import { User } from "@/store/auth-store"

export interface ProfileCompleteness {
  percentage: number
  isComplete: boolean
  missingFields: string[]
  message: string
}

/**
 * Calculate the completeness of a user profile
 * @param user The user object
 * @returns Profile completeness information
 */
export function calculateProfileCompleteness(user: User | null): ProfileCompleteness {
  if (!user) {
    return {
      percentage: 0,
      isComplete: false,
      missingFields: ["all fields"],
      message: "قم بتسجيل الدخول لإكمال ملفك الشخصي"
    }
  }

  const requiredFields: Array<{ key: keyof User; label: string }> = [
    { key: "display_name", label: "الاسم الظاهر" },
    { key: "biography", label: "نبذة عنك" },
    { key: "avatar", label: "الصورة الشخصية" },
    { key: "date_of_birth", label: "تاريخ الميلاد" },
    { key: "gender", label: "الجنس" }
  ]

  const missingFields = requiredFields
    .filter(field => !user[field.key])
    .map(field => field.label)

  const completedFields = requiredFields.length - missingFields.length
  const percentage = Math.round((completedFields / requiredFields.length) * 100)
  const isComplete = missingFields.length === 0

  let message = ""
  if (isComplete) {
    message = "ملفك الشخصي مكتمل"
  } else if (percentage >= 80) {
    message = "ملفك الشخصي مكتمل تقريبًا، أكمل الحقول المتبقية"
  } else if (percentage >= 50) {
    message = "أكمل ملفك الشخصي ليتعرف عليك المستخدمون الآخرون"
  } else {
    message = "ملفك الشخصي غير مكتمل، قم بإضافة المزيد من المعلومات"
  }

  return {
    percentage,
    isComplete,
    missingFields,
    message
  }
}

/**
 * Check if the user has skipped the profile completion dialog
 * @returns Boolean indicating if the dialog has been skipped
 */
export function hasSkippedProfileDialog(): boolean {
  // Only access localStorage on the client side
  if (typeof window === 'undefined') return false
  
  try {
    return localStorage.getItem("skipped_complete_profile_dialog") === "true"
  } catch (e) {
    // Handle any localStorage errors
    console.error("Error accessing localStorage:", e)
    return false
  }
}

/**
 * Set the profile dialog as skipped
 */
export function skipProfileDialog(): void {
  // Only access localStorage on the client side
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem("skipped_complete_profile_dialog", "true")
  } catch (e) {
    console.error("Error setting localStorage:", e)
  }
}

/**
 * Check if the profile completion dialog should be shown
 * @param user The user object
 * @returns Boolean indicating if the dialog should be shown
 */
export function shouldShowProfileDialog(user: User | null): boolean {
  if (!user) return false;
  
  const { isComplete } = calculateProfileCompleteness(user);
  const hasSkipped = hasSkippedProfileDialog();
  
  return !isComplete && !hasSkipped;
} 