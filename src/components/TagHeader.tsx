import { Badge } from "@/components/ui/badge"

interface TagHeaderProps {
  title: string
  description: string
  count: number
  hexColor?: string
}

export function TagHeader({ title, description, count, hexColor }: TagHeaderProps) {
  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">
          <Badge 
            className="text-xl py-1 px-3"
            style={{
              backgroundColor: hexColor ? `${hexColor}15` : undefined,
              color: hexColor || undefined,
            }}
          >
            {title}
          </Badge>
        </h1>
        <span className="text-gray-500">({count} نكتة)</span>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} 