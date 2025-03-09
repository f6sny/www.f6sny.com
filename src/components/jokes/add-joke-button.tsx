"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddJokeModal } from "@/components/jokes/add-joke-modal"
import { useAuthStore } from "@/store/auth-store"
import { AuthDialog } from "@/components/auth/auth-dialog"

export function AddJokeButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const handleClick = () => {
    if (isAuthenticated) {
      setIsOpen(true)
    } else {
      setShowAuthDialog(true)
    }
  }

  return (
    <>
      <Button 
        onClick={handleClick} 
        className="fixed bottom-6 left-6 rounded-full shadow-lg h-14 w-14 z-10"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">إضافة نكتة</span>
      </Button>

      <AddJokeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      {showAuthDialog && (
        <AuthDialog 
          defaultOpen={true} 
          onOpenChange={(open: boolean) => setShowAuthDialog(open)} 
        />
      )}
    </>
  )
} 