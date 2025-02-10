import { Metadata } from 'next'
import { TagPageContent } from '@/components/TagPageContent'
import { generateMetadata } from "@/components/Metadata"

export { generateMetadata }

export default function TagPage() {
  return <TagPageContent />
} 