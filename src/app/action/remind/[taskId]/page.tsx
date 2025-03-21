import Image from 'next/image';
import ActionRemindPageClient from './ActionRemindPageClient';
import { fetchServerTask } from '@/lib/serverTask';
import { TaskResponse } from '@/types/task';

export default async function Remind({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  const task: TaskResponse = await fetchServerTask(taskId);
  return <ActionRemindPageClient initialTask={task} />;
}
