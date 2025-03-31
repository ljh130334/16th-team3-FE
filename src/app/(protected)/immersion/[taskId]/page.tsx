import { fetchServerTask } from "@/lib/serverTask";
import { CurrentTimeProvider } from "@/provider/CurrentTimeProvider";
import type { TaskResponse } from "@/types/task";
import type { Task } from "@/types/task";
import ImmersionPageClient from "./ImmersionPageClient";

export default async function Immersion({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = await params;
	const task: TaskResponse = await fetchServerTask(taskId);

	return (
		<CurrentTimeProvider>
			<ImmersionPageClient initialTask={task as unknown as Task} />
		</CurrentTimeProvider>
	);
}
