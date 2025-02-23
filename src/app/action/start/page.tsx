import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function StartPage() {
  return (
    <div className="flex h-screen flex-col gap-4 bg-background-primary">
      <div className="mt-[50px] flex flex-col items-center justify-center gap-3 px-5 pb-10 pt-5">
        <Image src="/globe.svg" alt="모래시계" width={40} height={40} />
        <p className="text-base text-white">시작하기 좋은 타이밍이에요</p>
        <p className="text-center text-2xl font-semibold text-white">
          작은 행동과 함께
          <br />
          할일을 시작해보세요!
        </p>
      </div>

      <div className="flex flex-col gap-4 px-5">
        <div className="rounded-2xl bg-[#17191F]">
          <div className="flex flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
            <div className="relative flex h-[26px] w-[63px] items-center justify-center overflow-hidden rounded-[8px] py-[5px] before:absolute before:inset-0 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
              <div className="relative z-10 text-l6 font-semibold text-black">
                작은 행동
              </div>
            </div>
            <p className="text-gray-normal text-lg font-semibold">
              책상에서 피그마 프로그램 켜기
            </p>
          </div>
        </div>
        <div className="w-full rounded-2xl bg-[#17191F]">
          <div className="flex w-full flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
            <div className="relative flex h-[26px] w-[37px] items-center justify-center overflow-hidden rounded-[8px] bg-component-accent-secondary py-[5px]">
              <div className="relative z-10 text-l6 font-semibold text-icon-accent">
                일정
              </div>
            </div>
            <div>
              <div className="flex gap-2.5">
                <div className="text-gray-alternative text-b2">할일</div>
                <div className="text-gray-normal text-s2">
                  디자인 포트폴리오 점검하기
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="text-gray-alternative text-b2">마감일</div>
                <div className="text-gray-neutral text-b2">
                  2월 12일 (목) 오후 08:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-auto flex flex-col items-center px-5 py-6">
        <div className="fixed bottom-0 left-0 right-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />
        <div className="relative mb-[22px] flex h-[45px] items-center justify-center overflow-hidden rounded-[12px] px-10 py-[5px] before:absolute before:inset-0 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
          <div className="relative z-10 text-s3 font-semibold text-black">
            마감까지 04 : 59 : 24 이 남았어요
          </div>
        </div>
        <Button variant="primary" className="relative mb-4 w-full">
          시작하기
        </Button>
        <button className="text-gray-alternative relative mb-[34px]">
          나중에 할래요
        </button>
      </div>
    </div>
  );
}
