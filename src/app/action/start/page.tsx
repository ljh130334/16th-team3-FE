import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function StartPage() {
  return (
    <div className="flex h-screen flex-col gap-4 bg-[#000000] px-5">
      <div className="bg-[linear-gradient(180deg,_#FFFFFF_0%,_#CCE4FF_57%,_#FFFFFF_100%)]">
        <div className="flex flex-col items-center justify-center gap-3 pb-10 pt-5">
          <Image
            src="/icon/hourglass.svg"
            alt="모래시계"
            width={40}
            height={40}
          />
          <p className="text-base text-white">시작하기 좋은 타이밍이에요</p>
          <p className="text-center text-2xl font-semibold text-white">
            작은 행동과 함께
            <br />
            할일을 시작해보세요!
          </p>
        </div>
        <div className="w-full rounded-2xl bg-[#17191F]">
          <div className="flex w-full flex-col gap-[17px] rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
            <div className="relative flex h-[26px] w-[63px] items-center overflow-hidden rounded-[8px] px-[7px] py-[5px] before:absolute before:inset-0 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
              <span className="relative z-10 text-[13px] font-semibold">
                작은 행동
              </span>
            </div>
            <p className="text-lg font-semibold text-white">
              책상에서 피그마 프로그램 켜기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
