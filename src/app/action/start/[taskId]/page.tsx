export const dynamic = 'force-dynamic';

import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import { CurrentTimeProvider } from '@/provider/CurrentTimeProvider';

import ActionStartPageClient from './ActionStartPageClient';

export default async function Start({
  params,
}: {
  params: { taskId: string };
}) {
  const { taskId } = await params;
  const task: TaskResponse = await fetchTask(taskId);

  return (
    <CurrentTimeProvider>
      <ActionStartPageClient initialTask={task} />
    </CurrentTimeProvider>
  );
}
