'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StartButton({
  currentTaskId,
}: {
  currentTaskId: string;
}) {
  const router = useRouter();

  return (
    <div className="relative mt-auto flex flex-col items-center px-5 py-6">
      <div className="fixed bottom-0 left-0 right-0 h-[245px]" />
      <Link href={`/immersion/${currentTaskId}`}>
        <Button variant="primary" className="relative mb-4 w-full">
          몰입 시작하기
        </Button>
      </Link>
    </div>
  );
}
