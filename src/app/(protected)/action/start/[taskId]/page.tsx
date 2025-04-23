export const dynamic = 'force-dynamic';

import { fetchServerTask } from '@/lib/serverTask';
import { CurrentTimeProvider } from '@/provider/CurrentTimeProvider';
import type { TaskResponse } from '@/types/task';
import ActionStartPageClient from './ActionStartPageClient';
import { redirect } from 'next/navigation';

export default async function Start({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  let task: TaskResponse;

  try {
    task = await fetchServerTask(taskId);
  } catch {
    return redirect('/');
  }
  return (
    <CurrentTimeProvider>
      <ActionStartPageClient initialTask={task} />
    </CurrentTimeProvider>
  );
}
