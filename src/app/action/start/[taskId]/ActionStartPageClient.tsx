'use client';

import { useRouter } from 'next/navigation';
import { useTask } from '@/hooks/useTask';
import { TaskResponse } from '@/types/task';
import { formatKoreanDateTime } from '@/utils/dateFormat';
import { useWebViewMessage } from '@/hooks/useWebViewMessage';

import ActionCard from './_component/ActionCard';
import ScheduleCard from './_component/ScheduleCard';
import ActionStartDrawer from './_component/ActionStartDrawer';
import ActionStartHeader from './_component/ActionStartHeader';

interface Props {
  initialTask: TaskResponse;
}

export default function ActionStartPageClient({ initialTask }: Props) {
  const router = useRouter();
  const { handleTakePicture } = useWebViewMessage(router);

  const { data, error, isLoading } = useTask(initialTask.id.toString(), {
    initialData: initialTask,
  });

  return (
    <div className="flex h-screen flex-col gap-4 bg-background-primary">
      <ActionStartHeader />
      <div className="flex flex-col gap-4 px-5">
        <ActionCard title={data?.triggerAction} />
        <ScheduleCard
          title={data?.name}
          dueDate={formatKoreanDateTime(data?.dueDatetime ?? '')}
        />
      </div>

      <ActionStartDrawer
        onTakePicture={handleTakePicture}
        smallActionTitle={data?.triggerAction}
        dueDate={data?.dueDatetime}
        taskId={data?.id?.toString()}
      />
    </div>
  );
}
