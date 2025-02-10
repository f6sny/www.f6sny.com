declare interface CustomPage {
  title: string
  slug: string
}

declare interface SidebarContentProps {
  customPages: CustomPage[]
}

declare interface Stats {
  total_jokes: number
  deleted_jokes: number
  users: number
  pending_jokes: number
  visits: number
} 