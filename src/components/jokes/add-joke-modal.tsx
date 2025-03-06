"use client"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useTagsStore } from "@/store/tags-store"
import client from "@/lib/api"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Search } from "lucide-react"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const PREFIX = "يقول لك، "

const jokeFormSchema = z.object({
  content: z.string().min(10 + PREFIX.length, {
    message: `يجب أن تكون النكتة أكثر من ${10} أحرف بعد "${PREFIX}"`,
  }),
  tags: z.array(z.string()).min(1, {
    message: "يجب اختيار تصنيف واحد على الأقل",
  }),
})

type JokeFormValues = z.infer<typeof jokeFormSchema>

interface AddJokeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddJokeModal({ isOpen, onClose }: AddJokeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagSearch, setTagSearch] = useState("")
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false)
  const { tags } = useTagsStore()
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<JokeFormValues>({
    resolver: zodResolver(jokeFormSchema),
    defaultValues: {
      content: PREFIX,
      tags: [],
    },
  })

  // Ensure the prefix is always present
  useEffect(() => {
    const content = form.getValues("content");
    if (!content.startsWith(PREFIX)) {
      form.setValue("content", PREFIX + content.substring(Math.min(content.length, PREFIX.length)));
    }
  }, [form]);

  // Handle content changes to ensure prefix remains
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>, onChange: (value: string) => void) => {
    let newContent = e.target.value;
    
    // If the prefix is missing or incomplete, restore it
    if (!newContent.startsWith(PREFIX)) {
      // Keep the cursor position relative to the content
      const cursorPosition = e.target.selectionStart;
      const prefixDiff = PREFIX.length - newContent.indexOf(PREFIX.charAt(PREFIX.length - 1));
      
      newContent = PREFIX + newContent.substring(Math.min(newContent.length, PREFIX.length));
      
      onChange(newContent);
      
      // Restore cursor position after React updates the DOM
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = Math.max(PREFIX.length, cursorPosition);
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
        }
      }, 0);
    } else {
      onChange(newContent);
    }
  };

  // Filter tags based on search
  const filteredTags = tags.filter(tag => 
    tag.title.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // Add a tag to the selection
  const addTag = (tagId: string) => {
    const currentTags = form.getValues("tags");
    if (!currentTags.includes(tagId)) {
      form.setValue("tags", [...currentTags, tagId]);
    }
    setTagSearch("");
  };

  // Remove a tag from the selection
  const removeTag = (tagId: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(id => id !== tagId));
  };

  // Get tag by ID
  const getTagById = (tagId: string) => {
    return tags.find(tag => tag.id.toString() === tagId);
  };

  async function onSubmit(values: JokeFormValues) {
    setIsSubmitting(true)
    try {
      // Ensure the content still has the prefix before submitting
      let content = values.content;
      if (!content.startsWith(PREFIX)) {
        content = PREFIX + content;
      }
      
      const response = await client.collection('jokes').create({
        content: content,
        tags: values.tags.map(tagId => ({ id: tagId })),
      })

      toast({
        title: "تم إضافة النكتة بنجاح",
        description: "شكراً لمساهمتك!",
      })

      form.reset({ content: PREFIX, tags: [] });
      onClose()
      
      // Redirect to the new joke page
      if (response?.data?.slug) {
        router.push(`/jokes/${response.data.slug}`)
      }
    } catch (error) {
      console.error("Error submitting joke:", error)
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة النكتة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader >
          <DialogTitle >إضافة نكتة جديدة</DialogTitle>
          <DialogDescription >
            شارك نكتتك مع المجتمع. تأكد من اختيار التصنيف المناسب.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النكتة</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب نكتتك هنا..."
                      className="min-h-[120px]"
                      {...field}
                      onChange={(e) => handleContentChange(e, field.onChange)}
                      ref={(e) => {
                        // This handles both refs
                        textareaRef.current = e;
                        if (typeof field.ref === 'function') field.ref(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    النكتة ستبدأ دائماً بـ "{PREFIX}"
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>التصنيفات</FormLabel>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {field.value.map((tagId) => {
                      const tag = getTagById(tagId);
                      if (!tag) return null;
                      
                      return (
                        <Badge 
                          key={tagId}
                          style={{
                            backgroundColor: `#${tag.hex_color}`,
                            color: '#ffffff'
                          }}
                          className="px-2 py-0.5 rounded-lg text-xs font-normal flex items-center gap-1"
                        >
                          {tag.title}
                          <button 
                            type="button" 
                            onClick={() => removeTag(tagId)}
                            className="ms-1 hover:bg-white/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                    
                    <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="h-7 gap-1"
                        >
                          <Plus className="h-3.5 w-3.5 me-1" />
                          إضافة تصنيف
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-1 border-b">
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="ابحث عن تصنيف..."
                              value={tagSearch}
                              onChange={(e) => setTagSearch(e.target.value)}
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-2">
                          {filteredTags.length === 0 ? (
                            <p className="text-center py-4 text-sm text-gray-500">
                              لا توجد تصنيفات مطابقة
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {filteredTags.map((tag) => {
                                const isSelected = field.value.includes(tag.id.toString());
                                return (
                                  <Button
                                    key={tag.id}
                                    type="button"
                                    variant={isSelected ? "outline" : "outline"}
                                    className="px-1 py-0.5 text-sm flex items-center gap-1"
                                    onClick={() => {
                                      if (isSelected) {
                                        removeTag(tag.id.toString());
                                      } else {
                                        addTag(tag.id.toString());
                                      }
                                    }}
                                    style={{
                                      backgroundColor: isSelected ? `#${tag.hex_color}` : 'transparent',
                                      color: isSelected ? '#aaaaaa' : `#${tag.hex_color}`,
                                      borderColor: `#${tag.hex_color}`
                                    }}
                                  >
                                    {tag.title}
                                  </Button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-start md:justify-end">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "جاري الإضافة..." : "إضافة النكتة"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 