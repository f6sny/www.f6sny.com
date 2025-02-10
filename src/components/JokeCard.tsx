import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Flag, Laugh, Meh, Frown } from "lucide-react"
import { TimeAgo } from "@/components/ui/time-ago"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function JokeCard({ joke, onReaction, onReport }: JokeCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Link href={`/users/${joke.author?.username || 'visitor'}`}>
            <Avatar className="cursor-pointer hover:opacity-80">
              <AvatarImage src={joke.author?.avatar || "/avatars/default.png"} />
              <AvatarFallback>{joke.author?.first_name?.[0] || "؟"}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Link 
                href={`/users/${joke.author?.username || 'visitor'}`}
                className="group flex items-center gap-2"
              >
                <span className="font-medium group-hover:underline">
                  {joke.author?.first_name || "زائر"}
                </span>
                <span dir="ltr" className="text-xs text-gray-500 group-hover:underline">
                  @{joke.author?.username || "visitor"}
                </span>
              </Link>

              <TimeAgo 
                date={joke.updatedAt} 
                className="text-sm text-gray-500"
              />
            </div>
            <p className="mt-2 whitespace-pre-line">{joke.content}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {joke.tags?.map((tag) => (
                <Badge 
                  key={`joke-${joke.id}-tag-${tag.id}`}
                  variant="secondary" 
                  style={{
                    backgroundColor: tag.hex_color ? `${tag.hex_color}15` : undefined,
                    color: tag.hex_color || undefined,
                  }}
                >
                  {tag.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onReaction(joke.id, "laugh")}>
            <Laugh className="mr-2 h-4 w-4" />
            {joke.votes?.filter((v) => v.value === "up").length || 0}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onReaction(joke.id, "meh")}>
            <Meh className="mr-2 h-4 w-4" />
            {joke.votes?.filter((v) => v.value === "neutral").length || 0}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onReaction(joke.id, "frown")}>
            <Frown className="mr-2 h-4 w-4" />
            {joke.votes?.filter((v) => v.value === "down").length || 0}
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onReport(joke.id)}>
          تبليغ
          <Flag className="mr-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 