import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';

import ActionPushPageClient from './ActionPushPageClient';
import { CloudCog } from 'lucide-react';
import { CurrentTimeProvider } from '@/provider/CurrentTimeProvider';

export default async function Push({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ left?: string }>;
}) {
  const { taskId } = await params;
  const { left } = await searchParams;
  const task: TaskResponse = await fetchTask(taskId);

  return (
    <CurrentTimeProvider>
      <ActionPushPageClient task={task} left={left} />
    </CurrentTimeProvider>
  );
}
