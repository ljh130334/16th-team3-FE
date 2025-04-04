import type { TaskResponse } from "@/types/task";

interface Props {
	currentTask: TaskResponse;
	nickname: string;
}

export default function CharacterMotivation({
	currentTask,
	nickname,
}: Props) {
	return (
		<div className="mt-[30px] flex items-center justify-center text-center text-t3 font-semibold text-white">
			잘했어요! 이제
			<br />
			{currentTask.persona?.name} {nickname}으로
			<br />
			몰입해볼까요?
		</div>
	);
}
