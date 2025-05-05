"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";

import ArrowLeft from "@public/icons/common/ArrowLeft.svg";

interface HeaderProps {
	title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
	const router = useRouter();

	return (
		<header className="fixed left-0 right-0 top-0 z-10 mt-[60px] flex items-center bg-background-primary px-5 py-[14.5px]">
			<div className="absolute flex items-center left-5">
				<button type="button" onClick={() => router.back()}>
					<Image src={ArrowLeft} alt="Back" width={18} height={16} priority />
				</button>
			</div>
			<h1 className="s2 w-full text-center text-gray-normal">{title}</h1>
		</header>
	);
};

export default Header;
