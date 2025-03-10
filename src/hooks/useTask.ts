import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { fetchTask, HoldOffRequestBody, patchTaskHoldOff } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import { useRouter } from 'next/navigation';

export const useTask = (
  taskId: string,
  options?: Omit<UseQueryOptions<TaskResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<TaskResponse, Error>({
    queryKey: ['task', taskId],
    queryFn: () => fetchTask(taskId),
    ...options,
  });
};

export const useTaskDueDatetime = (taskId: string) => {
  return useQuery<string, Error>({
    queryKey: ['taskDueDatetime', taskId],
    queryFn: async () => {
      const task = await fetchTask(taskId);
      return task.dueDatetime;
    },
  });
};

interface PatchParams {
  taskId: string | number;
  data: HoldOffRequestBody;
}

export const usePatchTaskHoldOff = (): UseMutationResult<
  any,
  Error,
  PatchParams
> => {
  const router = useRouter();
  return useMutation<any, Error, PatchParams>({
    mutationFn: ({ taskId, data }) => patchTaskHoldOff({ taskId, data }),
    onSuccess: () => {
      router.push('/home-page');
    },
  });
};
