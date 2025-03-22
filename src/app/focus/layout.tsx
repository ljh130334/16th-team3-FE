"use client";

import BackHeader from "@/components/backHeader/BackHeader";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

const EditLayout = ({ children }: { children: ReactNode }) => {
	const router = useRouter();

	return (
		<div className="background-primary flex h-screen w-full flex-col items-center justify-start overflow-y-auto px-5">
			<BackHeader onClick={() => router.back()} />

			{children}
		</div>
	);
};

export default EditLayout;
