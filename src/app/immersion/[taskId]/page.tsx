import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';

import ImmersionPageClient from './ImmersionPageClient';

export default async function Immersion({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  const task: TaskResponse = await fetchTask(taskId);
  return <ImmersionPageClient initialTask={task} />;
}
