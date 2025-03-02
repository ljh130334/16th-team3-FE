import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type TaskItemProps = {
  title: string;
  dueTime: string;
  dueDate: string;
  taskId: number;
  onClick: () => void;
  onDelete: () => void;
  onPreviewStart?: () => void;
  ignoredAlerts?: number;
  resetAlerts?: (taskId: number) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ 
  title, 
  dueTime, 
  dueDate,
  taskId,
  onClick,
  onDelete,
  onPreviewStart = () => {},
  ignoredAlerts = 0, // 기본값은 0
  resetAlerts = () => {}
}) => {
  const router = useRouter();
  const [showUrgentBottomSheet, setShowUrgentBottomSheet] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const isUrgent = ignoredAlerts >= 3;
  
  // 남은 시간 계산 함수
  const calculateRemainingTime = () => {
    // dueDate가 "2025-03-01" 같은 형식일 경우
    // dueTime이 "오후 7시까지" 같은 형식일 경우 파싱
    
    const now = new Date();
    
    let dueDateTime = new Date(dueDate);
    
    // dueTime에서 시간 추출 (예: "오후 7시까지" -> 19, "오전 9시까지" -> 9)
    let hours = 0;
    if (dueTime.includes('오후')) {
      const match = dueTime.match(/오후\s*(\d+)시/);
      if (match && match[1]) {
        hours = parseInt(match[1]);
        if (hours !== 12) hours += 12; // 오후는 +12 (오후 12시는 그대로 12)
      }
    } else if (dueTime.includes('오전')) {
      const match = dueTime.match(/오전\s*(\d+)시/);
      if (match && match[1]) {
        hours = parseInt(match[1]);
        if (hours === 12) hours = 0; // 오전 12시는 0시
      }
    } else {
      // "3시간 소요"와 같은 형식일 경우, 현재 시간 + 소요시간으로 계산
      const match = dueTime.match(/(\d+)시간/);
      if (match && match[1]) {
        const hoursToAdd = parseInt(match[1]);
        dueDateTime = new Date();
        dueDateTime.setHours(dueDateTime.getHours() + hoursToAdd);
      }
    }
    
    // 시간 설정 (dueTime이 "오후 7시까지" 같은 형식일 경우)
    if (hours > 0) {
      dueDateTime.setHours(hours, 0, 0, 0);
    }
    
    // 남은 시간 계산 (밀리초)
    const timeLeft = dueDateTime.getTime() - now.getTime();
    
    if (timeLeft <= 0) return '00:00:00 남음';
    
    // 24시간 이하일 때
    if (timeLeft <= 24 * 60 * 60 * 1000) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} 남음`;
    } else {
      // 24시간 초과
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days}일 ${hours}시간 ${minutes}분 남음`;
    }
  };
  
  // 1초마다 남은 시간 업데이트
  useEffect(() => {
    setRemainingTime(calculateRemainingTime());
    
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [dueDate, dueTime]);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUrgent) {
      // 알림을 3회 이상 무시한 경우 바텀시트 표시
      setShowUrgentBottomSheet(true);
    } else {
      // 그렇지 않은 경우 일반적인 미리 시작 처리
      onPreviewStart();
    }
  };
  
  const handleCloseUrgentSheet = () => {
    setShowUrgentBottomSheet(false);
  };
  
  const handleStart = () => {
    resetAlerts(taskId);
    router.push(`/focus?taskId=${taskId}`);
    setShowUrgentBottomSheet(false);
  };

  return (
    <>
      <div 
        className="bg-component-gray-secondary rounded-[20px] p-4 mb-4"
        onClick={onClick}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="c3 flex items-center text-text-primary">
              <span className="flex items-center">
                <span>오늘 자정까지</span>
                <span className="c3 text-text-neutral mx-1">•</span>
                <Image
                  src="/icons/home/clock.svg"
                  alt="Character"
                  width={14}
                  height={14}
                  className="mr-[4px] mb-[2px]"
                  />
                <span className="c3 text-text-neutral">{dueTime} 소요</span>
              </span>
            </div>
            <div className="s2 mt-[3px] text-text-strong">
              {title}
            </div>
          </div>
          <button 
            className={`l4 rounded-[10px] px-[12px] py-[9.5px] ${
              isUrgent 
                ? 'bg-hologram text-text-inverse' 
                : 'bg-component-accent-primary text-text-strong'
            }`}
            onClick={handleButtonClick}
          >
            {isUrgent ? '지금 시작' : '미리 시작'}
          </button>
        </div>
      </div>
      
      {showUrgentBottomSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
          <div className="w-full bg-component-gray-secondary rounded-t-[28px] p-4 pt-10 flex flex-col items-center">
            <h2 className="t3 text-text-strong text-center">{title}</h2>
            <p className="t3 text-text-strong text-center mb-2">더 늦기 전에 바로 시작할까요?</p>
            <p className="b3 text-text-neutral text-center mb-7">마감까지 {remainingTime}</p>
            <button
              className="w-full bg-component-accent-primary text-white rounded-xl py-4 mb-3 l2"
              onClick={handleStart}
            >
              지금 시작
            </button>
            
            <button
              className="w-full text-text-neutral py-4 l2"
              onClick={handleCloseUrgentSheet}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;