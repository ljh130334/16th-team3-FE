import { TaskResponse } from '@/types/task';
import { serverApi } from './serverKy';

export const fetchServerTask = async (
  taskId: string,
): Promise<TaskResponse> => {
  const response = await serverApi.get(`/v1/tasks/${taskId}`).json();
  return response as TaskResponse;
};
