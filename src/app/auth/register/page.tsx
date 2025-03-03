import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'إنشاء حساب | فطسني',
  description: 'قم بإنشاء حساب جديد للمشاركة في الموقع',
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">إنشاء حساب جديد</h1>
        <RegisterForm />
      </div>
    </div>
  )
} 