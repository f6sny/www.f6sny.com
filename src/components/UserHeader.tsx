interface UserHeaderProps {
  username: string
  name: string
  bio: string
  avatar?: string
  jokeCount: number
}

export function UserHeader({ username, name, bio, avatar, jokeCount }: UserHeaderProps) {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={avatar || "/avatars/default.png"}
            alt={name}
            className="w-16 h-16 rounded-full"
          />
        </div>
        <div className="flex flex-col items-start justify-start">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p dir="ltr" className="text-gray-600">@{username}</p>
          <p className="mt-2 text-gray-700">{bio}</p>
          <p className="mt-2 text-sm text-gray-500">
            {jokeCount} نكتة
          </p>
        </div>
      </div>
    </div>
  )
} 