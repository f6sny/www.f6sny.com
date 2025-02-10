"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { TagsInput } from "@/components/ui/extension/tags-input"

const MAX_CHARS = 500
const PREFIX = "يقول لك، "

export function AddJokeModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [content, setContent] = useState(PREFIX)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Ensure prefix is always present
  useEffect(() => {
    if (!content.startsWith(PREFIX)) {
      setContent(PREFIX + content)
    }
  }, [content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newContent = e.target.value
    if (!newContent.startsWith(PREFIX)) {
      newContent = PREFIX + newContent.substring(Math.min(newContent.length, PREFIX.length))
    }
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent)
    }
  }

  const handleSubmit = async () => {
    // Here you would submit the joke to your API
    const joke = {
      content,
      tags: selectedTags,
    }
    console.log("Submitting joke:", joke)
    // await submitJoke(joke)
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setContent(PREFIX)
    setSelectedTags([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add New Joke</DialogTitle>
          <DialogDescription>
            Share your joke with the community. Be creative and funny!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              className="min-h-[100px] resize-none"
              placeholder="Type your joke here..."
            />
            <div className="text-sm text-gray-500 flex justify-between">
              <span>Characters remaining: {MAX_CHARS - content.length}</span>
              <span>{content.length} / {MAX_CHARS}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <TagsInput
              placeholder="Enter tags..."
              value={selectedTags}
              onValueChange={setSelectedTags}
              className="w-full"
              maxItems={5}
            />
            <p className="text-xs text-gray-500">
              Press enter or comma to add a tag. Maximum 5 tags.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Post Joke</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 