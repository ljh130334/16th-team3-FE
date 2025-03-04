import { TaskResponse } from '@/types/task';

export async function fetchTask(taskId: string): Promise<TaskResponse> {
  const response = await fetch(`/v1/tasks/${taskId}`);
  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다.');
  }
  return response.json();
}
