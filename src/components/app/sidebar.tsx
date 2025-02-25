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
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { useStatsStore } from "@/store/stats-store";
import { useTagsStore } from "@/store/tags-store";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription } from "../ui/alert";
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
							<CollapsibleTrigger>
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
									<SidebarMenu>
										{tags
											?.sort((a, b) => b.jokes?.count - a.jokes?.count)
											.map((item) => (
												<SidebarMenuItem key={item.title}>
													<SidebarMenuButton asChild>
														<Link
															className={`flex justify-between `}
															style={{ color: item.hex_color || undefined }}
															href={`/tags/${item.slug}`}
														>
															{item.title}
															<Badge variant="secondary">
																{item.jokes?.count}
															</Badge>
														</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						)}
					</SidebarGroup>

					<SidebarGroup>
						<SidebarGroupLabel>إحصائيات</SidebarGroupLabel>
						<SidebarGroupContent>
                            {statsLoading ? (
                                <Skeleton className="w-full h-6" />
                            ) : (
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <div className="flex items-center ">
                                                <span className="me-1/3">{stats?.total_jokes - stats?.deleted_jokes}</span>
                                                نكتة نشطة
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <div className="flex items-center">
                                                <span className="me-1/3">{stats?.pending_jokes}</span>
                                                نكتة في الانتظار
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <div className="flex items-center">
                                                <span className="me-1/3">{stats?.deleted_jokes}</span>
                                                نكتة محذوفة
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
					</SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>الصفحات</SidebarGroupLabel>
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
                    </SidebarGroup>
				</Collapsible>
			</SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
					<SidebarMenuItem>
					<div className="bg-yellow-100 p-2 rounded-md border border-yellow-200 text-xs text-yellow-800"  >
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
