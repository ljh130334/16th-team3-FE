import ImmersionPageClient from './ImmersionPageClient';
import { fetchTask } from '@/lib/task';
import { CurrentTimeProvider } from '@/provider/CurrentTimeProvider';
import { TaskResponse } from '@/types/task';

export default async function Immersion({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  const task: TaskResponse = await fetchTask(taskId);
  return (
    <CurrentTimeProvider>
      <ImmersionPageClient initialTask={task} />
    </CurrentTimeProvider>
  );
}
