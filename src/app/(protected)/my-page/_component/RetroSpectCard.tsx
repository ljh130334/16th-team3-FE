import Image from "next/image";

interface RetrospectCardProps {
	title: string;
	percentage: number;
	icon: string;
	messageStyle: string;
	messageText: string;
}

export default function RetrospectCard({
	title,
	percentage,
	icon,
	messageStyle,
	messageText,
}: RetrospectCardProps) {
	return (
		<div className="w-1/2 rounded-2xl bg-component-gray-secondary p-4">
			<div className="mb-4 text-c1 text-gray-alternative">{title}</div>
			<div className={`${messageStyle} text-t1 w-[64px]`}>{percentage}%</div>
			<div className="flex items-center gap-1">
				{messageText}
				<Image src={icon} alt="retro-icon" className="mb-[1px]" />
			</div>
		</div>
	);
}
