import { Suspense } from "react";
import CompleteContent from "./CompleteContent";

export default function ImmersionCompletePage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-full items-center justify-center">
					로딩 중...
				</div>
			}
		>
			<CompleteContent />
		</Suspense>
	);
}
