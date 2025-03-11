import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useWebViewMessage = (router: ReturnType<typeof useRouter>) => {
  const handleTakePicture = () => {
    try {
      const message = JSON.stringify({ type: 'CAMERA_OPEN' });
      window.ReactNativeWebView?.postMessage(message);
    } catch (error) {
      console.error('메시지 전송 에러:', error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.source !== window.ReactNativeWebView) return;

        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        console.log('웹뷰에서 받은 메시지:', data);

        if (data.type === 'CAPTURED_IMAGE') {
          localStorage.setItem('capturedImage', data.payload.image);
          router.push('/action/complete');
        }
      } catch (error) {
        console.error('메시지 파싱 에러:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  return { handleTakePicture };
};
