import { Metadata } from 'next'
import { TagPageContent } from '@/components/tags/page-content'
import { generateMetadata } from "@/components/app/metadata"

export { generateMetadata }

export default function TagPage() {
  return <TagPageContent />
} 