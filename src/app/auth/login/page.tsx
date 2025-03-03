import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'تسجيل الدخول | فطسني',
  description: 'قم بتسجيل الدخول إلى حسابك',
}

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
        <LoginForm />
      </div>
    </div>
  )
} 