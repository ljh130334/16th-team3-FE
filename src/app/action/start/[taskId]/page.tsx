export const dynamic = 'force-dynamic';

import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import ActionStartPageClient from './ActionStartPageClient';
import { CurrentTimeProvider } from '@/provider/CurrentTimeProvider';

export default async function Start({
  params,
}: {
  params: { taskId: string };
}) {
  const taskId = await params;
  const task: TaskResponse = await fetchTask(taskId.taskId);

  return (
    <CurrentTimeProvider>
      <ActionStartPageClient initialTask={task} />
    </CurrentTimeProvider>
  );
}
