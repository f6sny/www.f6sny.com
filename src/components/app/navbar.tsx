"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "@/hooks/use-toast"
import { AuthDialog } from "@/components/auth/auth-dialog"

export default function Navbar() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  // Update searchQuery when URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    })
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="px-4 flex h-16 items-center">
        <SidebarTrigger />
        <div className="flex justify-between items-center w-full gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">فطسني</span>
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن نكتة..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar?.url || ""} alt={user?.username || ""} />
                      <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/users/${user?.username}`}>الملف الشخصي</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings">إعدادات الحساب</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>تسجيل الخروج</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialog />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

