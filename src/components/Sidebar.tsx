import { getAllPages } from '@/lib/pages'
import { SidebarContent } from './SidebarContent'

interface CustomPage {
  title: string
  slug: string
}

async function getCustomPages(): Promise<CustomPage[]> {
  const pages = await getAllPages()
  return pages.map(page => ({
    title: page.frontmatter.title,
    slug: page.slug
  }))
}

export default async function Sidebar() {
  const customPages = await getCustomPages()
  return <SidebarContent customPages={customPages} />
}

