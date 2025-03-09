import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserHeaderProps {
	username: string;
	name: string;
	biography: string;
	avatar?: any;
	jokeCount: number;
}

export function UserHeader({
	username,
	name,
	biography,
	avatar,
	jokeCount,
}: UserHeaderProps) {
	const getAvatarUrl = () => {
		if (!avatar) return "/avatars/default.png";
		
		if (typeof avatar === 'object' && avatar.url) {
			return avatar.url;
		}
		
		if (typeof avatar === 'string') {
			if (avatar.startsWith('http')) {
				return avatar;
			}
			return `${process.env.NEXT_PUBLIC_API_URL}${avatar.startsWith('/') ? avatar : `/${avatar}`}`;
		}
		
		return "/avatars/default.png";
	};

	return (
		<div className="mb-8">
			<div className="flex items-start gap-4">
				<div className="flex-shrink-0">
					<Avatar className="h-16 w-16 cursor-pointer hover:opacity-80">
						<AvatarImage src={getAvatarUrl()} alt={name} />
						<AvatarFallback>{name?.[0] || "؟"}</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-col items-start justify-start">
					<h1 className="text-2xl font-bold">{name}</h1>
					<p dir="ltr" className="text-gray-600">
						@{username}
					</p>
					{biography && <p className="mt-2 text-gray-700">{biography}</p>}
					<p className="mt-2 text-sm text-gray-500">{jokeCount} نكتة</p>
				</div>
			</div>
		</div>
	);
}
