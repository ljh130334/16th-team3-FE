'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/component/Badge';

export default function Remind() {
  const router = useRouter();
  const [selectedInterval, setSelectedInterval] = useState(15);
  const [isIntervalSelectOpen, setIsIntervalSelectOpen] = useState(false);
  const [reminderCount, setReminderCount] = useState(2);

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
      <div className="flex items-center px-5 py-[14px]">
        <Image src="/arrow-left.svg" alt="왼쪽 화살표" width={24} height={24} />
      </div>
      <div className="mt-2.5 flex flex-col gap-4 px-5 pb-6 pt-5">
        <p className="text-[24px] font-semibold leading-[140%] text-white">
          작업을 시작할 때 까지
          <br />
          계속 리마인드 해드릴게요
        </p>
        <p className="text-b2 text-gray-neutral">
          선택하신 주기로 최대
          <span className="font-semibold text-component-accent-primary">
            3번
          </span>
          의 알림을 드려요
        </p>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <p>디자인포트폴리오 점검하기</p>
          <Badge>마감까지 4시간</Badge>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-5">
            <Image src="/repeat.svg" alt="반복" width={24} height={24} />
          </div>
          {/* 주기 select box */}
          <div
            className="relative w-full"
            onClick={() => setIsIntervalSelectOpen(!isIntervalSelectOpen)}
          >
            <div className="flex items-center justify-between rounded-[10px] bg-component-gray-secondary px-4 py-[11px]">
              <div className="text-s1">{selectedInterval}분 마다</div>
              <Image
                src="/chevron-down.svg"
                alt="체크"
                width={24}
                height={24}
              />
            </div>

            {/* 인터벌 선택 목록 */}
            <div
              className={`absolute right-0 top-full mt-3 w-[189px] transform flex-col rounded-2xl bg-component-gray-tertiary pb-2.5 pt-5 transition-all duration-200 ease-in-out ${
                isIntervalSelectOpen
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-2 opacity-0'
              } `}
            >
              <p className="px-5 text-c2 text-gray-alternative">타이틀</p>
              {[
                { interval: '15분 마다', value: 15 },
                { interval: '30분 마다', value: 30 },
                { interval: '1시간 마다', value: 60 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer items-center justify-between px-5 py-3"
                  onClick={() => setSelectedInterval(item.value)}
                >
                  <p
                    className={`text-l3 ${
                      selectedInterval === item.value
                        ? 'text-component-accent-primary'
                        : 'text-gray-normal'
                    }`}
                  >
                    {item.interval}
                  </p>
                  {selectedInterval === item.value && (
                    <Image
                      src="/check-primary.svg"
                      alt="체크"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-[20.5px]">
        <p>다음 리마인더</p>
        <div className="flex h-8 w-[96px] items-center">
          <div
            className={`flex h-full w-1/3 cursor-pointer items-center justify-center rounded-[8px] bg-component-gray-secondary text-center text-base leading-[145%] text-gray-normal ${
              reminderCount === 1 ? 'opacity-40' : ''
            }`}
            onClick={() => handleReminderCount('decrease')}
          >
            -
          </div>
          <div className="flex h-full w-1/3 items-center justify-center rounded-[8px] text-center text-s2 text-gray-normal">
            {reminderCount}
          </div>
          <div
            className={`flex h-full w-1/3 cursor-pointer items-center justify-center rounded-[8px] bg-component-gray-secondary text-center text-base leading-[145%] text-gray-normal ${
              reminderCount === 3 ? 'opacity-40' : ''
            }`}
            onClick={() => handleReminderCount('increase')}
          >
            +
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-[19.5px]">
        {reminderTimes.map((item) => (
          <div key={item.index} className="px-5 py-4 text-t2 text-gray-neutral">
            <span className="mr-2.5 text-component-accent-primary">
              {item.index}
            </span>
            {item.time}
          </div>
        ))}
      </div>
      <div className="relative mt-auto flex flex-col items-center px-5 py-6">
        <Button variant="primary" className="relative mb-4 w-full">
          완료
        </Button>
        <Button
          variant="primary"
          className="relative mb-4 w-full"
          onClick={() => router.push('/action/push')}
        >
          푸쉬알림화면
        </Button>
      </div>
    </div>
  );
}
