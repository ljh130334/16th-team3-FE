import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllTasks,
  fetchTaskById,
  fetchTodayTasks,
  fetchInProgressTasks,
  fetchWeeklyTasks,
  fetchFutureTasks,
  startTask,
  completeTask,
  reflectTask,
  deleteTask,
  fetchTodayTasksApi,
  fetchCurrentWeekTasksApi,
  fetchAllTodosApi
} from '@/services/taskService';
import { Task } from '@/types/task';

// 모든 할일 조회 훅
export const useAllTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: fetchAllTasks,
  });
};

// 특정 할일 조회 훅
export const useTask = (taskId: number) => {
  return useQuery<Task, Error>({
    queryKey: ['tasks', taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId, // taskId가 유효한 경우에만 쿼리 실행
  });
};

// 오늘 할일 조회 훅 (클라이언트 필터링)
export const useTodayTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'today'],
    queryFn: fetchTodayTasks,
  });
};

// 오늘 할일 API 조회 훅 (서버 API 직접 호출)
export const useTodayTasksApi = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'today-api'],
    queryFn: fetchTodayTasksApi,
  });
};

// 이번주 할일 API 조회 훅 (서버 API 직접 호출)
export const useCurrentWeekTasksApi = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'current-week-api'],
    queryFn: fetchCurrentWeekTasksApi,
  });
};

// 모든 할일 API 조회 훅 (서버 API 직접 호출)
export const useAllTodosApi = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'all-todos-api'],
    queryFn: fetchAllTodosApi,
  });
};

// 진행 중인 할일 조회 훅
export const useInProgressTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'inProgress'],
    queryFn: fetchInProgressTasks,
  });
};

// 이번주 할일 조회 훅
export const useWeeklyTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'weekly'],
    queryFn: fetchCurrentWeekTasksApi,
  });
};

// 미래 할일 조회 훅
export const useFutureTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', 'future'],
    queryFn: fetchFutureTasks,
  });
};

// 할일 시작 mutation 훅
export const useStartTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: number) => startTask(taskId),
    onSuccess: (updatedTask) => {
      // 개별 할일 데이터 업데이트
      queryClient.setQueryData(['tasks', updatedTask.id], updatedTask);
      
      // 전체 목록 데이터 업데이트
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// 할일 완료 mutation 훅
export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: number) => completeTask(taskId),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(['tasks', updatedTask.id], updatedTask);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// 할일 회고 완료 mutation 훅
export const useReflectTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: number) => reflectTask(taskId),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(['tasks', updatedTask.id], updatedTask);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// 할일 삭제 mutation 훅
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: (_, taskId) => {
      // 캐시에서 해당 할일 삭제
      queryClient.removeQueries({ queryKey: ['tasks', taskId] });
      
      // 전체 목록 데이터 업데이트
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// 알림 무시 횟수 초기화 훅
export const useResetAlerts = () => {
  const queryClient = useQueryClient();
  
  return (taskId: number) => {
    // 캐시에서 현재 할일 데이터 가져오기
    const task = queryClient.getQueryData<Task>(['tasks', taskId]);
    
    if (task) {
      // 알림 무시 횟수 초기화한 새 객체 생성
      const updatedTask = { ...task, ignoredAlerts: 0 };
      
      // 캐시 업데이트
      queryClient.setQueryData(['tasks', taskId], updatedTask);
      
      // 전체 목록 업데이트
      queryClient.setQueryData<Task[] | undefined>(['tasks'], (oldData) => {
        if (!oldData) return undefined;
        return oldData.map(item => item.id === taskId ? updatedTask : item);
      });
    }
  };
};