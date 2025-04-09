'use client';

import { Button } from '@/components/ui/button';
import { useWebViewMessage } from '@/hooks/useWebViewMessage';
import { postFcmToken } from '@/lib/fcmToken';
import { useUserStore } from '@/store/useUserStore';
import { FcmDeviceType } from '@/types/create';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const COOKIE_OPTIONS = {
  expires: 30,
  path: '/',
  secure: false,
} as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const { userData } = useUserStore();
  const { handleGetDeviceToken } = useWebViewMessage();

  // const { mutate: postFcmTokenMutation } = useMutation({
  //   mutationFn: async (data: FcmDeviceType) => {
  //     const res = await postFcmToken(data);
  //     return res;
  //   },
  //   onSuccess: () => {
  //     console.log('FCM 토큰 전송 성공');
  //   },
  //   onError: (error) => {
  //     console.error('FCM 토큰 전송 실패:', error);
  //   },
  // });

  const formatNickname = (name: string) => {
    if (!name) return '';
    if (name.length > 9) {
      return name.substring(0, 9) + '...';
    }
    return name;
  };

  const userNickname = userData?.nickname || '';

  const onboardingPages = [
    {
      title: '여유 시간을 확보하고,\n후회 없이 끝내세요!',
      description:
        '여유 시간을 자동 추가하여 \n여유롭게 완료할 수 있도록 알림을 보낼게요',
      image: '/icons/onboarding/onboarding1.png',
      buttonText: '다음으로',
    },
    {
      title: '1분 안에 작은 행동을 시작하면,\n미루기는 이제 그만!',
      description:
        '미룬 일을 시작하는 데 1분만 투자해요\n완료할 때까지 진동이 울려 시작을 도와줄게요',
      image: '/icons/onboarding/onboarding2.png',
      buttonText: '다음으로',
    },
    {
      title: '캐릭터와 플레이리스트로\n몰입을 더 깊게!',
      description:
        '작업 키워드를 기반으로 몰입 캐릭터를 만들어\n맞춤 환경과 음악을 제공해요',
      image: '/icons/onboarding/onboarding3.svg',
      buttonText: '다음으로',
    },
    {
      title: '모든 기능을 제대로 쓰려면, \n알림이 꼭 필요해요',
      description: '딱 맞는 타이밍에 시작을 끊을 수 있어요!',
      image: '/icons/onboarding/onboarding4.png',
      buttonText: '권한 허용하기',
    },
    {
      title: '미루지 않는 하루,\n지금부터 만들어볼까요?',
      description:
        '지금 당장 시작할 일과, 여유롭게 준비할 일을\n구분해 추가해보세요!',
      image: '/icons/onboarding/onboarding5.svg',
      buttonText: '시작하기',
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      if (currentPage === 3) {
        // 알림 권한 허용 alert 창 띄우기
        console.log('알림 권한 허용 alert 창 띄우기');
        handleClickAccess();
      }
      setCurrentPage(currentPage + 1);
    } else {
      router.push('/');
    }
  };

  // 프로그레스 바는 모든 페이지에 공통으로 표시
  const ProgressBar = () => (
    <div className="relative z-10 flex w-full gap-1">
      {onboardingPages.map((_, index) => (
        <div
          key={index}
          className={`h-1 flex-1 rounded-full ${
            index <= currentPage ? 'bg-hologram' : 'bg-line-secondary'
          } transition-all duration-300`}
        />
      ))}
    </div>
  );

  const HologramTriangle = () => (
    <div className="absolute -bottom-[10px] left-[40px] z-0">
      <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
        <title>홀로그램 삼각형</title>
        <path
          d="M5.73179 9.67742C6.32777 10.7097 7.8177 10.7097 8.41368 9.67742L14.0009 -8.53738e-07L0.14453 3.57628e-07L5.73179 9.67742Z"
          fill="url(#hologram-gradient)"
        />
        <defs>
          <linearGradient
            id="hologram-gradient"
            x1="0"
            y1="0"
            x2="14"
            y2="11"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#CCE4FF" />
            <stop offset="0.139054" stopColor="#BBBBF1" />
            <stop offset="0.238718" stopColor="#B8E2FB" />
            <stop offset="0.374927" stopColor="#F2EFE8" />
            <stop offset="0.477914" stopColor="#CCE4FF" />
            <stop offset="0.624089" stopColor="#BBBBF1" />
            <stop offset="0.720431" stopColor="#C7EDEB" />
            <stop offset="0.830062" stopColor="#E7F5EB" />
            <stop offset="0.913116" stopColor="#F2F0E7" />
            <stop offset="1" stopColor="#CCE4FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  // 첫 번째 페이지 (여유 시간 확보)
  const FirstPage = () => (
    <div className="relative flex h-full flex-col justify-between">
      {/* 블러 효과 배경 */}
      <div className="bg-blur-purple absolute bottom-[120px] left-0 right-0 z-0 h-[240px] w-[100vw] blur-[75px]" />

      <div
        className="absolute bottom-[170px] left-[40%] z-0 -translate-x-1/2"
        style={{
          width: '376px',
          height: '149px',
          opacity: 0.4,
          background:
            'conic-gradient(from 210deg at 50% 50%, #CCE4FF 0deg, #C1A4E8 50.06deg, #B8E2FB 85.94deg, #F2EFE8 134.97deg, #CCE4FF 172.05deg, #BDAFE3 224.67deg, #C7EDEB 259.36deg, #E7F5EB 298.82deg, #F2F0E7 328.72deg)',
          mixBlendMode: 'color-dodge',
          filter: 'blur(62px)',
        }}
      />

      {/* 타이틀과 설명 */}
      <div className="z-10 mt-[48px] flex flex-col">
        <h1 className="t2 whitespace-pre-line text-gray-strong">
          {onboardingPages[0].title}
        </h1>
        <p className="b2 mt-3 whitespace-pre-line text-gray-neutral">
          {onboardingPages[0].description}
        </p>
      </div>

      {/* 이미지 영역 */}
      <div className="z-10 flex flex-1 flex-col justify-end">
        {/* 메인 콘텐츠 영역 */}
        <div className="relative mb-5 flex justify-center">
          {/* 화면 중앙에 캐릭터 이미지 */}
          <div className="relative">
            <Image
              src={onboardingPages[0].image}
              alt="온보딩 이미지 1"
              width={292}
              height={292}
              priority
              className="relative z-10 h-[36vh] w-auto"
            />

            {/* 불꽃 효과 이미지와 툴팁을 같은 위치에 배치 */}
            <div className="absolute left-0 top-[-60px] flex w-full justify-center">
              {/* 불꽃 이미지 */}
              <Image
                src="/icons/onboarding/firework.svg"
                alt="불꽃"
                width={292}
                height={292}
                priority
                className="relative z-10"
              />

              {/* 툴팁 */}
              <div className="l4 absolute top-[20%] z-20 rounded-[12px] bg-hologram px-4 py-2 text-gray-inverse shadow-lg backdrop-blur-[7px]">
                <p className="flex flex-row items-center whitespace-nowrap">
                  <span>1.5배 더 여유있어졌어!</span>&nbsp;
                  <Image
                    src="/icons/onboarding/clock.svg"
                    alt="시계"
                    width={20}
                    height={20}
                    priority
                  />
                </p>
                <HologramTriangle />
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <Button
          variant="primary"
          className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
          onClick={handleNext}
        >
          {onboardingPages[0].buttonText}
        </Button>
      </div>
    </div>
  );

  // 두 번째 페이지 (1분 안에 작은 행동)
  const SecondPage = () => (
    <div className="relative flex h-full flex-col justify-between">
      <div className="bg-blur-purple absolute bottom-[120px] left-0 right-0 z-0 h-[240px] w-[100vw] blur-[75px]" />
      <div className="z-10 mt-[48px] flex flex-col">
        <h1 className="t2 whitespace-pre-line text-gray-strong">
          {onboardingPages[1].title}
        </h1>
        <p className="b2 mt-3 whitespace-pre-line text-gray-neutral">
          {onboardingPages[1].description}
        </p>
      </div>

      <div className="z-10 flex flex-1 flex-col justify-end">
        <div className="relative mb-[30px] flex justify-center">
          <div className="absolute top-[-130px] z-20 flex w-full items-center justify-center">
            {/* <Image
							src="/icons/onboarding/ox.svg"
							alt="OX 아이콘"
							width={350}
							height={200}
							priority
							className="relative z-10 h-[25vh] w-auto"
						/> */}
          </div>

          <Image
            src={onboardingPages[1].image}
            alt="온보딩 이미지 2"
            width={245}
            height={245}
            priority
            className="relative z-10 h-[36vh] w-auto"
          />
        </div>

        <Button
          variant="primary"
          className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
          onClick={handleNext}
        >
          {onboardingPages[1].buttonText}
        </Button>
      </div>
    </div>
  );

  // 세 번째 페이지 (캐릭터와 플레이리스트)
  const ThirdPage = () => (
    <div className="relative flex h-full flex-col justify-between">
      <div className="bg-blur-purple absolute bottom-[120px] left-0 right-0 z-0 h-[240px] w-[100vw] blur-[75px]" />
      <div className="z-10 mt-[48px] flex flex-col">
        <h1 className="t2 whitespace-pre-line text-gray-strong">
          {onboardingPages[2].title}
        </h1>
        <p className="b2 mt-3 whitespace-pre-line text-gray-neutral">
          {onboardingPages[2].description}
        </p>
      </div>

      <div className="z-10 flex flex-1 flex-col justify-end">
        <div className="relative mb-[20px] flex flex-col items-center justify-center">
          {/* 메인 이미지 */}
          <div className="relative">
            <Image
              src={onboardingPages[2].image}
              alt="온보딩 이미지 3"
              width={230}
              height={292}
              priority
              className="relative z-10 h-[25vh] w-auto"
            />

            {/* 툴팁 추가 */}
            <div className="absolute left-1/2 top-[-60px] z-20 -translate-x-1/2">
              <div
                className="l4 flex items-center justify-center whitespace-nowrap rounded-[24px] px-6 py-3 text-[#BDBDF5] shadow-lg"
                style={{
                  background: 'rgba(107, 107, 225, 0.20)',
                  backdropFilter: 'blur(33.91713333129883px)',
                }}
              >
                <Image
                  src="/icons/onboarding/clap.svg"
                  alt="박수"
                  width={20}
                  height={20}
                  className="mr-1"
                  priority
                />
                <span>과탑 DNA 깨어나는 중! 오늘도 앞서가요!</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <Button
              variant="hologram"
              size="sm"
              className="z-10 mb-6 h-[26px] w-auto rounded-[8px] px-[7px] py-[6px] text-text-inverse"
            >
              <span className="l6 text-text-inverse">
                에너지 만랩 과탑&nbsp;{formatNickname(userNickname)}
              </span>
            </Button>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
          onClick={handleNext}
        >
          {onboardingPages[2].buttonText}
        </Button>
      </div>
    </div>
  );

  // 네 번째 페이지 (알람설정)
  const FourthPage = () => (
    <div className="relative z-10 flex h-full flex-col">
      <div className="bg-blur-purple absolute bottom-[120px] left-0 right-0 z-0 h-[240px] w-[100vw] blur-[75px]" />

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <Image
          src="/icons/onboarding/onboarding4.png"
          alt="온보딩 이미지 4"
          width={375}
          height={180}
          className="mb-[36px]"
          priority
        />

        <h1 className="t1 mb-3 text-center text-gray-strong">
          모든 기능을 제대로 쓰려면,
          <br />
          알림이 꼭 필요해요
        </h1>
        <p className="b2 text-center text-gray-neutral">
          딱 맞는 타이밍에 시작을 끊을 수 있어요!
        </p>
      </div>

      <Button
        variant="primary"
        className="w-full rounded-[16px] bg-component-accent-primary py-4 text-white"
        onClick={handleNext}
      >
        {onboardingPages[3].buttonText}
      </Button>
    </div>
  );

  // 다섯 번째 페이지 (시작하기)
  const FifthPage = () => (
    <div className="relative z-10 flex h-full flex-col">
      <div className="bg-blur-purple absolute bottom-[120px] left-0 right-0 z-0 h-[240px] w-[100vw] blur-[75px]" />

      <div
        className="z-5 absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '376px',
          height: '149px',
          opacity: 0.4,
          background:
            'conic-gradient(from 210deg at 50% 50%, #CCE4FF 0deg, #C1A4E8 50.06deg, #B8E2FB 85.94deg, #F2EFE8 134.97deg, #CCE4FF 172.05deg, #BDAFE3 224.67deg, #C7EDEB 259.36deg, #E7F5EB 298.82deg, #F2F0E7 328.72deg)',
          mixBlendMode: 'color-dodge',
          filter: 'blur(62px)',
        }}
      />

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <Image
          src="/icons/onboarding/onboarding5.svg"
          alt="온보딩 이미지 5"
          width={142}
          height={80}
          className="mb-[40px]"
          priority
        />

        <h1 className="t1 mb-3 text-center text-gray-strong">
          미루지 않는 하루,
          <br />
          지금부터 만들어볼까요?
        </h1>
        <p className="b2 text-center text-gray-neutral">
          지금 당장 시작할 일과, 여유롭게 준비할 일을
          <br />
          구분해 추가해보세요!
        </p>
      </div>

      <Button
        variant="hologram"
        className="w-full rounded-[16px] py-4 text-gray-inverse"
        onClick={handleNext}
      >
        시작하기
      </Button>
    </div>
  );

  // 현재 페이지에 따라 다른 컴포넌트 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <FirstPage />;
      case 1:
        return <SecondPage />;
      case 2:
        return <ThirdPage />;
      case 3:
        return <FourthPage />;
      case 4:
        return <FifthPage />;
      default:
        return <FirstPage />;
    }
  };

  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     try {
  //       console.log('event', event);
  //       const data =
  //         typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

  //       if (data.type === 'GET_DEVICE_TOKEN' && data.payload.fcmToken) {
  //         console.log('웹뷰 환경 토큰 전송');
  //         Cookies.set('deviceId', data.payload.fcmToken, COOKIE_OPTIONS);
  //         Cookies.set('deviceType', data.payload.deviceType, COOKIE_OPTIONS);

  //         // 토큰 전송
  //         postFcmTokenMutation({
  //           fcmRegistrationToken: data.payload.fcmToken,
  //           deviceType: data.payload.deviceType,
  //         });
  //         console.log('토큰 전송 성공');
  //       }
  //     } catch (error) {
  //       console.error('Failed to parse message:', error);
  //     }
  //   };

  //   window.addEventListener('message', handleMessage);
  //   return () => window.removeEventListener('message', handleMessage);
  // }, [postFcmTokenMutation]);

  const handleClickAccess = () => {
    const isWebView = () => {
      return !!(window as any).ReactNativeWebView;
    };
    console.log('handleClickAccess 함수 호출됨');
    console.log('ReactNativeWebView 존재 여부:', isWebView());

    if (isWebView()) {
      // 웹뷰 환경이면 네이티브 쪽에서 디바이스 토큰을 받아오도록 처리
      console.log('웹뷰 환경 감지됨, 토큰 요청 메시지 전송');
      handleGetDeviceToken();
    } else {
      console.log('웹 환경 감지됨, 토큰 요청 불가');
    }
  };

  // 직접 window 이벤트를 테스트하기 위한 함수 추가
  const testMessageEvent = () => {
    console.log('테스트 메시지 생성');
    const testEvent = {
      type: 'GET_DEVICE_TOKEN',
      payload: {
        fcmToken: 'test-token-123',
        deviceType: 'ANDROID',
        message: '테스트 메시지',
      },
    };

    // 이벤트 디스패치
    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify(testEvent),
      }),
    );

    console.log('테스트 메시지 전송 완료');
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 기본 정보 로깅
    console.log('온보딩 페이지 마운트됨');
    console.log(
      'ReactNativeWebView 존재 여부:',
      !!(window as any).ReactNativeWebView,
    );

    // 3페이지에서 자동으로 테스트 메시지 트리거 (개발용)
    if (currentPage === 3) {
      setTimeout(() => {
        console.log('3초 후 테스트 메시지 실행');
        testMessageEvent();
      }, 3000);
    }
  }, [currentPage]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background-primary px-5 pb-[46px] pt-2">
      {/* 프로그레스 바 */}
      <ProgressBar />

      {/* 현재 페이지 컨텐츠 */}
      {renderPage()}
    </div>
  );
}
