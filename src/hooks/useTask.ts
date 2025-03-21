import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { patchTaskHoldOff, patchTaskStatus } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export interface TaskMutationParams {
  taskId: string;
}

export interface HoldOffParams extends TaskMutationParams {
  data: {
    remindInterval: number;
    remindCount: number;
    remindBaseTime: string;
  };
}

export interface StatusParams extends TaskMutationParams {
  taskId: string;
  status:
    | 'BEFORE'
    | 'WARMING_UP'
    | 'PROCRASTINATING'
    | 'HOLDING_OFF'
    | 'FOCUSED'
    | 'COMPLETE';
}

// 할일 보류 요청
export const usePatchTaskHoldOff = (): UseMutationResult<
  TaskResponse,
  Error,
  HoldOffParams
> => {
  const router = useRouter();
  return useMutation<TaskResponse, Error, HoldOffParams>({
    mutationFn: ({ taskId, data }) => patchTaskHoldOff({ taskId, data }),
    onSuccess: (data) => {
      router.push('/');
    },
    onError: (error) => {
      console.error('usePatchTaskHoldOff onError', error);
      router.push('/');
    },
  });
};

// 할일 상태 변경
export const usePatchTaskStatus = (): UseMutationResult<
  TaskResponse,
  Error,
  StatusParams
> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<TaskResponse, Error, StatusParams>({
    mutationFn: ({ taskId, status }) => patchTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'home'] });
    },
    onError: (error) => {
      console.error('usePatchTaskStatus onError', error);
    },
  });
};
