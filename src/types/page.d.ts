declare interface PageFrontmatter {
  title: string
  description: string
  date?: string
  slug?: string
}

declare interface Page {
  slug: string
  content: string
  frontmatter: PageFrontmatter
}

declare interface PageContentProps {
  page: Page
} 