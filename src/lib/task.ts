import { TaskResponse } from '@/types/task';
import { HoldOffParams, StatusParams } from '@/hooks/useTask';

const API_BASE_URL = 'https://app.spurt.site/v1';
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiaWF0IjoxNzQwMzA3MjAwLCJleHAiOjE3NDc5OTMyMDB9.wzUeK94JGyNnC0iyZpWjdJppD66R3dI4jBD8sdWdT44';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${AUTH_TOKEN}`,
};

export const fetchTask = async (taskId: string): Promise<TaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다.');
  }

  return response.json();
};

/**
 * 작업의 미루기 설정을 업데이트합니다.
 * @param params - 미루기 설정에 필요한 파라미터
 * @returns 업데이트된 작업 정보
 */
export const patchTaskHoldOff = async ({
  taskId,
  data,
}: HoldOffParams): Promise<TaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/hold-off`, {
    method: 'PATCH',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('작업 업데이트에 실패했습니다.');
  }

  return response.json();
};

export const patchTaskStatus = async ({
  taskId,
  status,
}: StatusParams): Promise<TaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('작업 상태 업데이트에 실패했습니다.');
  }

  return response.json();
};
