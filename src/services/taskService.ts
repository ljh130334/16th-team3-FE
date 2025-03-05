import { Task, TaskResponse, convertApiResponseToTask } from '@/types/task';

// 기본 fetch 래퍼 함수
const fetchWithError = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `API 요청 실패 (${response.status}): ${response.statusText}`
    );
  }
  
  return response.json();
};

// 전체 할일 목록 가져오기 (수정)
export const fetchAllTasks = async (): Promise<Task[]> => {
    const data: TaskResponse[] = await fetchWithError('/api/tasks/all-todos');
    return data.map(task => convertApiResponseToTask(task));
  };

// 특정 할일 가져오기
export const fetchTaskById = async (taskId: number): Promise<Task> => {
  const data: TaskResponse = await fetchWithError(`/api/tasks/${taskId}`);
  return convertApiResponseToTask(data);
};

// 오늘 할일 조회 API
export const fetchTodayTasksApi = async (): Promise<Task[]> => {
  const data: TaskResponse[] = await fetchWithError('/api/tasks/today');
  return data.map(task => convertApiResponseToTask(task));
};

// 이번주 할일 조회 API
export const fetchCurrentWeekTasksApi = async (): Promise<Task[]> => {
  const data: TaskResponse[] = await fetchWithError('/api/tasks/current-week');
  return data.map(task => convertApiResponseToTask(task));
};

// 모든 할일 조회 API
export const fetchAllTodosApi = async (): Promise<Task[]> => {
  const data: TaskResponse[] = await fetchWithError('/api/tasks/all-todos');
  return data.map(task => convertApiResponseToTask(task));
};

// 오늘 할일 필터링 (클라이언트 필터링 방식)
export const fetchTodayTasks = async (): Promise<Task[]> => {
  const allTasks = await fetchAllTasks();
  return allTasks.filter(task => task.type === 'today' && task.status !== 'inProgress');
};

// 진행 중인 할일 필터링
export const fetchInProgressTasks = async (): Promise<Task[]> => {
  const allTasks = await fetchAllTasks();
  return allTasks.filter(task => task.status === 'inProgress');
};

// 이번주 할일 필터링
export const fetchWeeklyTasks = async (): Promise<Task[]> => {
  const allTasks = await fetchAllTasks();
  return allTasks.filter(task => task.type === 'weekly');
};

// 미래 할일 필터링
export const fetchFutureTasks = async (): Promise<Task[]> => {
  const allTasks = await fetchAllTasks();
  return allTasks.filter(task => task.type === 'future');
};

// 상태 변경: 진행 중으로 변경
export const startTask = async (taskId: number): Promise<Task> => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'INPROGRESS', startedAt: new Date().toISOString() }),
  };
  
  const data: TaskResponse = await fetchWithError(`/api/tasks/${taskId}/status`, options);
  return convertApiResponseToTask(data);
};

// 상태 변경: 완료로 변경
export const completeTask = async (taskId: number): Promise<Task> => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'COMPLETED' }),
  };
  
  const data: TaskResponse = await fetchWithError(`/api/tasks/${taskId}/status`, options);
  return convertApiResponseToTask(data);
};

// 상태 변경: 회고 완료로 변경
export const reflectTask = async (taskId: number): Promise<Task> => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'REFLECTED' }),
  };
  
  const data: TaskResponse = await fetchWithError(`/api/tasks/${taskId}/status`, options);
  return convertApiResponseToTask(data);
};

// 할일 삭제 기능
export const deleteTask = async (taskId: number): Promise<void> => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  await fetchWithError(`/api/tasks/${taskId}`, options);
};