'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/component/Badge';
import Header from './_component/Header';
import PhotoCard from './_component/PhotoCard';
import CharacterMotivation from './_component/CharacterMotivation';
import StartButton from './_component/StartButton';

export default function Complete() {
  const [capturedImage, setCapturedImage] = useState<string>('');

  useEffect(() => {
    setCapturedImage(localStorage.getItem('capturedImage') || '');
  }, []);

  return (
    <div className="flex h-screen flex-col gap-4 bg-background-primary">
      <Header />

      <PhotoCard
        capturedImage={capturedImage || ''}
        actionText="책상에서 피그마 프로그램 켜기"
        time="2월 12일 (목) 오후 08:03"
      />

      {/* 인증 사진 사각박스 */}
      <CharacterMotivation />
      <div className="relative">
        <div className="absolute inset-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />

        <div className="relative flex h-[245px] flex-col items-center justify-center gap-[27px]">
          <Image src="/repeat.svg" alt="모래시계" width={48} height={48} />

          <Badge>작은 행동</Badge>
        </div>
      </div>
      <StartButton />
    </div>
  );
}
