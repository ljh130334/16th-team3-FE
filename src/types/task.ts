export type TaskStatus = 'pending' | 'inProgress' | 'completed' | 'reflected';
export type TaskType = 'today' | 'weekly' | 'future';

export interface Task {
  id: number;
  title: string;
  dueDate: string;
  dueDay: string;
  dueTime: string;
  dueDatetime: string;
  timeRequired: string;
  dDayCount: number;
  description: string;
  type: TaskType;
  status: TaskStatus;
  ignoredAlerts?: number;
  startedAt?: string;
  persona?: {
    id: number;
    name: string;
    personalImageUrl: string;
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
  triggerAction?: string;
  triggerActionAlarmTime?: string;
  estimatedTime?: number;
  createdAt?: string;
}

export interface TaskResponse {
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
    personalImageUrl: string;
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

// API 응답을 Task 타입으로 변환하는 함수
export function convertApiResponseToTask(response: TaskResponse): Task {
  try {
    // dueDatetime이 없는 경우 기본값 설정
    if (!response.dueDatetime) {
      console.warn('dueDatetime이 없는 태스크:', response.id);
      return {
        id: response.id,
        title: response.name || '제목 없음',
        dueDate: '날짜 미정',
        dueDay: '',
        dueTime: '',
        dueDatetime: new Date().toISOString(),
        timeRequired: '시간 미정',
        dDayCount: 0,
        description: response.category || '',
        type: 'future',
        status: 'pending',
        ignoredAlerts: 0,
        persona: response.persona,
        triggerAction: response.triggerAction,
        triggerActionAlarmTime: response.triggerActionAlarmTime,
        estimatedTime: response.estimatedTime,
        createdAt: response.createdAt
      };
    }
    
    // dueDatetime에서 날짜 및 요일 계산
    const dueDate = new Date(response.dueDatetime);
    const year = dueDate.getFullYear();
    const month = String(dueDate.getMonth() + 1).padStart(2, '0');
    const day = String(dueDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // 요일 계산
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[dueDate.getDay()];
    const dueDay = `(${dayOfWeek})`;
    
    // 시간 형식 변환 (예: "오후 6시까지")
    const hours = dueDate.getHours();
    const amPm = hours >= 12 ? '오후' : '오전';
    const hour12 = hours % 12 || 12;
    const dueTime = `${amPm} ${hour12}시까지`;
    
    // D-Day 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay0 = new Date(dueDate);
    dueDay0.setHours(0, 0, 0, 0);
    const diffTime = dueDay0.getTime() - today.getTime();
    const dDayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 태스크 타입 결정 (오늘, 이번주, 이후)
    let type: TaskType = 'future';
    if (dDayCount === 0) {
      type = 'today';
    } else if (dDayCount > 0 && dDayCount <= 7) {
      type = 'weekly';
    }
    
    // 상태 변환
    let status: TaskStatus = 'pending';
    if (response.status === 'INPROGRESS') {
      status = 'inProgress';
    } else if (response.status === 'COMPLETED') {
      status = 'completed';
    } else if (response.status === 'REFLECTED') {
      status = 'reflected';
    }
    
    // 예상 소요시간 변환 (시간 형식)
    let timeRequired = '1시간 소요';
    if (response.estimatedTime) {
      const hours = Math.floor(response.estimatedTime / 60);
      const minutes = response.estimatedTime % 60;
      if (hours > 0 && minutes > 0) {
        timeRequired = `${hours}시간 ${minutes}분 소요`;
      } else if (hours > 0) {
        timeRequired = `${hours}시간 소요`;
      } else if (minutes > 0) {
        timeRequired = `${minutes}분 소요`;
      }
    }
    
    return {
      id: response.id,
      title: response.name,
      dueDate: formattedDate,
      dueDay,
      dueTime,
      dueDatetime: response.dueDatetime,
      timeRequired,
      dDayCount,
      description: response.category,
      type,
      status,
      ignoredAlerts: 0,
      startedAt: status === 'inProgress' ? new Date().toISOString() : undefined,
      persona: response.persona,
      triggerAction: response.triggerAction,
      triggerActionAlarmTime: response.triggerActionAlarmTime,
      estimatedTime: response.estimatedTime,
      createdAt: response.createdAt
    };
  } catch (error) {
    console.error('태스크 변환 중 오류 발생:', error);
    // 최소한의 기본 태스크 반환
    return {
      id: response.id,
      title: response.name || '오류 발생',
      dueDate: '',
      dueDay: '',
      dueTime: '',
      dueDatetime: '',
      timeRequired: '',
      dDayCount: 0,
      description: '',
      type: 'future',
      status: 'pending',
      ignoredAlerts: 0
    };
  }
}