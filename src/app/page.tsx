'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <Button variant="hologram" onClick={() => router.push('/action/start')}>
        작은행동 페이지 이동하기
      </Button>
      <Button variant="hologram" onClick={() => router.push('/action/start')}>
        작은행동 페이지 이동하기
      </Button>
      <Button variant="hologram" onClick={() => router.push('/action/start')}>
        작은행동 페이지 이동하기
      </Button>
      <Button variant="hologram" onClick={() => router.push('/action/start')}>
        작은행동 페이지 이동하기
      </Button>
      <Button variant="primary" onClick={() => router.push('/action/remind')}>
        리마인드 페이지 이동하기
      </Button>
      <Button variant="primary" onClick={() => router.push('/action/remind')}>
        리마인드 페이지 이동하기
      </Button>
      <Button variant="primary" onClick={() => router.push('/action/remind')}>
        리마인드 페이지 이동하기
      </Button>
      <Button variant="primary" onClick={() => router.push('/action/remind')}>
        리마인드 페이지 이동하기
      </Button>
    </div>
  );
}
