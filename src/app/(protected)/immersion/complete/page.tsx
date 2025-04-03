"use client";

import Loader from "@/components/loader/Loader";
import { Suspense } from "react";
import CompleteContent from "./CompleteContent";

export default function ImmersionCompletePage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-full items-center justify-center">
					<Loader />
				</div>
			}
		>
			<CompleteContent />
		</Suspense>
	);
}
