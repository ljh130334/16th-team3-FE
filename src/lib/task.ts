import { TaskResponse } from '@/types/task';
import { HoldOffParams, StatusParams } from '@/hooks/useTask';
import { api } from '@/lib/ky';

const API_BASE_URL = 'https://dev.app.spurt.site';

export const fetchTask = async (
  taskId: string,
  accessToken: string,
): Promise<TaskResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('accessToken: ' + accessToken);

    if (!response.ok) {
      console.log('response.ok: ' + response.ok);
      throw new Error('네트워크 응답에 문제가 있습니다.');
    }

    return response.json();
  } catch (error) {
    console.log('error: ' + error);
    console.error('Error fetching task:', error);
    throw error;
  }
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
  const response = await api.patch(`v1/tasks/${taskId}/hold-off`, {
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('작업 업데이트에 실패했습니다.');
  }

  if (response.status === 204) {
    return {} as TaskResponse;
  }

  return response.json();
};

export const patchTaskStatus = async ({
  taskId,
  status,
}: StatusParams): Promise<TaskResponse> => {
  const response = await api.patch(`v1/tasks/${taskId}/status`, {
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('작업 상태 업데이트에 실패했습니다.');
  }

  return response.json();
};
