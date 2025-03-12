"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("대상싹쓰리");
  const [userEmail, setUserEmail] = useState("tkdsdfhks@naver.com");
  const [profileImage, setProfileImage] = useState("");
  const [appVersion, setAppVersion] = useState("V.0.0.1");

  useEffect(() => {
    const fetchUserInfo = async () => {
      setUserName("대상싹쓰리");
      setUserEmail("tkdsdfhks@naver.com");
      setProfileImage("");
    };

    fetchUserInfo();
  }, []);

  const handleGoBack = () => {
    router.push("/home-page");
  };

  const getProfileImage = () => {
    if (profileImage) {
      return (
        <Image
          src={profileImage}
          alt="프로필 이미지"
          width={72}
          height={72}
          className="rounded-full"
        />
      );
    } else {
      return (
        <div className="w-20 h-20 rounded-fullflex items-center justify-center">
          <Image
            src="/icons/mypage/default-profile.png"
            alt="기본 프로필"
            width={72}
            height={72}
            className="rounded-full"
          />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-5 py-[14px] flex items-center justify-center">
        <button onClick={handleGoBack} className="mr-4">
          <Image
            src="/icons/ArrowLeft.svg"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </button>
        <div className="s2 flex-1 text-center text-gray-normal">마이페이지</div>
      </div>

      <div className="flex flex-col items-center justify-center mt-[23px] mb-8">
        <div className="mb-[14px]">
          {getProfileImage()}
        </div>
        <div className="t3 text-gray-normal">{userName}</div>
      </div>
      <div className="flex flex-col items-start justify-start px-5 py-4">
        <div className="b2 text-gray-normal">로그인 정보 : {userEmail}</div>
      </div>
      <div className="h-[8px] bg-component-gray-primary"></div>

      <div className="px-5">
        <div className="l5 text-gray-alternative pt-6 pb-4">서비스 관리</div>
        
        <div className="flex justify-between items-center py-4">
          <div className="text-base b2 text-gray-normal">앱 버전</div>
          <div className="l5 text-gray-neutral">{appVersion} 최신 버전</div>
        </div>
        
        <Link href="/personal-info" className="flex justify-between items-center py-4">
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
        
        <Link href="/open-source" className="flex justify-between items-center py-4">
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
        <button className="b2 text-gray-normal w-full text-left pt-6 pb-4 text-base">로그아웃</button>
      </div>

      {/* 탈퇴하기 */}
      <div className="px-5">
        <button className="b2 text-gray-normal w-full text-left pt-6 pb-4 text-base">탈퇴하기</button>
      </div>

      {/* 하단 여백 */}
      <div className="h-12"></div>
    </div>
  );
}