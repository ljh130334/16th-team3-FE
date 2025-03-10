'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const kakaoLoginHandler = () => {
    // 카카오 로그인 로직 구현
    router.push('/home-page');
  };

  const appleLoginHandler = () => {
    // 애플 로그인 로직 구현
    router.push('/home-page');
  };

  return (
    <div className="flex h-screen flex-col justify-between bg-background-primary px-5 py-12">
      <div className="mt-20">
        <div className="t2 text-text-strong">
          <p>
            미루는 당신을 위한<br />
            스퍼트에 오신 걸<br />
            환영합니다!
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Button 
          variant="default" 
          className="l2 bg-[#FEE500] text-[#0f1114] rounded-[16px] gap-3"
          onClick={kakaoLoginHandler}
        >
          <Image 
            src="/icons/login/kakao.svg" 
            alt="카카오" 
            width={18} 
            height={17} 
          />
          카카오로 계속하기
        </Button>
        
        <Button 
          variant="default" 
          className="l2 bg-[#e6edf8] text-[#0f1114] rounded-[16px] gap-3"
          onClick={appleLoginHandler}
        >
          <Image 
            src="/icons/login/apple.svg"
            alt="애플" 
            width={15} 
            height={19} 
          />
          Apple로 계속하기
        </Button>
      </div>
    </div>
  );
}