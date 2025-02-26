"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import SearchBar from "@/components/app/navbar-searchbar"
import { useState } from "react"
import { AddJokeModal } from "@/components/jokes/add-joke-modal"
import { Plus, Tags } from "lucide-react"
import { useTags } from "@/hooks/use-tags"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const isLoggedIn = true // Replace with actual authentication logic
  const user = { username: "johndoe", avatarUrl: "/placeholder.svg" } // Replace with actual user data
  const [addJokeOpen, setAddJokeOpen] = useState(false)
  const { tags, loading } = useTags()

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="w-full px-4 py-2">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link href="/" className="text-xl font-bold text-gray-800">
              الرئيسية
            </Link>
          </div>

          {/* Search bar - hidden on mobile, shown on md+ */}
          <div className="hidden md:hidden flex-1 max-w-xl px-6">
            <SearchBar />
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-4">
              <Button 
                onClick={() => setAddJokeOpen(true)}
                className="gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
              >
                
                أضف نكتة
                <Plus className="h-4 w-4" />
              </Button>
              {/* Tags Dropdown */}
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  التصنيفات
                  <Tags className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {loading ? (
                  <DropdownMenuItem disabled>جاري التحميل...</DropdownMenuItem>
                ) : tags && tags.length > 0 ? (
                  tags.map((tag) => (
                    <DropdownMenuItem key={tag.id}>
                      <Link 
                        href={`/tags/${tag.slug}`}
                        className="flex items-center justify-between w-full"
                      >
                        <span 
                          className="flex items-center gap-2"
                          style={{ color: tag.hex_color || undefined }}
                        >
                          {tag.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {tag.jokes.count}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>لا توجد تصنيفات</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
              <Link 
                title="شارك بتقييم النكت قبل الظهور" 
                href="/" 
                className={cn(buttonVariants({ variant: "ghost" }),`text-gray-600 hover:text-gray-800`)}>
                قيّم
              </Link>
            </div>

            {isLoggedIn ? (
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">الملف الشخصي</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings">الإعدادات</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/logout">تسجيل الخروج</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden md:inline-flex">
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
                <Button asChild className="hidden md:inline-flex">
                  <Link href="/register">التسجيل</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile search bar - shown below navbar on mobile only */}
        <div className="md:hidden py-2">
          <SearchBar />
        </div>
      </div>

      <AddJokeModal 
        open={addJokeOpen}
        onOpenChange={setAddJokeOpen}
      />
    </nav>
  )
}

