import { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: "إضحك لين تفطس | فطسني",
  description: "موقع للنكتة العربية، بدون إضافات، بدون بهارات، وزي ماجات",
}

export default function Home() {
  return <HomeContent />
}

