import { fetchServerTask } from '@/lib/serverTask';
import { TaskResponse } from '@/types/task';

import ImmersionPageClient from './ImmersionPageClient';
import { CurrentTimeProvider } from '@/provider/CurrentTimeProvider';

export default async function Immersion({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const task: TaskResponse = await fetchServerTask(taskId);

  return (
    <CurrentTimeProvider>
      <ImmersionPageClient initialTask={task} />
    </CurrentTimeProvider>
  );
}
