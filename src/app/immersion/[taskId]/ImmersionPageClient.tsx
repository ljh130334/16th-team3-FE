'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TaskResponse } from '@/types/task';
import { usePatchTaskStatus } from '@/hooks/useTask';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/component/Badge';
import Countdown from '@/components/countdown/countdown';

interface Props {
  initialTask: TaskResponse;
}

export default function ImmersionPageClient({ initialTask }: Props) {
  const router = useRouter();

  // const { data, error, isLoading } = useTask(initialTask.id.toString(), {
  //   initialData: initialTask,
  // });

  const { mutate: patchTaskStatus } = usePatchTaskStatus();

  return (
    <div className="flex h-screen flex-col bg-background-primary">
      {/* TODO : 헤더 컴포넌트로 변경 예정 */}
      <div className="flex items-center px-5 py-[14px]">
        <Image src="/arrow-left.svg" alt="왼쪽 화살표" width={24} height={24} />
      </div>
      <div className="mt-4 flex flex-col items-center justify-center">
        <div className="text-s2">디프만 리서치 과제 마감까지</div>
        <Countdown
          deadline={initialTask?.dueDatetime ?? ''}
          className="text-h2"
        />
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Image
            src="/study-dog.png"
            alt="경고 아이콘"
            width={140}
            height={140}
          />
        </div>
        <Badge>눈물의 과제 김디퍼</Badge>
      </div>

      <div className="relative mt-auto flex flex-col items-center px-5 py-6">
        <Button
          variant="primary"
          className="relative mb-4 w-full"
          onClick={() =>
            patchTaskStatus({
              taskId: initialTask?.id?.toString() ?? '',
              status: 'COMPLETE',
            })
          }
        >
          다했어요!
        </Button>
      </div>
    </div>
  );
}
