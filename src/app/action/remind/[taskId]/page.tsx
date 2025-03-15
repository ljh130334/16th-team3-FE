import Image from 'next/image';
import ActionRemindPageClient from './ActionRemindPageClient';
import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import { cookies } from 'next/headers';

export default async function Remind({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Access token is not found');
  }

  const task: TaskResponse = await fetchTask(taskId, accessToken);
  return <ActionRemindPageClient initialTask={task} />;
}
