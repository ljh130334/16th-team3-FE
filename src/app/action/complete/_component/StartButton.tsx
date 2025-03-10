'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function StartButton() {
  const router = useRouter();

  return (
    <div className="relative mt-auto flex flex-col items-center px-5 py-6">
      <div className="fixed bottom-0 left-0 right-0 h-[245px]" />
      <Button variant="primary" className="relative mb-4 w-full">
        몰입 시작하기
      </Button>
      <Button
        variant="primary"
        className="relative mb-4 w-full"
        onClick={() => router.push('/')}
      >
        뒤로가기
      </Button>
    </div>
  );
}
