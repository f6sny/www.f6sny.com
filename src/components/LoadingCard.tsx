import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function LoadingCard() {
  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardContent className="flex items-center justify-center p-6">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>جاري التحميل...</p>
        </div>
      </CardContent>
    </Card>
  )
} 