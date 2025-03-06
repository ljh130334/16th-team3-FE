'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTask } from '@/hooks/useTask';
import { TaskResponse } from '@/types/task';
import { formatKoreanDateTime } from '@/utils/dateFormat';

import ActionCard from './_component/ActionCard';
import ScheduleCard from './_component/ScheduleCard';
import ActionStartDrawer from './_component/ActionStartDrawer';
import ActionStartHeader from './_component/ActionStartHeader';

interface Props {
  initialTask: TaskResponse;
}

export default function ActionStartPageClient({ initialTask }: Props) {
  const router = useRouter();

  const { data, error, isLoading } = useTask(initialTask.id.toString(), {
    initialData: initialTask,
  });

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      try {
        const data = JSON.parse(event.data);
        console.log('웹뷰에서 받은 메시지:', data);

        if (data.type === 'CAPTURED_IMAGE') {
          localStorage.setItem('capturedImage', data.payload.image);
          router.push('/action/complete');
        }
      } catch (error) {
        console.error('메시지 파싱 에러:', error);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleTakePicture = () => {
    try {
      const message = { type: 'CAMERA_OPEN' };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } catch (error) {
      console.error('메시지 전송 에러:', error);
    }
  };

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="flex h-screen flex-col gap-4 bg-background-primary">
      <ActionStartHeader />
      <div className="flex flex-col gap-4 px-5">
        <ActionCard title={data?.triggerAction} />
        <ScheduleCard
          title={data?.name}
          dueDate={formatKoreanDateTime(data?.dueDatetime)}
        />
      </div>

      <ActionStartDrawer
        onTakePicture={handleTakePicture}
        smallActionTitle={data?.triggerAction}
        dueDate={data?.dueDatetime}
      />
    </div>
  );
}
