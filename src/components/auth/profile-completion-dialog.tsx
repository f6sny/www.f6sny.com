"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { shouldShowProfileDialog, skipProfileDialog } from "@/lib/profile-utils"

export function ProfileCompletionDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    // Don't automatically show on page load/refresh
    // Instead, listen for a custom event
    const handleProfileEvent = () => {
      if (user && shouldShowProfileDialog(user)) {
        // Don't show if the welcome dialog should be shown
        const justRegistered = sessionStorage.getItem('just_registered') === 'true';
        
        if (!justRegistered) {
          setIsOpen(true);
        }
      }
    };
    
    window.addEventListener('show-profile-dialog', handleProfileEvent);
    
    return () => {
      window.removeEventListener('show-profile-dialog', handleProfileEvent);
    };
  }, [user]);

  const handleSkip = () => {
    skipProfileDialog();
    setIsOpen(false);
  };

  const handleGoToSettings = () => {
    setIsOpen(false);
    router.push("/account/settings");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent dir="rtl" className="sm:max-w-[425px]">
        <DialogHeader dir="rtl">
          <DialogTitle dir="rtl">أكمل ملفك الشخصي</DialogTitle>
          <DialogDescription dir="rtl">
            أكمل ملفك الشخصي للحصول على تجربة أفضل وتفاعل أكثر مع المستخدمين الآخرين.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-500">
            إكمال ملفك الشخصي يساعد المستخدمين الآخرين على التعرف عليك بشكل أفضل ويزيد من فرص التفاعل مع محتواك.
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button onClick={handleGoToSettings} className="w-full">
            إكمال الملف الشخصي
          </Button>
          <Button variant="ghost" onClick={handleSkip} className="w-full">
            تخطي
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 