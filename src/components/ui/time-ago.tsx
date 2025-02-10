"use client"

import { formatTimeAgo } from "@/lib/timeago"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TimeAgoProps {
  date: string
  className?: string
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <time 
            className={className}
            dateTime={date}
          >
            {formatTimeAgo(date)}
          </time>
        </TooltipTrigger>
        <TooltipContent>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 