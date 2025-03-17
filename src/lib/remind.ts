import { api } from './ky';

interface RemindData {
  remindInterval: number;
  remindCount: number;
  remindBaseTime: string;
}

export const fetchRemind = async (taskId: string, data: RemindData) => {
  const response = await api.patch(`/v1/tasks/${taskId}/hold-off`, {
    body: JSON.stringify(data),
  });
  return response;
};
