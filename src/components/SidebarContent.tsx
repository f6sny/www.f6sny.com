"use client"

import Link from "next/link"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useTagsStore } from '@/store/tags-store'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStatsStore } from '@/store/stats-store'
import { Users, BookOpen, Clock, AlertTriangle, Eye, Link as LinkIcon, ChevronDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { StatsSkeleton, PagesSkeleton } from '@/components/skeletons'
interface CustomPage {
  title: string
  slug: string
}

interface SidebarContentProps {
  customPages: CustomPage[]
}

export function SidebarContent({ customPages }: SidebarContentProps) {
  const { open } = useSidebar()
  const { tags, loading: tagsLoading } = useTagsStore()
  const { stats, loading: statsLoading } = useStatsStore()

  const getTagSize = (count: number) => {
    if (!tags || tags.length === 0) return 0.75
    const maxCount = Math.max(...tags.map(tag => tag.jokes?.count || 0))
    const minCount = Math.min(...tags.map(tag => tag.jokes?.count || 0))
    const normalized = (count - minCount) / (maxCount - minCount) || 0
    return 0.75 + (normalized * 0.5)
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-white transition-transform duration-200 md:static md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex-1 overflow-hidden">
        <ScrollArea dir="rtl" className="h-full py-6">
          <nav className="space-y-6 px-3">
            <div className="space-y-3">
              <Link
                href="/"
                className="flex items-center px-2 py-1.5 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100"
              >
                الرئيسية
              </Link>
            </div>

            

            {/* Tags Cloud */}
            <div className="space-y-2">
              <h3 className="px-2 text-sm font-medium text-gray-500">التصنيفات الشائعة</h3>
              <div className="flex flex-wrap gap-2 px-2">
                {!tagsLoading && tags && tags.length > 0 ? (
                  tags
                    .sort((a, b) => (b.jokes?.count || 0) - (a.jokes?.count || 0))
                    .map((tag) => {
                      const size = getTagSize(tag.jokes?.count || 0)
                      return (
                        <Link
                          key={tag.id}
                          href={`/tags/${tag.slug}`}
                          className="hover:underline transition-colors"
                          style={{
                            fontSize: `${size}rem`,
                            color: tag.hex_color || '#4B5563',
                            opacity: 0.5 + (size - 0.75) / 1.25 * 0.5,
                          }}
                        >
                          {tag.title}
                        </Link>
                      )
                    })
                ) : (
                  <div className="text-sm text-gray-500">
                    {tagsLoading ? "جاري التحميل..." : "لا توجد تصنيفات"}
                  </div>
                )}
              </div>
            </div>

            

            {/* Stats Section */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
                إحصائيات
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {statsLoading ? (
                  <StatsSkeleton />
                ) : !stats ? (
                  <div className="text-sm text-gray-500 px-2">
                    لا توجد إحصائيات
                  </div>
                ) : (
                  <div className="mt-2 space-y-2 rounded-lg bg-gray-50 py-2">
                    <div className="flex items-center gap-2 px-4 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">{stats.total_jokes - stats.deleted_jokes}</span>
                      <span>نكتة نشطة</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{stats.pending_jokes}</span>
                      <span>في الانتظار</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 text-sm text-gray-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{stats.deleted_jokes}</span>
                      <span>محذوفة</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{stats.users}</span>
                      <span>مستخدم</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 text-sm text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">{stats.visits}</span>
                      <span>زيارة</span>
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Custom Pages Section */}
            <div className="space-y-2">
              <h3 className="px-2 text-sm font-medium text-gray-500">صفحات فرعية</h3>
              {customPages.length === 0 ? (
                <PagesSkeleton />
              ) : (
                <div className="space-y-2">
                  {customPages.map((page) => (
                    <div key={page.slug} className="flex items-center px-2 text-sm text-gray-600">
                      <LinkIcon className="h-4 w-4" />
                      <Link
                        href={`/pages/${page.slug}`}
                        className="flex items-center px-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                      >
                        {page.title}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer Alert */}
            <Alert variant="default" className="mt-6 text-xs">
              <AlertDescription>
                موقع فطسني.كوم غير مسئول عن أي محتوى يقوم المستخدم بنشره وتقع كافة المسؤولية القانونية والأدبية على عاتقه
              </AlertDescription>
            </Alert>

            {/* Copyright */}
            <div className="text-center text-xs text-gray-500 mt-4">
              جميع الحقوق محفوظة لـ فطسني.كوم©
            </div>
          </nav>
        </ScrollArea>
      </div>
    </aside>
  )
} 