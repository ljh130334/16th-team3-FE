import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import { cookies } from 'next/headers';

import ActionPushPageClient from './ActionPushPageClient';
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

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Access token is not found');
  }

  const task: TaskResponse = await fetchTask(taskId, accessToken);

  return (
    <CurrentTimeProvider>
      <ActionPushPageClient task={task} left={left} />
    </CurrentTimeProvider>
  );
}
