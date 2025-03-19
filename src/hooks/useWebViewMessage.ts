import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import Cookies from 'js-cookie';

export const useWebViewMessage = (router?: ReturnType<typeof useRouter>) => {
  const setDeviceInfo = useUserStore((state) => state.setDeviceInfo);

  const handleTakePicture = () => {
    try {
      const message = JSON.stringify({ type: 'CAMERA_OPEN' });
      window.ReactNativeWebView?.postMessage(message);
    } catch (error) {
      console.error('메시지 전송 에러:', error);
    }
  };

  const handleGetDeviceToken = () => {
    try {
      const message = JSON.stringify({ type: 'GET_DEVICE_TOKEN' });
      window.ReactNativeWebView?.postMessage(message);
    } catch (error) {
      console.error('메시지 전송 에러:', error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data.type === 'CAPTURED_IMAGE') {
          localStorage.setItem('capturedImage', data.payload.image);
          router?.push('/action/complete');
        }
        if (data.type === 'GET_DEVICE_TOKEN') {
          localStorage.setItem('deviceToken', data.payload.fcmToken);
          console.log('data.payload.fcmToken', data.payload.fcmToken);

          if (data.payload.fcmToken) {
            Cookies.set('deviceId', data.payload.fcmToken, {
              expires: 30, // 30일
              path: '/',
              secure: false,
            });

            Cookies.set('deviceType', data.payload.deviceType, {
              expires: 30,
              path: '/',
              secure: false,
            });
          }
        }
      } catch (error) {
        console.error('메시지 파싱 에러:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  return { handleTakePicture, handleGetDeviceToken };
};
