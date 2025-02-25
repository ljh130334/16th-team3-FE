'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/component/Badge';

export default function Complete() {
  const router = useRouter();
  const capturedImage = localStorage.getItem('capturedImage');

  return (
    <div className="flex h-screen flex-col gap-4 bg-background-primary">
      <div className="mt-[50px] items-center justify-center text-center text-t2 font-semibold text-white">
        작은 행동 인증 완료!
      </div>
      {/* 인증 사진 사각박스 */}
      <div className="rounded-2xl px-5">
        <div className="flex gap-3 rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
          <div className="flex gap-[14px]">
            <div className="relative h-[48px] w-[48px] overflow-hidden rounded-lg">
              <Image
                src={capturedImage || '/repeat.svg'}
                alt="인증 사진"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-gray-strong">
                책상에서 피그마 프로그램 켜기
              </p>
              <p className="text-b3 text-gray-neutral">
                2월 12일 (목) 오후 08:03
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 인증 사진 사각박스 */}
      <div className="mt-[30px] flex items-center justify-center text-center text-t3 font-semibold text-white">
        잘했어요! 이제
        <br />
        고독한 운동가 이일여님으로
        <br />
        몰입해볼까요?
      </div>
      <div className="relative">
        <div className="absolute inset-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />

        <div className="relative flex h-[245px] flex-col items-center justify-center gap-[27px]">
          <Image src="/repeat.svg" alt="모래시계" width={48} height={48} />

          <Badge>작은 행동</Badge>
        </div>
      </div>
      <div className="relative mt-auto flex flex-col items-center px-5 py-6">
        <div className="fixed bottom-0 left-0 right-0 h-[245px]" />

        <Button variant="primary" className="relative mb-4 w-full">
          몰입 시작하기
        </Button>
        <Button
          variant="primary"
          className="relative mb-4 w-full"
          onClick={() => router.push('/action/start')}
        >
          뒤로가기
        </Button>
      </div>
    </div>
  );
}
