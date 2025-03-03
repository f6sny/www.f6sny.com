"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { auth } from "@/lib/auth"

const formSchema = z.object({
  password: z.string().min(6, {
    message: "يجب أن تكون كلمة المرور أكثر من 6 أحرف",
  }),
  passwordConfirmation: z.string().min(6, {
    message: "يجب أن تكون كلمة المرور أكثر من 6 أحرف",
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "كلمات المرور غير متطابقة",
  path: ["passwordConfirmation"],
})

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    const codeParam = searchParams.get("code")
    if (!codeParam) {
      toast({
        title: "خطأ",
        description: "رمز إعادة تعيين كلمة المرور غير صالح",
        variant: "destructive",
      })
      router.push("/auth/forgot-password")
    } else {
      setCode(codeParam)
    }
  }, [searchParams, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!code) return

    setIsLoading(true)
    try {
      await auth.resetPassword({
        code,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      })
      
      toast({
        title: "تم إعادة تعيين كلمة المرور بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة",
      })
      
      router.push("/auth/login")
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إعادة تعيين كلمة المرور",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!code) {
    return <div className="text-center">جاري التحميل...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور الجديدة</FormLabel>
              <FormControl>
                <Input type="password" placeholder="أدخل كلمة المرور الجديدة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="أدخل كلمة المرور مرة أخرى" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري إعادة تعيين كلمة المرور..." : "إعادة تعيين كلمة المرور"}
        </Button>
        <div className="text-center mt-4">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            العودة إلى صفحة تسجيل الدخول
          </Link>
        </div>
      </form>
    </Form>
  )
} 