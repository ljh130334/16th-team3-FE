import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { parseDateAndTime, calculateRemainingTime } from '@/utils/dateFormat';
import { Task } from '@/types/task';

interface InProgressTaskItemProps {
  task: Task;
  onContinue: (taskId: number) => void;
  isReentry?: boolean;
  onShowDetails?: (task: Task) => void;
}

const InProgressTaskItem: React.FC<InProgressTaskItemProps> = ({ 
  task, 
  onContinue, 
  isReentry = false,
  onShowDetails
}) => {
  const router = useRouter();
  const [showRemaining, setShowRemaining] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // 남은 시간 계산 함수 개선
  const calculateRemainingTimeLocal = useCallback(() => {
    // 현재 시간 기준으로 계산
    const now = new Date().getTime();
    
    // dueDatetime이 있으면 사용, 없으면 dueDate와 dueTime에서 계산
    let dueDatetime;
    if (task.dueDatetime) {
      dueDatetime = new Date(task.dueDatetime);
    } else {
      dueDatetime = parseDateAndTime(task.dueDate, task.dueTime);
    }
    
    const timeLeft = dueDatetime.getTime() - now;
    
    // 남은 시간(ms) 저장
    setTimeLeftMs(timeLeft);
    
    // 마감 지났는지 확인
    setIsExpired(timeLeft < 0);
    
    // 1시간 이내인지 체크
    setIsUrgent(timeLeft <= 60 * 60 * 1000 && timeLeft > 0);
    
    return calculateRemainingTime(dueDatetime);
  }, [task]);

  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setShowRemaining(prev => !prev);
    }, 3000);
    
    return () => clearInterval(toggleInterval);
  }, []);

  // 1초마다 남은 시간 업데이트
  useEffect(() => {
    const updateRemainingTime = () => {
      setRemainingTime(calculateRemainingTimeLocal());
    };
    
    updateRemainingTime();
    
    const timeInterval = setInterval(updateRemainingTime, 1000);
    
    return () => clearInterval(timeInterval);
  }, [calculateRemainingTimeLocal]);

  // 홈화면 재진입 시 자동으로 바텀시트 표시
  useEffect(() => {
    // 홈화면 재진입인 경우에만 바텀시트 표시
    if (isReentry) {
      setShowBottomSheet(true);
    }
  }, [isReentry]);

  // 이어서 몰입 버튼 클릭 시 - 홈화면 재진입이 아닌 경우에는 태스크 상세 바텀시트 표시
  const handleContinueClick = () => {
    if (isReentry) {
      // 재진입인 경우 이어서 몰입 바텀시트 표시
      setShowBottomSheet(true);
    } else {
      // 일반 상태에서는 태스크 상세 바텀시트로 이동
      if (onShowDetails) {
        onShowDetails(task);
      } else {
        // 상세 정보 표시 콜백이 없는 경우 바로 몰입 화면으로 이동
        router.push(`/focus?taskId=${task.id}`);
      }
    }
  };
  
  const handleCloseBottomSheet = () => {
    setShowBottomSheet(false);
  };
  
  const handleContinueToFocus = () => {
    router.push(`/focus?taskId=${task.id}`);
    setShowBottomSheet(false);
  };

  // 오늘 날짜 확인
  const isToday = () => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    
    return (
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear()
    );
  };
  
  // 시간 표시 형식 수정
  const formatDueTime = () => {
    if (task.dueTime.includes('자정')) {
      return isToday() ? '오늘 자정까지' : task.dueTime;
    }
    
    // "오후 n시" 형식인지 확인하고 "까지" 추가
    if ((task.dueTime.includes('오후') || task.dueTime.includes('오전')) && !task.dueTime.includes('까지')) {
      const formattedTime = `${task.dueTime}까지`;
      return isToday() ? `오늘 ${formattedTime}` : formattedTime;
    }
    
    return isToday() ? `오늘 ${task.dueTime}` : task.dueTime;
  };

  // 마감 지난 경우 강조 표시
  const getTimeDisplay = () => {
    if (isExpired) {
      // 마감 지난 경우 빨간색 텍스트나 경고 표시 추가 가능
      return (
        <span className="text-red-500">{remainingTime}</span>
      );
    }
    return (
      <TimeDisplay time={remainingTime} />
    );
  };

  // 일반 진행 중 컴포넌트
  if (!isUrgent) {
    return (
      <>
        <div className="bg-component-gray-secondary rounded-[12px] p-4 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-component-gray-tertiary rounded-[20px] p-2 w-12 h-12 flex items-center justify-center">
              <Image
                src="/icons/home/happy-character.svg"
                alt="Task"
                width={32}
                height={32}
              />
            </div>
            <div className="flex-1">
              <p className="text-text-neutral b3">
                {formatDueTime()}
              </p>
              <h3 className="s1 text-text-strong t3 truncate" style={{ maxWidth: '240px' }}>
                {task.title}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={handleContinueClick}
            className="w-full bg-component-accent-primary text-text-strong rounded-[12px] p-3.5 text-center l1 h-[52px] flex items-center justify-center"
          >
            {showRemaining ? (
              getTimeDisplay()
            ) : (
              '이어서 몰입'
            )}
          </button>
        </div>
        
        {/* 이어서 몰입 바텀시트 - 재진입 시에만 표시 */}
        {showBottomSheet && isReentry && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
            <div className="w-full bg-component-gray-secondary rounded-t-[28px] p-4 pt-10 flex flex-col items-center">
              <h2 className="t3 text-text-strong text-center">{task.title}를</h2>
              <p className="t3 text-text-strong text-center mb-2">하던 중이었어요. 이어서 몰입할까요?</p>
              <p className={`b3 ${isExpired ? 'text-red-500' : 'text-text-neutral'} text-center mb-7`}>
                {isExpired ? '마감 시간이 지났습니다' : `마감까지 ${remainingTime}`}
              </p>
              <button
                className="w-full bg-component-accent-primary text-white rounded-[16px] py-4 mb-3 l2"
                onClick={handleContinueToFocus}
              >
                이어서 몰입
              </button>
              
              <button
                className="w-full text-text-neutral py-4 l2"
                onClick={handleCloseBottomSheet}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // 시간 임박 컴포넌트 (1시간 이내)
  return (
    <>
      <div 
        className="rounded-[24px] p-4 mb-4 h-auto flex flex-col justify-between bg-gradient-component-01"
      >
        <div>
          <h2 className="s1 text-text-strong mb-1">{task.title}</h2>
          <p className="b3 text-text-neutral">{formatDueTime()}</p>
        </div>

        <div className='flex justify-center overflow-hidden my-8'>
          <Image
            src="/icons/home/happy-character.svg"
            alt="Character"
            width={87}
            height={87}
          />
        </div>

        <Button 
          variant="hologram"
          onClick={handleContinueClick}
          className="w-full z-10 text-text-inverse rounded-[12px] p-3.5 text-center l2"
        >
          {showRemaining ? (
            getTimeDisplay()
          ) : (
            '이어서 몰입'
          )}
        </Button>
      </div>
      
      {/* 이어서 몰입 바텀시트 - 재진입 시에만 표시 */}
      {showBottomSheet && isReentry && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
          <div className="w-full bg-component-gray-secondary rounded-t-[28px] p-4 pt-10 flex flex-col items-center">
            <h2 className="t3 text-text-strong text-center">{task.title}</h2>
            <p className="t3 text-text-strong text-center mb-2">하던 중이었어요. 이어서 몰입할까요?</p>
            <p className={`b3 ${isExpired ? 'text-red-500' : 'text-text-neutral'} text-center mb-7`}>
              {isExpired ? '마감 시간이 지났습니다' : `마감까지 ${remainingTime}`}
            </p>
            <button
              className="w-full bg-component-accent-primary text-white rounded-[16px] py-4 mb-3 l2"
              onClick={handleContinueToFocus}
            >
              이어서 몰입
            </button>
            
            <button
              className="w-full text-text-neutral py-4 l2"
              onClick={handleCloseBottomSheet}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// 일 포맷 시간 표시 컴포넌트 (n일 n시간 n분 형식)
const DayFormatTimeDisplay = ({ time }: { time: string }) => {
  return (
    <span className="inline-flex items-center justify-center">
      {time}
    </span>
  );
};

// 시:분:초 포맷 시간 표시 컴포넌트
const HMSFormatTimeDisplay = ({ time, isUrgent = false }: { time: string, isUrgent?: boolean }) => {
  const splitTime = time.split(' ');
  const timeString = splitTime[0] || '00:00:00';
  const timeParts = timeString.split(':');
  const suffix = splitTime.slice(1).join(' ');

  // 각 시간 단위를 개별 숫자로 분리해서 관리
  const hours = timeParts[0] || '00';
  const minutes = timeParts[1] || '00';
  const seconds = timeParts[2] || '00';

  // 각 자릿수 분리
  const [h1, h2] = hours.split('');
  const [m1, m2] = minutes.split('');
  const [s1, s2] = seconds.split('');

  // 이전 자릿수 값 저장을 위한 ref
  const prevDigitsRef = useRef({
    h1: h1, h2: h2,
    m1: m1, m2: m2,
    s1: s1, s2: s2
  });

  // 변경된 값 감지
  const hasChangedH1 = h1 !== prevDigitsRef.current.h1;
  const hasChangedH2 = h2 !== prevDigitsRef.current.h2;
  const hasChangedM1 = m1 !== prevDigitsRef.current.m1;
  const hasChangedM2 = m2 !== prevDigitsRef.current.m2;
  const hasChangedS1 = s1 !== prevDigitsRef.current.s1;
  const hasChangedS2 = s2 !== prevDigitsRef.current.s2;

  // 이전 값 저장
  useEffect(() => {
    prevDigitsRef.current = {
      h1, h2, m1, m2, s1, s2
    };
  }, [timeString, h1, h2, m1, m2, s1, s2]);

  if (isUrgent) {
    return (
      <div className="l1 text-text-strong">
        {timeString.replace(/\:/g, ':')}
        {suffix && <span className="ml-1">{suffix}</span>}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center justify-center">
      {hasChangedH1 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`h1-${h1}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {h1}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{h1}</span>
      )}

      {hasChangedH2 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`h2-${h2}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {h2}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{h2}</span>
      )}

      <span>:</span>

      {hasChangedM1 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`m1-${m1}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {m1}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{m1}</span>
      )}

      {hasChangedM2 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`m2-${m2}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {m2}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{m2}</span>
      )}

      <span>:</span>

      {hasChangedS1 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`s1-${s1}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {s1}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{s1}</span>
      )}

      {hasChangedS2 ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`s2-${s2}-${Date.now()}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {s2}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span>{s2}</span>
      )}

      {suffix && <span className="ml-1">{suffix}</span>}
    </span>
  );
};

const TimeDisplay = ({ time, isUrgent = false }: { time: string, isUrgent?: boolean }) => {
  if (time.includes('일')) {
    return <DayFormatTimeDisplay time={time} />;
  } else {
    return <HMSFormatTimeDisplay time={time} isUrgent={isUrgent} />;
  }
};

export default InProgressTaskItem;