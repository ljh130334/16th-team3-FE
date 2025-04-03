import { fetchServerTask } from "@/lib/serverTask";
import { CurrentTimeProvider } from "@/provider/CurrentTimeProvider";
import type { Task, TaskResponse } from "@/types/task";
import { convertApiResponseToTask } from "@/types/task";
import ImmersionPageClient from "./ImmersionPageClient";

// TaskWithPersona 타입 정의
interface TaskWithPersona extends Omit<Task, "persona" | "dueDatetime"> {
	persona: NonNullable<Task["persona"]>;
	dueDatetime: string;
}

export default async function Immersion({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = await params;
	const taskResponse: TaskResponse = await fetchServerTask(taskId);

	// TaskResponse를 Task로 변환 후 필수 필드 검증
	const convertedTask = convertApiResponseToTask(taskResponse);

	// persona와 dueDatetime이 존재하는지 확인하고 TaskWithPersona로 타입 변환
	if (!convertedTask.persona || !convertedTask.dueDatetime) {
		throw new Error("Task must have persona and dueDatetime");
	}

	const taskWithPersona: TaskWithPersona = {
		...convertedTask,
		persona: convertedTask.persona,
		dueDatetime: convertedTask.dueDatetime,
	};

	return (
		<CurrentTimeProvider>
			<ImmersionPageClient initialTask={taskWithPersona} />
		</CurrentTimeProvider>
	);
}
