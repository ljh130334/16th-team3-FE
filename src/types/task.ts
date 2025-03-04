export interface TaskResponse {
  id: number;
  name: string;
  category: string;
  dueDatetime: string;
  triggerAction: string;
  triggerActionAlarmTime: string;
  estimatedTime: number;
  status:
    | 'BEFORE'
    | 'WARMING_UP'
    | 'PROCRASTINATING'
    | 'HOLDING_OFF'
    | 'FOCUSED'
    | 'COMPLETE'
    | 'FAIL';
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
