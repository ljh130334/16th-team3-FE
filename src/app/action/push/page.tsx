'use client';

import { useState } from 'react';

import Header from './_component/Header';
import ScheduleCard from './_component/ScheduleCard';
import ActionCard from './_component/ActionCard';
import CountdownTimer from './_component/CountdownTimer';
import ActionDrawer from './_component/ActionDrawer';

export enum PushScreenState {
  INITIAL = 'initial',
  SECOND_CHANCE = 'second',
  FINAL_WARNING = 'final',
}

export default function Push() {
  const [screenState, setScreenState] = useState<PushScreenState>(
    PushScreenState.SECOND_CHANCE,
  );

  const screenContent = {
    [PushScreenState.INITIAL]: {
      icon: '/glasshour.svg',
      message: '이제 두 번의 기회만 남았어요!',
      subMessage: '미루기 전에 \n얼른 시작해보세요!',
    },
    [PushScreenState.SECOND_CHANCE]: {
      icon: '/glasshour.svg',
      message: '한 번만 더 알림이 오고 끝이에요!',
      subMessage: '작업을 더 미루기 전에\n얼른 시작해보세요!',
    },
    [PushScreenState.FINAL_WARNING]: {
      icon: '/dynamite.svg',
      message: '이제 마지막 기회에요',
      subMessage: '더 이상 미룰 수 없어요\n당장 시작하세요!',
    },
  };

  const currentContent = screenContent[screenState];

  return (
    <div className="bg-background-primary flex h-screen flex-col gap-4">
      <Header content={currentContent} />

      <div className="flex flex-col gap-4 px-5">
        <ActionCard
          badgeText="작은 행동"
          actionText="책상에서 피그마 프로그램 켜기"
        />

        <ScheduleCard
          task="디자인 포트폴리오 점검하기"
          deadline="2월 12일 (목) 오후 08:00"
        />
      </div>

      <div className="relative mt-auto flex flex-col items-center px-5 pt-6">
        <div className="fixed bottom-0 left-0 right-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />
        {screenState === PushScreenState.FINAL_WARNING && (
          <div className="purple-blur-effect absolute inset-0"></div>
        )}
        <CountdownTimer timeLeft="마감까지 04 : 59 : 24 이 남았어요" />

        <ActionDrawer screenState={screenState} />
      </div>
      {screenState !== PushScreenState.FINAL_WARNING && (
        <button className="text-gray-neutral relative mb-[34px]">
          나중에 할래요
        </button>
      )}
    </div>
  );
}
