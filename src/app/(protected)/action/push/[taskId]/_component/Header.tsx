import Image from "next/image";
import React from "react";

export default function PushHeader({
	content,
}: {
	content: { icon: string; message: string; subMessage: string };
}) {
	const highlightStyles: Record<string, string> = {
		"한 번": "text-component-accent-primary",
		"두 번": "text-component-accent-primary",
		"마지막 기회":
			"bg-[linear-gradient(180deg,_#DD6875_0%,_#ED98A2_100%)] bg-clip-text text-transparent",
	};

	const keywords = Object.keys(highlightStyles);
	const pattern = new RegExp(`(${keywords.join("|")})`, "g");
	const parts = content.message.split(pattern);

	return (
		<div className="mt-[50px] flex flex-col items-center justify-center gap-3 px-5 pb-10 pt-5">
			<Image src={content.icon} alt="아이콘" width={40} height={40} />
			<p className="whitespace-pre-line text-t1 text-gray-strong text-center">
				{parts.map((part, index) =>
					keywords.includes(part) ? (
						<span key={index} className={highlightStyles[part]}>
							{part}
						</span>
					) : (
						<React.Fragment key={index}>{part}</React.Fragment>
					),
				)}
			</p>
			<p className="whitespace-pre-line text-center text-s2 text-gray-neutral">
				{content.subMessage}
			</p>
		</div>
	);
}
