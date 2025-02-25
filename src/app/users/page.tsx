import { UsersTable } from "@/components/users/table"

export default function UsersPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">المستخدمين</h1>
      <UsersTable />
    </div>
  )
} 