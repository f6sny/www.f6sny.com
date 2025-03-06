"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/auth-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { strapi } from '@strapi/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ImageUploader } from "@/components/ui/image-uploader"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ProfileCompleteness } from "@/components/account/profile-completeness"

const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "يجب أن يكون اسم المستخدم أكثر من 3 أحرف",
  }),
  display_name: z.string().min(2, {
    message: "يجب أن يكون الاسم الظاهر أكثر من حرفين",
  }),
  biography: z.string().max(160).optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female"]),
  restriction: z.enum(["strict", "moderate", "open"]),
  avatar: z.union([z.string(), z.object({ url: z.string() })]).optional(),
})

const accountFormSchema = z.object({
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }),
})

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "يجب أن تكون كلمة المرور أكثر من 6 أحرف",
  }),
  newPassword: z.string().min(6, {
    message: "يجب أن تكون كلمة المرور الجديدة أكثر من 6 أحرف",
  }),
  confirmPassword: z.string().min(6, {
    message: "يجب أن تكون كلمة المرور أكثر من 6 أحرف",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

export function AccountSettingsForm() {
  const { user, token, updateUser } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      display_name: user?.display_name || "",
      biography: user?.biography || "",
      date_of_birth: user?.date_of_birth || "",
      gender: user?.gender || "male",
      restriction: user?.restriction || "open",
      avatar: user?.avatar || "" as string | { url: string },
    },
  })

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user?.email || "",
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username || "",
        display_name: user.display_name || "",
        biography: user.biography || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "male",
        restriction: user.restriction || "open",
        avatar: user.avatar?.url || user.avatar || "",
      })
      accountForm.reset({
        email: user.email || "",
      })
    }
  }, [user, profileForm, accountForm])

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user || !token) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لتحديث المعلومات الشخصية",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const client = strapi({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api',
        auth: token,
      })

      const response = await client.fetch(`/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          display_name: values.display_name,
          biography: values.biography ?? undefined,
          date_of_birth: values.date_of_birth ?? undefined,
          gender: values.gender,
          restriction: values.restriction,
        }),
      })

      const updatedUser = await response.json()
      updateUser(updatedUser)

      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      toast({
        title: "تم تحديث المعلومات الشخصية",
        description: "تم تحديث معلوماتك الشخصية بنجاح",
      })
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "خطأ في تحديث المعلومات",
        description: "حدث خطأ أثناء تحديث المعلومات الشخصية",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onAccountSubmit(values: z.infer<typeof accountFormSchema>) {
    if (!user || !token) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لتحديث معلومات الحساب",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const client = strapi({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api',
        auth: token,
      })

      const response = await client.fetch(`/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
        }),
      })

      const updatedUser = await response.json()
      updateUser(updatedUser)

      toast({
        title: "تم تحديث معلومات الحساب",
        description: "تم تحديث بريدك الإلكتروني بنجاح",
      })
    } catch (error) {
      console.error("Account update error:", error)
      toast({
        title: "خطأ في تحديث المعلومات",
        description: "حدث خطأ أثناء تحديث البريد الإلكتروني",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    if (!user || !token) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لتغيير كلمة المرور",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const client = strapi({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api',
        auth: token,
      })

      await client.fetch(`/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          password: values.newPassword,
          passwordConfirmation: values.confirmPassword,
        }),
      })

      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      })

      // Reset the form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Password change error:", error)
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: "كلمة المرور الحالية غير صحيحة أو حدث خطأ آخر",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center p-6">
        <p>يجب تسجيل الدخول لعرض هذه الصفحة</p>
        <Button className="mt-4" onClick={() => router.push("/auth/login")}>
          تسجيل الدخول
        </Button>
      </div>
    )
  }

  return (
    <Tabs dir="rtl" defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
        <TabsTrigger value="account">الحساب</TabsTrigger>
        <TabsTrigger value="password">كلمة المرور</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>الملف الشخصي</CardTitle>
            <CardDescription>
              قم بتعديل معلومات ملفك الشخصي هنا. سيتم عرض هذه المعلومات للآخرين.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProfileCompleteness />

            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الصورة الشخصية</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={field.value || ""}
                          onChange={(value) => {
                            field.onChange(value);
                            // Update the user state immediately for better UX
                            if (user) {
                              updateUser({ 
                                avatar: typeof value === 'string' ? { url: value } : value 
                              });
                            }
                          }}
                          description="يمكنك تحميل صورة شخصية بحجم لا يتجاوز 2 ميجابايت"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">معلومات الحساب</h3>
                  
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المستخدم</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم المستخدم" {...field} />
                        </FormControl>
                        <FormDescription>
                          هذا هو اسم المستخدم الخاص بك.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="display_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الظاهر</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسمك الظاهر" {...field} />
                        </FormControl>
                        <FormDescription>
                          هذا هو الاسم الذي سيظهر في ملفك الشخصي وتعليقاتك.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">المعلومات الشخصية</h3>
                  
                  <FormField
                    control={profileForm.control}
                    name="biography"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نبذة عنك</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="اكتب نبذة قصيرة عن نفسك"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          يمكنك كتابة نبذة قصيرة عن نفسك لا تتجاوز 160 حرفًا.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                  
                  <FormField
                    control={profileForm.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ الميلاد</FormLabel>
                        <FormControl dir="ltr">
                          <div dir="ltr" className="relative">
                            <Input 
                            
                              dir="ltr" 
                              type="date" 
                              {...field} 
                              className="text-right pr-10" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الجنس</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الجنس" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">ذكر</SelectItem>
                            <SelectItem value="female">أنثى</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">إعدادات المحتوى</h3>
                  
                  <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-4">
                  <FormField
                    control={profileForm.control}
                    name="restriction"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>إعدادات حساسية المحتوى</FormLabel>
                        <FormControl>
                          <RadioGroup
                            dir="rtl"
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="open" id="restriction-open" className="border-red-700 text-red-700" />
                              <label htmlFor="restriction-open" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                مفتوح
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="moderate" id="restriction-moderate" className="border-red-700 text-red-700" />
                              <label htmlFor="restriction-moderate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                معتدل
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="strict" id="restriction-strict" className="border-red-700 text-red-700" />
                              <label htmlFor="restriction-strict" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                مقيد
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          <span className="space-y-2">
                              <span className="block"><strong>مفتوح:</strong> عرض جميع المحتويات بما في ذلك النكت للبالغين (+18).</span>
                              <span className="block"><strong>معتدل:</strong> عرض معظم المحتويات مع تقييد بعض المحتوى الحساس.</span>  
                              <span className="block"><strong>مقيد:</strong> عرض المحتوى المناسب للجميع فقط.</span>
                            <span className="text-red-600 font-medium mt-2">
                              تحذير: النكت للبالغين قد تحتوي على محتوى غير لائق للعرض للعامة.
                            </span>
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    </div>
                </div>
                
                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">تم حفظ التغييرات بنجاح!</span>
                  </div>
                )}
                
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ التغييرات"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>الحساب</CardTitle>
            <CardDescription>
              قم بتعديل إعدادات حسابك هنا.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...accountForm}>
              <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
                <FormField
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="أدخل بريدك الإلكتروني" {...field} />
                      </FormControl>
                      <FormDescription>
                        هذا هو البريد الإلكتروني المرتبط بحسابك.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>كلمة المرور</CardTitle>
            <CardDescription>
              قم بتغيير كلمة المرور الخاصة بك هنا. بعد تغيير كلمة المرور، سيتم تسجيل خروجك من جميع الأجهزة الأخرى.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور الحالية</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="أدخل كلمة المرور الحالية" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
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
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تأكيد كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="أدخل كلمة المرور الجديدة مرة أخرى" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري تغيير كلمة المرور..." : "تغيير كلمة المرور"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 