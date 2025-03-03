'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CompleteButton() {
  const router = useRouter();
  return (
    <div className="relative mt-auto flex flex-col items-center px-5 py-6">
      <Button variant="primary" className="relative mb-4 w-full">
        완료
      </Button>
      <Button
        variant="primary"
        className="relative mb-4 w-full"
        onClick={() => router.push('/action/push')}
      >
        푸쉬알림가기
      </Button>
    </div>
  );
}
