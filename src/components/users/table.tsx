"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { LoadingCard } from "@/components/jokes/loading-card"
import client from "@/lib/api"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => {
      const user = row.original
      return (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatar || "/avatars/default.png"} />
          <AvatarFallback>{user.first_name?.[0] || "?"}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "username",
    header: "اسم المستخدم",
    cell: ({ row }) => {
      const user = row.original
      return (
        <Link 
          href={`/users/${user.username}`}
          className="font-medium hover:underline"
        >
          @{user.username}
        </Link>
      )
    },
  },
  {
    accessorKey: "name",
    header: "الاسم",
    cell: ({ row }) => {
      const user = row.original
      return `${user.first_name} ${user.last_name}`
    },
  },
  {
    accessorKey: "biography",
    header: "نبذة",
  },
  {
    accessorKey: "jokes_count",
    header: "النكت",
  },
  {
    accessorKey: "comments_count",
    header: "التعليقات",
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ التسجيل",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString('ar-SA')
    },
  },
  {
    accessorKey: "gender",
    header: "الجنس",
    cell: ({ row }) => {
      return row.original.gender === 'male' ? 'ذكر' : 'أنثى'
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const user = row.original
      if (user.blocked) return <span className="text-red-500">محظور</span>
      if (!user.confirmed) return <span className="text-yellow-500">غير مفعل</span>
      return <span className="text-green-500">مفعل</span>
    },
  },
]

export function UsersTable() {
  const [users, setUsers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [pageCount, setPageCount] = React.useState(0)
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  })
  const [search, setSearch] = React.useState('')
  const searchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await client.collection("users").find({
          pagination: {
            page: pageIndex + 1,
            pageSize,
          },
          filters: {
            search,
          },
        })
        setUsers(response.data)
        setPageCount(response.meta?.pagination?.pageCount || 0)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [pageIndex, pageSize, search])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }
    
    searchTimeout.current = setTimeout(() => {
      setSearch(value)
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, 500)
  }

  const table = useReactTable({
    data: users,
    columns,
    pageCount,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater: any) => setPagination(updater),
    getCoreRowModel: getCoreRowModel(),
  })

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPagination(prev => ({
        ...prev,
        pageIndex: prev.pageIndex - 1
      }))
    }
  }

  const handleNextPage = () => {
    if (pageIndex < pageCount - 1) {
      setPagination(prev => ({
        ...prev,
        pageIndex: prev.pageIndex + 1
      }))
    }
  }

  if (loading && !users.length) {
    return <LoadingCard />
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="البحث عن مستخدم..."
          onChange={handleSearch}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-auto">
              الأعمدة
              <ChevronDown className="mr-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا توجد نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {pageSize * pageIndex + 1} - {Math.min(pageSize * (pageIndex + 1), pageSize * pageCount)} من {pageCount * pageSize} مستخدم
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={pageIndex === 0}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={pageIndex >= pageCount - 1}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  )
} 