import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JokeSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-12" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
        <Skeleton className="h-9 w-20" />
      </CardFooter>
    </Card>
  )
}

export function JokeSkeletonList() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <JokeSkeleton key={i} />
      ))}
    </div>
  )
} 