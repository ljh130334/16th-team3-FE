interface RemindData {
  remindInterval: number;
  remindCount: number;
  remindBaseTime: string;
}

export const fetchRemind = async (taskId: string, data: RemindData) => {
  const response = await fetch(`/v1/tasks/${taskId}/hold-off`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiaWF0IjoxNzQwMzA3MjAwLCJleHAiOjE3NDc5OTMyMDB9.wzUeK94JGyNnC0iyZpWjdJppD66R3dI4jBD8sdWdT44`,
    },
    body: JSON.stringify(data),
  });
  return response;
};
