import { Metadata } from 'next'
import { JokePageContent } from '@/components/JokePageContent'
import { generateMetadata } from "@/components/Metadata"

export { generateMetadata }

export default function JokePage() {
  return <JokePageContent />
}

