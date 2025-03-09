import { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'تعيين كلمة المرور | فطسني',
  description: 'تعيين كلمة مرور جديدة لحسابك',
}

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">تعيين كلمة مرور جديدة</h1>
        <ResetPasswordForm />
      </div>
    </div>
  )
} 