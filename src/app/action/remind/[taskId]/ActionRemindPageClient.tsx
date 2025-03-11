'use client';

import { useState } from 'react';
import { usePatchTaskHoldOff, useTask } from '@/hooks/useTask';
import { TaskResponse } from '@/types/task';

import Header from './_component/Header';
import TimesList from './_component/TimesList';
import TaskDetails from './_component/TaskDetails';
import CompleteButton from './_component/CompleteButton';
import CountSelector from './_component/CountSelector';

const REMINDER_LIMITS = {
  MIN: 1,
  MAX: 3,
} as const;

const DEFAULT_VALUES = {
  INTERVAL: 15,
  COUNT: 1,
} as const;

interface ReminderTime {
  index: number;
  time: string;
}

interface ActionRemindPageClientProps {
  initialTask: TaskResponse;
}

const calculateReminderTimes = (
  count: number,
  interval: number,
): ReminderTime[] => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(now.getTime() + interval * 60000 * (i + 1));
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours;

    return {
      index: i + 1,
      time: `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`,
    };
  });
};

// 리마인더 카운트 관리 커스텀 훅
const useReminderCount = (initialCount: number = DEFAULT_VALUES.COUNT) => {
  const [count, setCount] = useState(initialCount);

  const handleCountChange = (action: 'increase' | 'decrease') => {
    setCount((prev) => {
      if (action === 'increase' && prev < REMINDER_LIMITS.MAX) return prev + 1;
      if (action === 'decrease' && prev > REMINDER_LIMITS.MIN) return prev - 1;
      return prev;
    });
  };

  return { count, handleCountChange };
};

export default function ActionRemindPageClient({
  initialTask,
}: ActionRemindPageClientProps) {
  const { count, handleCountChange } = useReminderCount();
  const [selectedInterval, setSelectedInterval] = useState<number>(
    DEFAULT_VALUES.INTERVAL,
  );
  const { mutate } = usePatchTaskHoldOff();
  const { data } = useTask(initialTask.id.toString(), {
    initialData: initialTask,
  });

  const handlePatch = () => {
    mutate({
      taskId: data?.id.toString() ?? '',
      data: {
        remindInterval: selectedInterval,
        remindCount: count,
        remindBaseTime: new Date().toISOString(),
      },
    });
  };

  const reminderTimes = calculateReminderTimes(count, selectedInterval);

  return (
    <>
      <Header maxNotificationCount={REMINDER_LIMITS.MAX} />
      <TaskDetails
        taskName={data?.name ?? ''}
        remainingTime="4시간"
        selectedInterval={selectedInterval}
        onIntervalChange={setSelectedInterval}
      />
      <CountSelector
        count={count}
        onIncrease={() => handleCountChange('increase')}
        onDecrease={() => handleCountChange('decrease')}
      />
      <TimesList times={reminderTimes} />
      <CompleteButton onClick={handlePatch} />
    </>
  );
}
