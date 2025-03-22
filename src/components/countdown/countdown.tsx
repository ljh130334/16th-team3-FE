import { useCurrentTime } from "@/provider/CurrentTimeProvider";
import React from "react";

interface CountdownProps {
	deadline: string; // ISO 문자열
	className?: string;
}

export default function Countdown({ deadline, className }: CountdownProps) {
	const { currentTime } = useCurrentTime();
	const deadlineTimestamp = new Date(deadline).getTime();
	const remaining = Math.max(deadlineTimestamp - currentTime, 0);
	const totalSeconds = Math.floor(remaining / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return (
		<span className={className}>
			{hours}:{minutes < 10 ? `0${minutes}` : minutes}:
			{seconds < 10 ? `0${seconds}` : seconds}
		</span>
	);
}
