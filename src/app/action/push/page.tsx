'use client';

import { useState } from 'react';
import Image from 'next/image';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/component/Badge';

enum PushScreenState {
  INITIAL = 'initial',
  SECOND_CHANCE = 'second',
  FINAL_WARNING = 'final',
}

export default function Push() {
  const [screenState, setScreenState] = useState<PushScreenState>(
    PushScreenState.FINAL_WARNING,
  );

  const screenContent = {
    [PushScreenState.INITIAL]: {
      icon: '/glasshour.svg',
      message: '이제 두 번의 기회만 남았어요!',
      subMessage: '미루기 전에 \n얼른 시작해보세요!',
    },
    [PushScreenState.SECOND_CHANCE]: {
      icon: '/glasshour.svg',
      message: '한 번만 더 알림이 오고 끝이에요!',
      subMessage: '작업을 더 미루기 전에\n얼른 시작해보세요!',
    },
    [PushScreenState.FINAL_WARNING]: {
      icon: '/dynamite.svg',
      message: '이제 마지막 기회에요',
      subMessage: '더 이상 미룰 수 없어요\n당장 시작하세요!',
    },
  };

  const currentContent = screenContent[screenState];

  return (
    <div className="flex h-screen flex-col gap-4 bg-background-primary">
      <div className="mt-[50px] flex flex-col items-center justify-center gap-3 px-5 pb-10 pt-5">
        <Image
          src={currentContent.icon}
          alt="모래시계"
          width={40}
          height={40}
        />
        <p className="whitespace-pre-line text-s2 text-component-accent-primary">
          {currentContent.message}
        </p>
        <p className="whitespace-pre-line text-center text-t2 text-gray-strong">
          {currentContent.subMessage}
        </p>
      </div>

      <div className="flex flex-col gap-4 px-5">
        <div className="rounded-2xl bg-[#17191F]">
          <div className="relative flex flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
            <Badge>작은 행동</Badge>
            <p className="text-lg font-semibold text-gray-normal">
              책상에서 피그마 프로그램 켜기
            </p>
          </div>
        </div>
        <div className="w-full rounded-2xl bg-[#17191F]">
          <div className="flex w-full flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
            <div className="flex h-[26px] w-[37px] items-center justify-center overflow-hidden rounded-[8px] bg-component-accent-secondary py-[5px]">
              <div className="z-10 text-l6 font-semibold text-icon-accent">
                일정
              </div>
            </div>
            <div>
              <div className="flex gap-2.5">
                <div className="text-b2 text-gray-alternative">할일</div>
                <div className="text-s2 text-gray-normal">
                  디자인 포트폴리오 점검하기
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="text-b2 text-gray-alternative">마감일</div>
                <div className="text-b2 text-gray-neutral">
                  2월 12일 (목) 오후 08:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-auto flex flex-col items-center px-5 pt-6">
        <div className="fixed bottom-0 left-0 right-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />
        {screenState === PushScreenState.FINAL_WARNING && (
          <div className="purple-blur-effect absolute inset-0"></div>
        )}
        <div className="relative mb-[22px] flex h-[45px] items-center justify-center overflow-hidden rounded-[12px] px-7 before:absolute before:inset-0 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
          <div className="relative z-10 text-s3 text-gray-inverse">
            마감까지 04 : 59 : 24 이 남았어요
          </div>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant={
                screenState === PushScreenState.FINAL_WARNING
                  ? 'point'
                  : 'primary'
              }
              className={`relative w-full ${
                screenState === PushScreenState.FINAL_WARNING ? 'mb-[34px]' : ''
              }`}
            >
              시작하기
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex flex-col gap-2">
                <p className="text-t3">작은 행동을 사진으로 찍어주세요</p>
                <p className="text-sm text-gray-neutral">
                  <span className="font-semibold text-component-accent-primary">
                    59초
                  </span>
                  내에 사진 촬영을 하지 않으면
                  <br />
                  진동이 계속 울려요
                </p>
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-5">
              <div className="mt-2 flex flex-col gap-3 rounded-2xl bg-[linear-gradient(180deg,_rgba(121,121,235,0.3)_0%,_rgba(121,121,235,0.1)_70%,_rgba(121,121,235,0)_100%)] py-4 pl-4">
                <Badge>작은 행동</Badge>
                <p className="text-lg font-semibold text-gray-normal">
                  책상에서 피그마 프로그램 켜기
                </p>
              </div>
              <Button variant="primary" className="relative mb-4 mt-7 w-full">
                사진찍기
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      {screenState !== PushScreenState.FINAL_WARNING && (
        <button className="relative mb-[34px] text-gray-neutral">
          나중에 할래요
        </button>
      )}
    </div>
  );
}
