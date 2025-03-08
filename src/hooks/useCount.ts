import { useState, useEffect } from 'react';
import { getRemainingTime } from '@/utils/dateFormat';

/**
 * targetDate(ISO 문자열)까지 남은 시간을 1초마다 갱신해주는 커스텀 훅
 */
export function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState(() => getRemainingTime(targetDate));

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(getRemainingTime(targetDate));
    }, 1000);

    return () => clearInterval(timerId);
  }, [targetDate]);

  return timeLeft;
}
