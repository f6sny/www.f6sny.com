import type { Metadata } from "next";
import "./globals.css";
import { Rubik } from "next/font/google"
import { SidebarProvider } from "@/components/ui/sidebar"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { useHydrateStores } from '@/hooks/use-hydrate-stores'
import { StoreHydrator } from "@/components/StoreHydrator"

import { cn } from "@/lib/utils";

const rubik = Rubik({ 
  subsets: ["latin"],
  // Optional: you can specify weights if you don't want to load all of them
  weight: ['300', '400', '500', '600', '700'],
  // Optional: you can specify display
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cn(rubik.className, "bg-gray-50")}>
        <StoreHydrator />
        <SidebarProvider>
          <div className="flex flex-col md:flex-row min-h-screen w-full bg-red-200">
            <Sidebar />
            <div className="flex-1 flex flex-col w-full bg-yellow-200">
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

