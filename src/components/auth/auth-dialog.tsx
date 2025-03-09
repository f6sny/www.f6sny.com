"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/store/auth-store"
import { Confetti } from "@/components/ui/confetti"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { hasSkippedProfileDialog, calculateProfileCompleteness, shouldShowProfileDialog, skipProfileDialog } from "@/lib/profile-utils"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
// Login form schema
const loginFormSchema = z.object({
  identifier: z.string().min(1, { message: "البريد الإلكتروني مطلوب" }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة" }),
})

// Register form schema
const registerFormSchema = z.object({
  username: z.string().min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
})

type AuthMode = "login" | "register" | "welcome" | "complete-profile"

interface AuthDialogProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AuthDialog({ defaultOpen, onOpenChange }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || false)
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [showConfetti, setShowConfetti] = useState(false)
  const router = useRouter()
  const { login, register, isAuthenticated, user } = useAuthStore()

  // Create a new state variable to track if we should force the dialog to stay open
  const [forceOpen, setForceOpen] = useState(false);

  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  // Register form
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  // Update the useEffect to set this flag
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated && user) {
      // Check if we should show the welcome dialog
      const isNewUser = sessionStorage.getItem('just_registered') === 'true';
      if (isNewUser) {
        sessionStorage.removeItem('just_registered');
        setAuthMode("welcome");
        setShowConfetti(true);
        setIsOpen(true);
        setForceOpen(true); // Set force open flag
      } 
      // Otherwise check if we should show the profile completion dialog
      else if (shouldShowProfileDialog(user)) {
        setAuthMode("complete-profile");
        setIsOpen(true);
        setForceOpen(true); // Set force open flag
      }
    }
  }, [isAuthenticated, user]);

  // Update parent component when dialog state changes
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  // Handle dialog open state changes
  const handleOpenChange = (open: boolean) => {
    // Only allow closing the dialog in certain modes
    if (!open && (authMode === "welcome" || authMode === "complete-profile")) {
      // Don't close the dialog in these modes
      return;
    }
    
    // Otherwise, update the open state
    setIsOpen(open);
  };

  // Login form submission
  const onLoginSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const userData = await login(values.identifier, values.password);
      
      // Close this dialog
      setIsOpen(false);
      
      // Dispatch event to show profile dialog if needed
      if (userData && typeof window !== 'undefined') {
        const { isComplete } = calculateProfileCompleteness(userData);
        const hasSkipped = hasSkippedProfileDialog();
        
        if (!isComplete && !hasSkipped) {
          window.dispatchEvent(new Event('show-profile-dialog'));
        }
      }
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك مرة أخرى!",
      });
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "تأكد من صحة البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
    }
  };

  // Register form submission
  const onRegisterSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    try {
      await register(data.username, data.email, data.password);
      
      // Close this dialog
      setIsOpen(false);
      
      // Dispatch event to show welcome dialog
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('show-welcome-dialog'));
      }
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحبًا بك في فطسني!",
      });
    } catch (error) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: "قد يكون اسم المستخدم أو البريد الإلكتروني مستخدمًا بالفعل",
        variant: "destructive",
      });
    }
  };

  // Handle skip profile completion
  const handleSkipCompleteProfile = () => {
    skipProfileDialog();
    setIsOpen(false); // Explicitly close the dialog
  };

  // Handle go to profile settings
  const handleGoToProfileSettings = () => {
    setIsOpen(false); // Explicitly close the dialog
    router.push("/account/settings");
  };

  // Then, let's add a debug function to help us track the dialog state
  const debugState = () => {
    console.log({
      isOpen,
      authMode,
      isAuthenticated,
      hasUser: !!user,
      shouldShow: user ? shouldShowProfileDialog(user) : false
    });
  };

  // Add the handler function
  const handleGoogleSignIn = async () => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}connect/google`;
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تسجيل الدخول بواسطة Google",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => {
          setAuthMode("login")
          setIsOpen(true)
        }}
        type="button"
      >
        تسجيل الدخول
      </Button>

      <Dialog 
        open={isOpen}
        onOpenChange={(open) => {
          // If trying to close and in a special mode, check if we should allow it
          if (!open && (authMode === "welcome" || authMode === "complete-profile")) {
            // For these modes, we need to explicitly handle closing
            return;
          }
          
          // For other modes, allow normal open/close behavior
          setIsOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          {authMode === "login" && (
            <>
              <DialogHeader>
                <DialogTitle>تسجيل الدخول</DialogTitle>
                <DialogDescription>
                  قم بتسجيل الدخول للمشاركة في المحتوى والتفاعل مع النكات
                </DialogDescription>
              </DialogHeader>
              
              <Form {...loginForm}>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    loginForm.handleSubmit(onLoginSubmit)(e);
                  }} 
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      
                    )}
                  />
                  <Button type="button" onClick={loginForm.handleSubmit(onLoginSubmit)} className="w-full">
                    {loginForm.formState.isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        أو
                      </span>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGoogleSignIn}
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>تسجيل الدخول بواسطة Google</span>
                  </Button>
                  
                  <div className="flex justify-between mt-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-500 hover:text-primary"
                      onClick={() => setAuthMode("register")}
                    >
                      ليس لديك حساب؟ سجل الآن
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-500 hover:text-primary"
                      onClick={() => {
                        // Handle forgot password
                        router.push("/auth/forgot-password");
                      }}
                    >
                      نسيت كلمة المرور؟
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
          
          {authMode === "register" && (
            <>
              <DialogHeader>
                <DialogTitle>إنشاء حساب جديد</DialogTitle>
                <DialogDescription>
                  انضم إلينا للمشاركة في المحتوى والتفاعل مع النكات
                </DialogDescription>
              </DialogHeader>
              
              <Form {...registerForm}>
                <form className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المستخدم</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="button" onClick={registerForm.handleSubmit(onRegisterSubmit)} className="w-full">
                    {registerForm.formState.isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                  </Button>
                  
                  <div className="flex justify-center mt-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-500 hover:text-primary"
                      onClick={() => setAuthMode("login")}
                    >
                      لديك حساب بالفعل؟ تسجيل الدخول
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
          
          {authMode === "welcome" && (
            <>
              {showConfetti && <Confetti />}
              <DialogHeader>
                <DialogTitle>مرحبًا بك في فطسني!</DialogTitle>
                <DialogDescription>
                  تم إنشاء حسابك بنجاح. هل ترغب في إكمال ملفك الشخصي الآن؟
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col space-y-4 mt-4">
                <Button onClick={handleGoToProfileSettings}>
                  إكمال الملف الشخصي
                </Button>
                <Button variant="outline" onClick={handleSkipCompleteProfile}>
                  تخطي هذه الخطوة
                </Button>
              </div>
            </>
          )}
          
          {authMode === "complete-profile" && (
            <>
              <DialogHeader>
                <DialogTitle>إكمال الملف الشخصي</DialogTitle>
                <DialogDescription>
                  إكمال ملفك الشخصي يساعد المستخدمين الآخرين في التعرف عليك بشكل أفضل
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col space-y-4 mt-4">
                <Button onClick={handleGoToProfileSettings}>
                  إكمال الملف الشخصي
                </Button>
                <Button variant="outline" onClick={handleSkipCompleteProfile}>
                  تخطي هذه الخطوة
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 