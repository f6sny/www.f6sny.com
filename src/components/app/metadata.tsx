import { Metadata } from 'next'

interface MetadataProps {
  title?: string
  description?: string
}

export function generateMetadata({ title, description }: MetadataProps): Metadata {
  const baseTitle = "فطسني"
  const finalTitle = title ? `${title} | ${baseTitle}` : "إضحك لين تفطس | فطسني"
  
  return {
    title: finalTitle,
    description: description || "موقع للنكتة العربية، بدون إضافات، بدون بهارات، وزي ماجات",
    openGraph: {
      title: finalTitle,
      description: description,
      siteName: "فطسني",
      locale: "ar_SA",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: finalTitle,
      description: description,
    },
  }
} 