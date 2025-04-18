import { Badge } from "@/components/component/Badge";
import type { CSSProperties } from "react";

interface ActionCardProps {
	title?: string;
	isCompleted?: boolean;
	onClick?: () => void;
	variant?: "gradient1" | "gradient2";
	style?: CSSProperties;
}

export default function ActionCard({
	title,
	isCompleted = false,
	onClick,
	variant = "gradient1",
	style,
}: ActionCardProps) {
	return (
		<div
			className={`cursor-pointer rounded-2xl bg-[#17191F]`}
			onClick={onClick}
		>
			<div
				className="relative flex flex-col gap-3 rounded-2xl bg-[#6B6BE1]/[0.16] py-4 pl-4"
				style={style}
			>
				<Badge>작은 행동</Badge>
				<p
					className={`s1 ${isCompleted ? "text-gray-light" : "bg-[linear-gradient(269deg,_#DDD9F8_6.08%,_#E4E4FF_31.42%,_#CCE4FF_62.59%)] bg-clip-text text-transparent"}`}
				>
					{title}
				</p>
			</div>
		</div>
	);
}
