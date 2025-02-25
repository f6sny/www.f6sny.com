"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from 'react'

interface Page {
  slug: string
  content: string
  frontmatter: PageFrontmatter
}

interface PageFrontmatter {
  title: string
  description: string
  date?: string
  slug?: string
}
interface PageContentProps {
  page: Page
} 

export function PageContent({ page }: PageContentProps) {
  const [mdxSource, setMdxSource] = useState<any>(null)

  useEffect(() => {
    serialize(page.content).then(setMdxSource)
  }, [page.content])

  const handleReport = () => {
    toast({
      title: "تم التبليغ",
      description: "شكراً لك! سنراجع المحتوى قريباً.",
    })
  }

  if (!mdxSource) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className="text-2xl font-bold">{page.frontmatter.title}</h1>
      </CardHeader>
      <CardContent>
        <div className="prose prose-stone max-w-none">
          <MDXRemote {...mdxSource} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleReport}>
          تبليغ
          <Flag className="mr-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 