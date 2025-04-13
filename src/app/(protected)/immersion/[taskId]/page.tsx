import { fetchServerTask } from "@/lib/serverTask";
import { CurrentTimeProvider } from "@/provider/CurrentTimeProvider";
import type { Task, TaskResponse } from "@/types/task";
import { convertApiResponseToTask } from "@/types/task";
import ImmersionPageClient from "./ImmersionPageClient";

// TaskWithPersona 타입 정의
interface TaskWithPersona extends Omit<Task, "persona" | "dueDatetime"> {
	persona: NonNullable<Task["persona"]>;
	dueDatetime: string;
	estimatedHours: number;
}

// Task 객체로부터 예상 소요시간(시간 단위)을 계산하는 함수
function calculateEstimatedHours(task: Task): number {
	// estimatedTime이 있으면 분 단위에서 시간 단위로 변환
	if (task.estimatedTime) {
		return task.estimatedTime / 60;
	}

	// estimatedHour와 estimatedMinute가 있는 경우
	if (task.estimatedHour) {
		const hours = Number(task.estimatedHour) || 0;
		const minutes = task.estimatedMinute
			? Number(task.estimatedMinute) / 60
			: 0;
		return hours + minutes;
	}

	// 특정 필드가 없을 경우 기본값 반환
	return 1;
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
		estimatedHours: calculateEstimatedHours(convertedTask),
	};

	return (
		<CurrentTimeProvider>
			<ImmersionPageClient initialTask={taskWithPersona} />
		</CurrentTimeProvider>
	);
}
