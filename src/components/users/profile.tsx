"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/store/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, LinkIcon } from "lucide-react"

interface UserProfileProps {
  user: any
}

export function UserProfile({ user }: UserProfileProps) {
  const { user: currentUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState("jokes")
  
  const isCurrentUser = currentUser?.id === user.id
  
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar || ""} alt={user.display_name || user.username} />
                  <AvatarFallback>{user.display_name?.[0] || user.username[0]}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center">{user.display_name || user.username}</CardTitle>
                <CardDescription className="text-center">@{user.username}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {user.biography && (
                <p className="text-sm text-gray-600 mb-4">{user.biography}</p>
              )}
              
              <div className="flex flex-col space-y-2 text-sm text-gray-500">
                {user.location && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 ml-2" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 ml-2" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 ml-2" />
                  <span>انضم {new Date(user.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
              
              {isCurrentUser && (
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/account/settings">تعديل الملف الشخصي</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="jokes" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jokes">النكات</TabsTrigger>
              <TabsTrigger value="comments">التعليقات</TabsTrigger>
            </TabsList>
            <TabsContent value="jokes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>النكات</CardTitle>
                  <CardDescription>
                    النكات التي شاركها {user.display_name || user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Here you would fetch and display the user's jokes */}
                  <div className="text-center py-10 text-gray-500">
                    لم يشارك {user.display_name || user.username} أي نكات بعد.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>التعليقات</CardTitle>
                  <CardDescription>
                    تعليقات {user.display_name || user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Here you would fetch and display the user's comments */}
                  <div className="text-center py-10 text-gray-500">
                    لم يشارك {user.display_name || user.username} بأي تعليقات بعد.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 