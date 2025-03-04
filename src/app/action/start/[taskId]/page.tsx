import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import ActionStartPageClient from './ActionStartPageClient';

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(message: string): void;
    };
  }
}

export default async function Start({
  params,
}: {
  params: { taskId: string };
}) {
  const task: TaskResponse = await fetchTask(params.taskId);

  return <ActionStartPageClient initialTask={task} />;
}
