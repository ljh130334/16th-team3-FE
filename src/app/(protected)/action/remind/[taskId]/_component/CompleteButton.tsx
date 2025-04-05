"use client";

import { Button } from "@/components/ui/button";

type Props = {
	onClick: () => void;
	disabled: boolean;
};

export default function CompleteButton({ onClick, disabled }: Props ) {
	return (
		<div className="mt-auto items-center px-5">
			<Button variant="primary" className="w-full" onClick={onClick} disabled={disabled}>
				완료
			</Button>
		</div>
	);
}
