"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/useUserStore";

export default function MyPage() {
  const router = useRouter();
  const { logout, isLoading } = useAuth();
  // 선택자 패턴을 사용하여 최신 상태를 가져옵니다
  const userData = useUserStore((state) => state.userData);
  const [appVersion] = useState("V.0.0.1");
  const [imageError, setImageError] = useState(false);
  const [componentMounted, setComponentMounted] = useState(false);

  // 컴포넌트 마운트 시 상태 확인
  useEffect(() => {
    setComponentMounted(true);
    console.log('마이페이지 컴포넌트 마운트됨, userData:', userData);
  }, []);

  // userData가 변경될 때 콘솔에 출력
  useEffect(() => {
    if (componentMounted) {
      console.log('userData 변경됨:', userData);
    }
  }, [userData, componentMounted]);
  
  const handleGoBack = () => {
    router.push("/home-page");
  };

  const handleImageError = () => {
    console.log("이미지 로드 실패");
    setImageError(true);
  };

  const renderProfileImage = () => {
    if (imageError || !userData?.profileImageUrl) {
      return (
        <Image
          src="/icons/mypage/default-profile.png"
          alt="기본 프로필"
          width={72}
          height={72}
          className="rounded-full"
          onError={() => console.error("기본 이미지도 로드 실패")}
        />
      );
    }

    return (
      <Image
        src={userData.profileImageUrl}
        alt="프로필 이미지"
        width={72}
        height={72}
        className="rounded-full"
        onError={handleImageError}
        priority
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 부분 */}
      <div className="px-5 py-[14px] relative flex items-center">
        <button onClick={handleGoBack} className="absolute left-5">
          <Image
            src="/icons/ArrowLeft.svg"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </button>
        <div className="s2 w-full text-center text-gray-normal">마이페이지</div>
      </div>

      {/* 프로필 정보 */}
      {isLoading || !componentMounted ? (
        <div className="flex flex-col items-center justify-center mt-[23px] mb-8">
          <div className="mb-[14px] w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center mt-[23px] mb-8">
            <div className="mb-[14px]">{renderProfileImage()}</div>
            <div className="t3 text-gray-normal">{userData?.nickname || "사용자"}</div>
          </div>
          <div className="flex flex-col items-start justify-start px-5 py-4">
            <div className="b2 text-gray-normal">로그인 정보 : {userData?.email || ""}</div>
          </div>
        </>
      )}

      {/* 나머지 코드는 동일 */}
      <div className="h-[8px] bg-component-gray-primary"></div>

      <div className="px-5">
        <div className="l5 text-gray-alternative pt-6 pb-4">서비스 관리</div>

        <div className="flex justify-between items-center py-4">
          <div className="text-base b2 text-gray-normal">앱 버전</div>
          <div className="l5 text-gray-neutral">{appVersion} 최신 버전</div>
        </div>

        <Link
          href="/personal-info"
          className="flex justify-between items-center py-4"
        >
          <div className="text-base">개인정보 처리 방침</div>
          <Image
            src="/icons/mypage/external-link.svg"
            alt="외부 링크"
            width={20}
            height={20}
          />
        </Link>

        <Link href="/terms" className="flex justify-between items-center py-4">
          <div className="text-base">이용약관</div>
          <Image
            src="/icons/mypage/external-link.svg"
            alt="외부 링크"
            width={20}
            height={20}
          />
        </Link>

        <Link
          href="/open-source"
          className="flex justify-between items-center py-4"
        >
          <div className="text-base">오픈소스 라이센스</div>
          <Image
            src="/icons/mypage/external-link.svg"
            alt="외부 링크"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <div className="h-[8px] bg-component-gray-primary"></div>

      {/* 로그아웃 */}
      <div className="px-5">
        <button
          onClick={logout}
          className="b2 text-gray-normal w-full text-left pt-6 pb-4 text-base"
        >
          로그아웃
        </button>
      </div>

      {/* 탈퇴하기 */}
      <div className="px-5">
        <button className="b2 text-gray-normal w-full text-left pt-6 pb-4 text-base">
          탈퇴하기
        </button>
      </div>

      {/* 하단 여백 */}
      <div className="h-12"></div>
    </div>
  );
}