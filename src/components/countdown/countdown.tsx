import React from 'react';
import { useCurrentTime } from '@/provider/CurrentTimeProvider';

interface CountdownProps {
  deadline: string; // ISO 문자열
  className?: string;
}

export default function Countdown({ deadline, className }: CountdownProps) {
  const { currentTime } = useCurrentTime();
  console.log(deadline);
  const deadlineTimestamp = new Date(deadline).getTime();
  const remaining = Math.max(deadlineTimestamp - currentTime, 0);
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  console.log(seconds);
  return (
    <span className={className}>
      {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds}
    </span>
  );
}
