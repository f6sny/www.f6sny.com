import { Metadata } from 'next'
import { ModerateContent } from '@/components/moderate/moderate-content'

export const metadata: Metadata = {
  title: 'مراجعة المحتوى | فطسني',
  description: 'إذا النكتة عجبت ناس واجد بنعرضها, وإذا ماعجبت ناس واجد راح نمسحها قبل العرض',
}

export default function ModeratePage() {
  return <ModerateContent />
} 