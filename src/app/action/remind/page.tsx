'use client';

import Image from 'next/image';
import { useState } from 'react';

import Header from './_component/Header';
import TimesList from './_component/TimesList';
import TaskDetails from './_component/TaskDetails';
import CompleteButton from './_component/CompleteButton';
import CountSelector from './_component/CountSelector';

export default function Remind() {
  const [selectedInterval, setSelectedInterval] = useState(15);
  const [reminderCount, setReminderCount] = useState(1);

  // 리마인더 시간 계산 함수
  const calculateReminderTimes = () => {
    const times = [];
    const now = new Date();

    for (let i = 0; i < reminderCount; i++) {
      const time = new Date(now.getTime() + selectedInterval * 60000 * (i + 1));
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const period = hours >= 12 ? '오후' : '오전';
      const displayHours = hours > 12 ? hours - 12 : hours;

      times.push({
        index: i + 1,
        time: `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`,
      });
    }
    return times;
  };

  // 리마인더 갯수 조절 함수
  const handleReminderCount = (action: 'increase' | 'decrease') => {
    if (action === 'increase' && reminderCount < 3) {
      setReminderCount((prev) => prev + 1);
    } else if (action === 'decrease' && reminderCount > 1) {
      setReminderCount((prev) => prev - 1);
    }
  };

  const reminderTimes = calculateReminderTimes();

  return (
    <div className="flex h-screen flex-col bg-background-primary">
      {/* TODO : 헤더 컴포넌트로 변경 예정 */}
      <div className="flex items-center px-5 py-[14px]">
        <Image src="/arrow-left.svg" alt="왼쪽 화살표" width={24} height={24} />
      </div>
      <Header maxNotificationCount={3} />

      <TaskDetails
        taskName="디자인포트폴리오 점검하기"
        remainingTime="4시간"
        selectedInterval={selectedInterval}
        onIntervalChange={(newInterval) => setSelectedInterval(newInterval)}
      />
      <CountSelector
        count={reminderCount}
        onIncrease={() => handleReminderCount('increase')}
        onDecrease={() => handleReminderCount('decrease')}
      />
      <TimesList times={reminderTimes} />
      <CompleteButton />
    </div>
  );
}
