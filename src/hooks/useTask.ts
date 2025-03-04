import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';

export function useTask(
  taskId: string,
  options?: Omit<UseQueryOptions<TaskResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TaskResponse, Error>({
    queryKey: ['task', taskId],
    queryFn: () => fetchTask(taskId),
    ...options,
  });
}
