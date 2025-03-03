import "./globals.css";
import { Rubik } from "next/font/google"
import { SidebarProvider } from "@/components/ui/sidebar"
import Navbar from "@/components/app/navbar"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { StoreHydrator } from "@/components/app/store-hydrator"
import { cookies } from "next/headers"

import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/app/sidebar";
import { getAllPages } from '@/lib/pages'

const rubik = Rubik({ 
  subsets: ["latin"],
  // Optional: you can specify weights if you don't want to load all of them
  weight: ['300', '400', '500', '600', '700'],
  // Optional: you can specify display
  display: 'swap',
})
interface CustomPage {
  title: string
  slug: string
}

async function getCustomPages(): Promise<CustomPage[]> {
  const pages = await getAllPages()
  return pages.map(page => ({
    title: page.frontmatter.title,
    slug: page.slug
  }))
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the sidebar state from cookies
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  const customPages = await getCustomPages()

  return (
    <html lang="ar" dir="rtl">
      <body className={cn(rubik.className, "bg-gray-50")}>
        <StoreHydrator />
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar customPages={customPages} />
          <div className="flex flex-col md:flex-row min-h-screen w-full">
            
            <div className="flex-1 flex flex-col w-full bg-neutral-100">
            
              <Navbar />
              
              <main className="flex-1 w-full px-4 py-8 overflow-auto">{children}</main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  )
}

