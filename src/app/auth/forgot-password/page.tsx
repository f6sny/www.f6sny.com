import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'استعادة كلمة المرور | فطسني',
  description: 'استعادة كلمة المرور لحسابك',
}

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">استعادة كلمة المرور</h1>
        <ForgotPasswordForm />
      </div>
    </div>
  )
} 