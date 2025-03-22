"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

interface CurrentTimeContextType {
	currentTime: number;
}

const CurrentTimeContext = createContext<CurrentTimeContextType | undefined>(
	undefined,
);

export function useCurrentTime() {
	const context = useContext(CurrentTimeContext);
	if (!context) {
		throw new Error(
			"useCurrentTime은 CurrentTimeProvider 내부에서만 사용 가능합니다.",
		);
	}
	return context;
}

interface CurrentTimeProviderProps {
	children: ReactNode;
}

export function CurrentTimeProvider({ children }: CurrentTimeProviderProps) {
	const [currentTime, setCurrentTime] = useState<number>(Date.now());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(Date.now());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<CurrentTimeContext.Provider value={{ currentTime }}>
			{children}
		</CurrentTimeContext.Provider>
	);
}
