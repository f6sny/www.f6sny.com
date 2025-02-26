import { Metadata } from 'next'
import { TagPageContent } from '@/components/tags/page-content'
import client from '@/lib/api';

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
} 

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;

  const data = await client.collection('tags').find({
    filters: { slug: { $eq: decodeURIComponent(slug as string) } },
    populate: {
      jokes: {
        count: true
      }
    }
  })

  const tag = data.data[0]  

  const baseTitle = "فطسني"
  const finalTitle = tag.name ? `${tag.name} | ${baseTitle}` : "إضحك لين تفطس | فطسني"

  return {
    title: finalTitle,
    description: tag.description,
    openGraph: {
      title: finalTitle,
      description: tag.description,
      siteName: "فطسني",
      locale: "ar_SA",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: finalTitle,
      description: tag.description,
    },
  };
};

export default function TagPage() {
  return <TagPageContent />
} 