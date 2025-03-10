import { TaskResponse } from '@/types/task';

export const fetchTask = async (taskId: string): Promise<TaskResponse> => {
  const response = await fetch(`https://app.spurt.site/v1/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiaWF0IjoxNzQwMzA3MjAwLCJleHAiOjE3NDc5OTMyMDB9.wzUeK94JGyNnC0iyZpWjdJppD66R3dI4jBD8sdWdT44`,
    },
  });
  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 있습니다.');
  }
  return response.json();
};

export interface HoldOffRequestBody {
  remindInterval: number;
  remindCount: number;
  remindBaseTime: string;
}

interface PatchTaskParams {
  taskId: string | number;
  data: HoldOffRequestBody;
}

export const patchTaskHoldOff = async ({
  taskId,
  data,
}: PatchTaskParams): Promise<TaskResponse> => {
  const response = await fetch(
    `https://app.spurt.site/v1/tasks/${taskId}/hold-off`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiaWF0IjoxNzQwMzA3MjAwLCJleHAiOjE3NDc5OTMyMDB9.wzUeK94JGyNnC0iyZpWjdJppD66R3dI4jBD8sdWdT44`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('작업 업데이트에 실패했습니다.');
  }

  return response.json();
};
