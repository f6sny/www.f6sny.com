export function TagsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 px-2">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-4 w-16 animate-pulse rounded bg-gray-200"
          style={{
            width: `${Math.random() * 60 + 40}px`,
          }}
        />
      ))}
    </div>
  )
} 