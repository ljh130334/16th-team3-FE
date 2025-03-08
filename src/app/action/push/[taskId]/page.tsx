import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';

import ActionPushPageClient from './ActionPushPageClient';

export default async function Push({ params }: { params: { taskId: string } }) {
  const { taskId } = await params;
  const task: TaskResponse = await fetchTask(taskId);

  return <ActionPushPageClient task={task} />;
}
