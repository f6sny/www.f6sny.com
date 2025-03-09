"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Confetti } from "@/components/ui/confetti"

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Use a more specific flag that won't persist across page refreshes
    const checkWelcomeDialog = () => {
      if (typeof window === 'undefined') return;
      
      const justRegistered = sessionStorage.getItem('just_registered') === 'true';
      
      if (justRegistered) {
        // Clear the flag immediately to prevent showing on refresh
        sessionStorage.removeItem('just_registered');
        
        // Show the welcome dialog
        setIsOpen(true);
        setShowConfetti(true);
      }
    };
    
    // Check once on mount
    checkWelcomeDialog();
    
    // Also listen for a custom event that can be triggered by the auth dialog
    const handleWelcomeEvent = () => {
      setIsOpen(true);
      setShowConfetti(true);
    };
    
    window.addEventListener('show-welcome-dialog', handleWelcomeEvent);
    
    return () => {
      window.removeEventListener('show-welcome-dialog', handleWelcomeEvent);
    };
  }, []);

  const handleGoToProfile = () => {
    setIsOpen(false);
    router.push("/account/settings");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent dir="rtl" className="sm:max-w-[425px]">
          {showConfetti && <Confetti />}
          <DialogHeader dir="rtl">
            <DialogTitle dir="rtl">مرحبًا بك في فطسني!</DialogTitle>
            <DialogDescription dir="rtl">
              نحن سعداء بانضمامك إلينا. دعنا نساعدك على البدء.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-500">
              يمكنك الآن مشاركة النكات والتفاعل مع المحتوى. لتحسين تجربتك، ننصحك بإكمال ملفك الشخصي.
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <Button onClick={handleGoToProfile} className="w-full">
              إكمال الملف الشخصي
            </Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)} className="w-full">
              لاحقاً
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 