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
  username: z.string().min(3, {
    message: "يجب أن يكون اسم المستخدم أكثر من 3 أحرف",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }),
  password: z.string().min(6, {
    message: "يجب أن تكون كلمة المرور أكثر من 6 أحرف",
  }),
  display_name: z.string().min(2, {
    message: "يجب أن يكون الاسم الظاهر أكثر من حرفين",
  }),
})

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      display_name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await auth.register({
        username: values.username,
        email: values.email,
        password: values.password,
        display_name: values.display_name,
      })
      
      login(response.user, response.jwt)
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في فطسني!",
      })
      
      router.push("/")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "خطأ في إنشاء الحساب",
        description: "قد يكون اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل",
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المستخدم</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم المستخدم" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input type="email" placeholder="أدخل البريد الإلكتروني" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الظاهر</FormLabel>
              <FormControl>
                <Input placeholder="أدخل الاسم الظاهر" {...field} />
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </Button>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">لديك حساب بالفعل؟ </span>
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </form>
    </Form>
  )
} 