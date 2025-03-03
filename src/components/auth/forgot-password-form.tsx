"use client"

import { useState } from "react"
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
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }),
})

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await auth.forgotPassword({
        email: values.email,
      })
      
      setIsSubmitted(true)
      
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى التحقق من بريدك الإلكتروني",
      })
    } catch (error) {
      console.error("Forgot password error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">تم إرسال رابط إعادة تعيين كلمة المرور</h2>
        <p className="text-green-700 mb-4">
          لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني واتباع التعليمات.
        </p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          العودة إلى صفحة تسجيل الدخول
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input type="email" placeholder="أدخل بريدك الإلكتروني" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة تعيين كلمة المرور"}
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