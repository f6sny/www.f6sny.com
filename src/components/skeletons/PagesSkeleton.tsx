import { Skeleton } from "@/components/ui/skeleton"

export function PagesSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center px-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24 mr-2" />
        </div>
      ))}
    </div>
  )
} 