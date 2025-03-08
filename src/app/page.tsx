'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleTakePicture = () => {
    try {
      const message = { type: 'CAMERA_OPEN' };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } catch (error) {
      console.error('메시지 전송 에러:', error);
    }
  };
  return (
    <div>
      <Button
        variant="hologram"
        onClick={() => router.push('/action/start/209')}
      >
        작은행동 페이지 이동하기
      </Button>
      <Button
        variant="hologram"
        onClick={() => router.push('/action/start/209')}
      >
        작은행동 페이지 이동하기
      </Button>
      <Button
        variant="hologram"
        onClick={() => router.push('/action/start/209')}
      >
        작은행동 페이지 이동하기
      </Button>
      <Button
        variant="hologram"
        onClick={() => router.push('/action/start/209')}
      >
        작은행동 페이지 이동하기
      </Button>
      <Button variant="primary" onClick={handleTakePicture}>
        사진찍기^^
      </Button>
      <Button variant="primary" onClick={handleTakePicture}>
        사진찍기^^
      </Button>
      <Button
        variant="primary"
        onClick={() => router.push('/action/remind/209')}
      >
        리마인드 페이지 이동하기
      </Button>
      <Button
        variant="primary"
        onClick={() => router.push('/action/remind/209')}
      >
        리마인드 페이지 이동하기
      </Button>
      <Button
        variant="primary"
        onClick={() => router.push('/action/remind/209')}
      >
        리마인드 페이지 이동하기
      </Button>
    </div>
  );
}
