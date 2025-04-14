import type React from "react";
import { constants } from "./constants";

// export const formatGoalText = (text: string) => {
// 	const { LINE_BREAK_AT } = constants;

// 	if (text.length <= LINE_BREAK_AT) return text;

// 	const firstLine = text.slice(0, LINE_BREAK_AT);
// 	const secondLine = text.slice(LINE_BREAK_AT);

// 	return (
// 		<>
// 			<div className="w-full">{firstLine}</div>
// 			<div className="w-full">{secondLine}</div>
// 		</>
// 	);
// };

export const handleTextareaInput = (
	e: React.ChangeEvent<HTMLTextAreaElement>,
	setter: (value: string) => void,
	maxLength: number,
	onError?: (type: "length" | "maxCount") => void,
) => {
	const value = e.target.value;

	// 최대 글자 수 제한
	if (value.length <= maxLength) {
		setter(value);

		// 자동 높이 조절
		e.target.style.height = "auto";
		e.target.style.height = `${e.target.scrollHeight}px`;
	} else {
		// 최대 글자 수 초과 시 이전 값 유지
		setter(value.slice(0, maxLength));

		// 경고 표시
		if (onError) {
			onError("length");
		}
	}
};
