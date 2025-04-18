import { Badge } from "@/components/component/Badge";

type ActionCardProps = {
	badgeText: string;
	actionText: string;
	variant?: "default" | "drawer";
};

export default function ActionCard({
	badgeText,
	actionText,
	variant = "default",
}: ActionCardProps) {
	const cardContent = (
		<div className="flex flex-col gap-3 rounded-2xl bg-[#6B6BE1]/[0.16] py-4 pl-4">
			<Badge>{badgeText}</Badge>
			<p className="s1 bg-[linear-gradient(269deg,_#DDD9F8_6.08%,_#E4E4FF_31.42%,_#CCE4FF_62.59%)] bg-clip-text text-transparent">
				{actionText}
			</p>
		</div>
	);

	return variant === "default" ? (
		<div className="rounded-2xl bg-[#17191F]">{cardContent}</div>
	) : (
		cardContent
	);
}
