'use client';

import { useTaskProgressStore } from '@/store/useTaskStore';
import { formatKoreanDateTime } from '@/utils/dateFormat';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

import { Badge } from '@/components/component/Badge';
import CharacterMotivation from './_component/CharacterMotivation';
import Header from './_component/Header';
import PhotoCard from './_component/PhotoCard';
import StartButton from './_component/StartButton';
import { getPersonaImage } from '@/utils/getPersonaImage';
import { api } from '@/lib/ky';
import { User } from '@/types/user';

export default function Complete() {
  const userData = useUserStore((state) => state.userData);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const currentTask = useTaskProgressStore((state) => state.currentTask);
  const personaImageSrc = getPersonaImage(currentTask?.persona.id);
  const setUser = useUserStore((state) => state.setUser);

  const loadUserProfile = useCallback(async () => {
    const response = await api.get('v1/members/me').json<User>();
    setUser(response);
  }, [setUser]);

  useEffect(() => {
    setCapturedImage(localStorage.getItem('capturedImage') || '');
    console.log('capturedImage', capturedImage);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await loadUserProfile();
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
      }
    };
    checkAuth();
  }, [loadUserProfile]);

  return (
    <div className="flex h-full w-full flex-col gap-4 bg-background-primary">
      <Header />

      <PhotoCard
        capturedImage={capturedImage || ''}
        actionText={currentTask?.triggerAction || ''}
        time={formatKoreanDateTime(currentTask?.dueDatetime || '')}
      />

      {/* 인증 사진 사각박스 */}
      {currentTask && <CharacterMotivation currentTask={currentTask} />}
      <div className="relative">
        <div className="absolute inset-0 h-[245px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />

        <div className="relative flex h-[245px] flex-col items-center justify-center gap-[27px]">
          <Image
            src={personaImageSrc}
            alt="페르소나 이미지"
            width={165}
            height={165}
          />

          <div className="relative flex h-[26px] items-center justify-center overflow-hidden rounded-[8px] px-[7px] py-[6px] text-black before:absolute before:inset-0 before:-z-10 before:bg-[conic-gradient(from_220deg_at_50%_50%,_#F2F0E7_0%,_#BBBBF1_14%,_#B8E2FB_24%,_#F2EFE8_37%,_#CCE4FF_48%,_#BBBBF1_62%,_#C7EDEB_72%,_#E7F5EB_83%,_#F2F0E7_91%,_#F2F0E7_100%)] before:[transform:scale(4,1)]">
            <span className="l6 text-inverse">
              {`${currentTask?.persona.name} ${userData.nickname}`}
            </span>
          </div>
        </div>
      </div>
      <StartButton currentTaskId={currentTask?.id?.toString() ?? ''} />
    </div>
  );
}
