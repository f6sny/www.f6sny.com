"use client";
import {
	Calendar,
	ChevronDown,
	Home,
	Inbox,
	Plus,
	Search,
	Settings,
	Tags,
	Info,
	BarChart,
	FileText,
	ShieldAlert
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useStatsStore } from "@/store/stats-store";
import { useTagsStore } from "@/store/tags-store";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { usePendingCount } from "@/hooks/use-pending-count"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth-store"

// Menu items.

interface CustomPage {
    title: string
    slug: string
}

interface SidebarContentProps {
	customPages: CustomPage[]
}

export function AppSidebar({ customPages }: SidebarContentProps) {
	const { tags, loading: tagsLoading } = useTagsStore();
	const { stats, loading: statsLoading } = useStatsStore();
	const { count: pendingCount } = usePendingCount()
	const { user } = useAuthStore()
	
	// Function to calculate font size based on joke count
	const getTagSize = (count: number) => {
		const min = 12; // Minimum font size
		const max = 18; // Maximum font size
		
		// Find the max count for normalization
		const maxCount = tags?.reduce((max, tag) => Math.max(max, tag.jokes?.count || 0), 0) || 1;
		
		// Calculate size (linear scale)
		const size = min + ((count / maxCount) * (max - min));
		
		return Math.max(min, Math.min(max, size)); // Clamp between min and max
	};
	
	const canModerate = true
	
	return (
		<Sidebar side="right">
			<SidebarHeader>
				<Link
					href="/"
					className="hover:bg-gray-100 text-xl font-bold text-gray-800"
				>
					فطسني
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<Collapsible defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel dir="rtl" asChild>
							<CollapsibleTrigger className="flex items-center w-full">
								<Tags className="w-4 h-4 ml-2" />
								التصنيفات
								<ChevronDown className="mr-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						{tagsLoading ? (
							<CollapsibleContent>
								<SidebarGroupContent>
									<div className="space-y-2 p-2">
										<Skeleton className="w-full h-6" />
										<Skeleton className="w-3/4 h-6" />
										<Skeleton className="w-5/6 h-6" />
										<Skeleton className="w-2/3 h-6" />
										<Skeleton className="w-4/5 h-6" />
									</div>
								</SidebarGroupContent>
							</CollapsibleContent>
						) : (
							<CollapsibleContent>
								<SidebarGroupContent>
									<div className="flex flex-wrap gap-2 p-2">
										{tags
											?.sort((a, b) => b.jokes?.count - a.jokes?.count)
											.map((item) => (
												<Link
													key={item.title}
													className={cn(
														"inline-block px-2 py-1 rounded-md hover:bg-gray-100 transition-colors",
														"text-center"
													)}
													style={{ 
														color: item.hex_color || undefined,
														fontSize: `${getTagSize(item.jokes?.count)}px`
													}}
													href={`/tags/${item.slug}`}
												>
													{item.title}
												</Link>
											))}
									</div>
								</SidebarGroupContent>
							</CollapsibleContent>
						)}
					</SidebarGroup>

					<Collapsible className="group/stats">
						<SidebarGroup>
							<SidebarGroupLabel dir="rtl" asChild>
								<CollapsibleTrigger className="flex items-center w-full">
									<BarChart className="w-4 h-4 ml-2" />
									إحصائيات
									<ChevronDown className="mr-auto transition-transform group-data-[state=open]/stats:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									{statsLoading ? (
										<Skeleton className="w-full h-6" />
									) : (
										<SidebarMenu>
											<SidebarMenuItem>
												<SidebarMenuButton asChild>
													<div className="flex items-center ">
														<span className="me-1/3">{stats?.total_jokes}</span>
														نكتة 
													</div>
												</SidebarMenuButton>
											</SidebarMenuItem>
											<SidebarMenuItem>
												<SidebarMenuButton asChild>
													<div className="flex items-center">
														<span className="me-1/3">{stats?.users}</span>
														مستخدم
													</div>
												</SidebarMenuButton>
											</SidebarMenuItem>
											<SidebarMenuItem>
												<SidebarMenuButton asChild>
													<div className="flex items-center">
														<span className="me-1/3">{stats?.comments}</span>
														تعليق
													</div>
												</SidebarMenuButton>
											</SidebarMenuItem>
											<SidebarMenuItem>
												<SidebarMenuButton asChild>
													<div className="flex items-center">
														<span className="me-1/3">{stats?.visits}</span>
														زيارة
													</div>
												</SidebarMenuButton>
											</SidebarMenuItem>
										</SidebarMenu>
									)}
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					<Collapsible className="group/pages">
						<SidebarGroup>
							<SidebarGroupLabel dir="rtl" asChild>
								<CollapsibleTrigger className="flex items-center w-full">
									<FileText className="w-4 h-4 ml-2" />
									الصفحات
									<ChevronDown className="mr-auto transition-transform group-data-[state=open]/pages:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										{customPages.map((page) => (
											<SidebarMenuItem key={page.slug}>
												<SidebarMenuButton asChild>
													<Link href={`/pages/${page.slug}`}>{page.title}</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>

					{canModerate && (
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link href="/moderate">
									مراجعة المحتوى
							{pendingCount > 0 && (
				<Badge variant="destructive" className="me-auto px-2 py-0.5 text-xs">
					{pendingCount}
				</Badge>
								)}
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					)}
				</Collapsible>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="bg-yellow-100 p-2 rounded-md border border-yellow-200 text-xs text-yellow-800">
							موقع فطسني.كوم غير مسئول عن أي محتوى يقوم المستخدم بنشره وتقع كافة المسؤولية القانونية والأدبية على عاتقه
						</div>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<small>جميع الحقوق محفوظة لـ فطسني.كوم©</small>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
