import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TimeAgo } from "@/components/ui/time-ago"

declare interface Comment {
  id: number
  content: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  likes: number
}

declare interface CommentsProps {
  jokeId?: number
}   

const dummyComments: Comment[] = [
  {
    id: 1,
    content: "ههههههههههه والله انك صادق 😂",
    author: {
      name: "أبو فهد",
      avatar: "/avatars/1.png"
    },
    createdAt: "2024-03-15T10:00:00Z",
    likes: 12
  },
  {
    id: 2,
    content: "يا شيخ تراك جبتها 👌🏻",
    author: {
      name: "سعد"
    },
    createdAt: "2024-03-15T11:30:00Z",
    likes: 8
  },
  {
    id: 3,
    content: "النكتة ذي سمعتها من زمان بس دايم تضحك 😄",
    author: {
      name: "خالد",
      avatar: "/avatars/3.png"
    },
    createdAt: "2024-03-15T12:45:00Z",
    likes: 5
  }
]

export function Comments() {
  const [comments, setComments] = useState<Comment[]>(dummyComments)
  const [newComment, setNewComment] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: comments.length + 1,
      content: newComment,
      author: {
        name: "أنت",
      },
      createdAt: new Date().toISOString(),
      likes: 0
    }

    setComments([comment, ...comments])
    setNewComment("")
    setDialogOpen(false)
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">التعليقات ({comments.length})</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              إضافة تعليق
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة تعليق جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="min-h-[150px]"
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment}>
                  إرسال
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-gray-50">
            <Avatar>
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{comment.author.name}</h4>
                <TimeAgo 
                  date={comment.createdAt} 
                  className="text-sm text-gray-500"
                />
              </div>
              <p className="mt-1 text-gray-700">{comment.content}</p>
              <div className="mt-2 flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  👍 {comment.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  رد
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 