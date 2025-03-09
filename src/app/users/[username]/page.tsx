import { UserPageContent } from "@/components/users/page-content"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ملف المستخدم | فطسني',
  description: 'تصفح نكت المستخدم',
}

export default function UserPage() {
  return <UserPageContent />
} 