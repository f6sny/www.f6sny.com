import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

interface PageFrontmatter {
  title: string
  description: string
  date?: string
  slug?: string
}

interface Page {
  slug: string
  content: string
  frontmatter: PageFrontmatter
}

interface PageContentProps {
  page: Page
} 
const pagesDirectory = path.join(process.cwd(), 'content/pages')

export async function getAllPages(): Promise<Page[]> {
  const files = await fs.readdir(pagesDirectory)
  const pages = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
      .map(async (file) => {
        const rawSlug = file.replace(/\.(mdx?|md)$/, '')
        const page = await getPage(rawSlug)
        if (page) {
          // Use frontmatter slug if available, otherwise use filename
          page.slug = page.frontmatter.slug || rawSlug
        }
        return page
      })
  )
  return pages.filter((page): page is Page => !!page)
}

export async function getPage(slug: string): Promise<Page | null> {
  try {
    // Try different URL encodings
    const variations = [
      slug,
      decodeURIComponent(slug),
      encodeURIComponent(decodeURIComponent(slug)),
      decodeURIComponent(encodeURIComponent(slug)),
    ].filter((x, i, arr) => arr.indexOf(x) === i)

    let fullPath: string | null = null
    let fileExists = false

    // First try to find file by frontmatter slug
    const files = await fs.readdir(pagesDirectory)
    for (const file of files) {
      const filePath = path.join(pagesDirectory, file)
      const content = await fs.readFile(filePath, 'utf8')
      const { data } = matter(content)
      if (data.slug && variations.includes(data.slug)) {
        fullPath = filePath
        fileExists = true
        break
      }
    }

    // If not found by frontmatter slug, try filename
    if (!fileExists) {
      for (const variant of variations) {
        const possiblePaths = [
          path.join(pagesDirectory, `${variant}.mdx`),
          path.join(pagesDirectory, `${variant}.md`),
        ]

        for (const p of possiblePaths) {
          try {
            await fs.access(p)
            fullPath = p
            fileExists = true
            break
          } catch {
            continue
          }
        }

        if (fileExists) break
      }
    }

    if (!fileExists || !fullPath) {
      return null
    }

    const fileContents = await fs.readFile(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: data.slug || slug, // Use frontmatter slug if available
      content,
      frontmatter: data as PageFrontmatter,
    }
  } catch (error) {
    console.error('Error reading page:', error)
    return null
  }
} 