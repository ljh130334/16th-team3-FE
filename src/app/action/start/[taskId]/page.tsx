export const dynamic = 'force-dynamic';

import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import { CurrentTimeProvider } from '@/provider/CurrentTimeProvider';
import { cookies } from 'next/headers';

import ActionStartPageClient from './ActionStartPageClient';

export default async function Start({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // TODO(supersett) : 토큰이 없을때 로그인화면으로 가게 하는 로직 추가
  if (!accessToken) {
    throw new Error('Access token is not found');
  }
  const task: TaskResponse = await fetchTask(taskId, accessToken);
  return (
    <CurrentTimeProvider>
      <ActionStartPageClient initialTask={task} />
    </CurrentTimeProvider>
  );
}
