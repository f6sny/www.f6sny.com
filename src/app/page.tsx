import { Metadata } from 'next'
import { HomeContent } from '@/components/app/home-content'

export const metadata: Metadata = {
  title: "إضحك لين تفطس | فطسني",
  description: "موقع للنكتة العربية، بدون إضافات، بدون بهارات، وزي ماجات",
  openGraph: {
    title: "إضحك لين تفطس | فطسني",
    description: "موقع للنكتة العربية، بدون إضافات، بدون بهارات، وزي ماجات",
    siteName: "فطسني",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "إضحك لين تفطس | فطسني",
    description: "موقع للنكتة العربية، بدون إضافات، بدون بهارات، وزي ماجات",
  },
}

export default function Home() {
  console.log('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL)
  console.log('API_URL', process.env.API_URL)
  return <HomeContent />
}

