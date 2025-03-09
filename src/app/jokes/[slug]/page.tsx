import { JokePageContent } from '@/components/jokes/page-content'
import client from '@/lib/api'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = (await params).slug
 
  // fetch data
  const response =  await client.collection('jokes').find({ 
    filters: { slug: { $eq: decodeURIComponent(slug as string) } },
    pagination: { 
      page: 1,
      pageSize: 1
    }
  })

  const joke = response.data[0]

  const baseTitle = "فطسني"
  const finalTitle = joke.title ? `${joke.title} | ${baseTitle}` : "إضحك لين تفطس | فطسني"
 
  return {
    title: finalTitle,
    description: joke.description || "موقع للنكتة العربية، بدون إضافات، بدون بهارات، وزي ماجات",
    openGraph: {
      title: finalTitle,
      description: joke.description,
      siteName: "فطسني",
      locale: "ar_SA",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: finalTitle,
      description: joke.description,
    },
  }
}

export default function JokePage() {
  return <JokePageContent />
}

