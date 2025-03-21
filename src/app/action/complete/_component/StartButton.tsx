'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { usePatchTaskStatus } from '@/hooks/useTask';

export default function StartButton({
  currentTaskId,
}: {
  currentTaskId: string;
}) {
  const router = useRouter();
  const { mutate: patchTaskStatus } = usePatchTaskStatus();

  const handleStart = async () => {
    try {
      await patchTaskStatus({ taskId: currentTaskId, status: 'FOCUSED' });
      router.push(`/immersion/${currentTaskId}`);
    } catch (error) {
      console.error('Failed to start immersion:', error);
    }
  };

  return (
    <div className="mt-auto flex w-full flex-col items-center px-5 py-6">
      <div className="fixed bottom-0 left-0 right-0 h-[245px]" />
      <Button variant="primary" className="mb-4 w-full" onClick={handleStart}>
        몰입 시작하기
      </Button>
    </div>
  );
}
