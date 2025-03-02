'use client';

import { SmallActionCard } from './component/SmallActionCard';
import { ScheduleCard } from './component/ScheduleCard';
import { ActionStartDrawer } from './component/ActionStartDrawer';
import { ActionStartHeader } from './component/ActionStartHeader';
declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(message: string): void;
    };
  }
}

export default function Start() {
  const handleTakePicture = () => {
    try {
      const message = {
        type: 'CAMERA_OPEN',
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen flex-col gap-4 bg-background-primary">
      <ActionStartHeader />

      <div className="flex flex-col gap-4 px-5">
        <SmallActionCard title="책상에서 피그마 프로그램 켜기" />
        <ScheduleCard
          title="디자인 포트폴리오 점검하기"
          dueDate="2월 12일 (목) 오후 08:00"
        />
      </div>

      <ActionStartDrawer
        onTakePicture={handleTakePicture}
        smallActionTitle="책상에서 피그마 프로그램 켜기"
        timerTime="04 : 59 : 24"
      />
    </div>
  );
}
