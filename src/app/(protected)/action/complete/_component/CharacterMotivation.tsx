import type { TaskResponse } from "@/types/task";

interface Props {
	currentTask: TaskResponse;
	nickname: string;
}

export default function CharacterMotivation({ currentTask, nickname }: Props) {
	return (
		<div className="mt-[30px] flex items-center justify-center text-center text-t3 font-semibold text-gray-strong">
			잘했어요! 이제
			<br />
			<span className="text-component-accent-secondary">
				{currentTask.persona?.name} {nickname}
			</span>
			으로
			<br />
			몰입해볼까요?
		</div>
	);
}
