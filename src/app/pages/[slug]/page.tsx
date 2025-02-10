import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage, getAllPages } from '@/lib/pages'
import { PageContent } from '@/components/PageContent'
import type { Page } from '@/types/page'


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  
  return {
    title: `${page.frontmatter.title} | فطسني`,
    description: page.frontmatter.description,
  }
}

export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  return <PageContent page={page} />
} 