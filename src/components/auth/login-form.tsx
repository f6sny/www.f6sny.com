"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { auth } from "@/lib/auth"
import { useAuthStore } from "@/store/auth-store"

const formSchema = z.object({
  identifier: z.string().min(3, {
    message: "يجب أن يكون اسم المستخدم أو البريد الإلكتروني أكثر من 3 أحرف",
  }),
  password: z.string().min(6, {
    message: "يجب أن تكون كلمة المرور أكثر من 6 أحرف",
  }),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await auth.login({
        identifier: values.identifier,
        password: values.password,
      })
      
      login(response.user, response.jwt)
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك مرة أخرى!",
      })
      
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المستخدم أو البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم المستخدم أو البريد الإلكتروني" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="أدخل كلمة المرور" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
            نسيت كلمة المرور؟
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">ليس لديك حساب؟ </span>
          <Link href="/auth/register" className="text-sm text-blue-600 hover:underline">
            إنشاء حساب جديد
          </Link>
        </div>
      </form>
    </Form>
  )
} 