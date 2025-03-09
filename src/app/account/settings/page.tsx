import { Metadata } from 'next'
import { AccountSettingsForm } from '@/components/account/settings-form'

export const metadata: Metadata = {
  title: 'إعدادات الحساب | فطسني',
  description: 'تعديل معلومات حسابك الشخصي',
}

export default function AccountSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">إعدادات الحساب</h1>
        <AccountSettingsForm />
      </div>
    </div>
  )
} 