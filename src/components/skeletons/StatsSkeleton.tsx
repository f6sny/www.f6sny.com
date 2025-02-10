import { Skeleton } from "@/components/ui/skeleton"

export function StatsSkeleton() {
  return (
    <div className="mt-2 space-y-2 rounded-lg bg-gray-50 py-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
} 