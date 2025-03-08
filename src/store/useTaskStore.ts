import { create } from 'zustand';

interface Task {
  id: number;
  name: string;
  category: string;
  dueDatetime: string;
  triggerAction: string;
  triggerActionAlarmTime: string;
  estimatedTime: number;
  status: string;
  persona: {
    id: number;
    name: string;
    personaImageUrl: string;
    taskKeywordsCombination: {
      taskType: {
        id: number;
        name: string;
      };
      taskMode: {
        id: number;
        name: string;
      };
    };
  };
  createdAt: string;
}

interface TaskProgressStore {
  currentTask: Task | null;
  setCurrentTask: (task: Task) => void;
}

export const useTaskProgressStore = create<TaskProgressStore>((set) => ({
  currentTask: null,
  setCurrentTask: (task) => set({ currentTask: task }),
}));
