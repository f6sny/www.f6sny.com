import Link from "next/link";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flag, Laugh, Meh, Frown, Link2, Loader2, Clock } from "lucide-react";
import { TimeAgo } from "@/components/ui/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface JokeCardProps {
	joke: any;
	onReaction: (jokeId: string, reaction: string) => Promise<void>;
	onReport: (jokeId: number) => void;
}

export function JokeCard({ joke, onReaction, onReport }: JokeCardProps) {
	const [loadingReaction, setLoadingReaction] = useState<string | null>(null);
	const isPending = joke.joke_status === "pending";

	const getButtonVariant = (voteType: string) => {
		if (joke.hasVoted && joke.userVote?.value === voteType) {
			return "secondary";
		}
		return "outline";
	};

	const isButtonDisabled = (reaction: string) => {
		if (loadingReaction !== null) return true;
		const voteType =
			reaction === "laugh" ? "up" : reaction === "meh" ? "neutral" : "down";
		return joke.hasVoted && joke.userVote?.value === voteType;
	};

	const handleReaction = async (reaction: string) => {
		setLoadingReaction(reaction);
		try {
			await onReaction(joke.documentId, reaction);
		} finally {
			setLoadingReaction(null);
		}
	};

	return (
		<Card className="w-full hover:shadow-lg transition-shadow duration-200">
			<CardHeader className="pb-2">
				{isPending && (
					<div className="mb-2">
						<Badge 
							variant="outline" 
							className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 w-fit"
						>
							<Clock className="h-3 w-3" />
							<span>في انتظار الموافقة</span>
						</Badge>
					</div>
				)}
				<CardTitle>
					<div className="flex items-center gap-2 justify-between">
						<div className="text-base flex items-center gap-2 group">
							<Link
								className=" flex items-center gap-2    "
								href={`/users/${joke.author?.username || "visitor"}`}
							>
								<Avatar className="cursor-pointer hover:opacity-80 h-6 w-6">
									<AvatarImage
										src={
											joke.author?.avatar?.formats?.thumbnail?.url ||
											"/avatars/default.png"
										}
									/>
									<AvatarFallback>
										{joke.author?.display_name?.[0] || "؟"}
									</AvatarFallback>
								</Avatar>
								<div className="flex gap-1 items-center font-normal">
									<span className="group-hover:underline">
										{joke.author?.first_name || "زائر"}
									</span>
									<span
										dir="ltr"
										className="text-gray-500 group-hover:underline"
									>
										@{joke.author?.username || "visitor"}
									</span>
								</div>
							</Link>
              <span className="text-sm font-normal text-gray-500">
                -
              </span>
							<TimeAgo
								date={joke.updatedAt}
								className="text-sm font-normal text-gray-500"
							/>
						</div>

						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" asChild>
								<Link href={`/jokes/${joke.slug}`}>
									<Link2 className="h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p
					className="whitespace-pre-line"
					dangerouslySetInnerHTML={{ __html: joke.content }}
				/>
				<div className="flex flex-wrap gap-1 mt-2">
					{joke.tags?.map((tag: any) => (
						<Link
							href={`/tags/${tag.slug}`}
							key={`joke-${joke.documentId}-tag-${tag.documentId}`}
						>
							<Badge
								variant="secondary"
								className="font-normal rounded-md border-none"
								style={{
									backgroundColor: tag.hex_color
										? `${tag.hex_color}10`
										: undefined,
									color: tag.hex_color || undefined,
								}}
							>
								{tag.title}
							</Badge>
						</Link>
					))}
				</div>
			</CardContent>
			{!isPending && (
			<CardFooter className="flex flex-wrap justify-between gap-2">
				<div className="flex flex-wrap gap-2">
					<Button
						variant={getButtonVariant("up")}
						size="sm"
						onClick={() => handleReaction("laugh")}
						disabled={isButtonDisabled("laugh")}
					>
						{loadingReaction === "laugh" ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Laugh
								className={cn(
									"mr-2 h-4 w-4",
									joke.hasVoted && joke.userVote === "up" && "text-yellow-500"
								)}
							/>
						)}
						{joke.votes?.filter((v: any) => v.value === "up").length || 0}
					</Button>
					<Button
						variant={getButtonVariant("neutral")}
						size="sm"
						onClick={() => handleReaction("meh")}
						disabled={isButtonDisabled("meh")}
					>
						{loadingReaction === "meh" ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Meh
								className={cn(
									"mr-2 h-4 w-4",
									joke.hasVoted &&
										joke.userVote === "neutral" &&
										"text-gray-500"
								)}
							/>
						)}
						{joke.votes?.filter((v: any) => v.value === "neutral").length || 0}
					</Button>
					<Button
						variant={getButtonVariant("down")}
						size="sm"
						onClick={() => handleReaction("frown")}
						disabled={isButtonDisabled("frown")}
					>
						{loadingReaction === "frown" ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Frown
								className={cn(
									"mr-2 h-4 w-4",
									joke.hasVoted && joke.userVote === "down" && "text-red-500"
								)}
							/>
						)}
						{joke.votes?.filter((v: any) => v.value === "down").length || 0}
					</Button>
				</div>
				<Button variant="ghost" size="sm" onClick={() => onReport(joke.id)}>
					تبليغ
					<Flag className="mr-2 h-4 w-4" />
				</Button>
			</CardFooter>
			)}
		</Card>
	);
}
