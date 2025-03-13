"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/useUserStore";
import ProfileImage from "@/components/ProfileImage";
import { api } from '@/lib/ky';

export default function MyPage() {
  const router = useRouter();
  const { logout, isLoading, loadUserProfile } = useAuth();
  const userData = useUserStore((state) => state.userData);
  const clearUser = useUserStore((state) => state.clearUser);
  const [appVersion] = useState("V.0.0.1");
  const [pageLoading, setPageLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      // 사용자 데이터가 없으면 로드 시도
      if (userData.memberId === -1) {
        try {
          await loadUserProfile();
        } catch (error) {
          console.error("사용자 정보 로드 실패:", error);
        }
      }
      
      setPageLoading(false);
    };
    
    initPage();
  }, []);
  
  const handleGoBack = () => {
    router.push("/home-page");
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      console.log('로그아웃 함수 호출 시작');
      await logout();
      console.log('로그아웃 함수 호출 완료');
      setShowLogoutModal(false);
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      setShowLogoutModal(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const confirmWithdraw = async () => {
    try {
      console.log('회원 탈퇴 함수 호출 시작');
      // 회원 탈퇴 API 호출
      const response = await api.post('v1/auth/withdraw');
      console.log('회원 탈퇴 성공');
      
      // 쿠키 삭제
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; httpOnly; secure; sameSite=none;";
      
      // 사용자 정보 초기화
      clearUser();
      console.log('회원 탈퇴 함수 호출 완료');
      
      setShowWithdrawModal(false);
      // 로그인 페이지로 리다이렉트
      router.push('/login');
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      
      // API 실패해도 로그아웃 처리는 진행
      clearUser();
      setShowWithdrawModal(false);
      router.push('/login');
    }
  };

  const cancelWithdraw = () => {
    setShowWithdrawModal(false);
  };

  const showLoading = pageLoading;

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
      {showLoading ? (
        <div className="flex flex-col items-center justify-center mt-[23px] mb-8">
          <div className="mb-[14px] w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center mt-[23px] mb-8">
            <div className="mb-[14px]">
              <ProfileImage 
                imageUrl={userData?.profileImageUrl} 
                width={72} 
                height={72}
              />
            </div>
            <div className="t3 text-gray-normal">{userData?.nickname || "사용자"}</div>
          </div>
          <div className="flex flex-col items-start justify-start px-5 py-4">
            <div className="b2 text-gray-normal">로그인 정보 : {userData?.email || ""}</div>
          </div>
        </>
      )}

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
          onClick={handleLogout}
          className="b2 text-gray-normal w-full text-left pt-6 pb-4 text-base"
        >
          로그아웃
        </button>
      </div>

      {/* 탈퇴하기 */}
      <div className="px-5">
        <button 
          onClick={handleWithdraw}
          className="b2 text-gray-normal w-full text-left pt-6 pb-4 text-base"
        >
          탈퇴하기
        </button>
      </div>
      
      <div className="h-12"></div>

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-component-gray-secondary rounded-[24px] w-[90%] max-w-md overflow-hidden">
            <div className="pt-6 p-4 text-center">
              <h3 className="t3 text-gray-normal">로그아웃</h3>
              <p className="b3 text-gray-neutral mb-5">정말 로그아웃 하시겠어요?</p>
              
              <div className="flex space-x-4">
                <button
                  onClick={cancelLogout}
                  className="l1 flex-1 p-[13.5px] bg-component-gray-tertiary text-gray-neutral rounded-[12px]"
                >
                  닫기
                </button>
                <button
                  onClick={confirmLogout}
                  className="l1 flex-1 p-[13.5px] bg-component-accent-primary text-gray-strong rounded-[12px]"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 탈퇴하기 확인 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-component-gray-secondary rounded-[24px] w-[90%] max-w-md overflow-hidden">
            <div className="pt-6 p-4 text-center">
              <h3 className="t3 text-gray-normal">탈퇴하기</h3>
              <p className="b3 text-gray-neutral mb-5">정말 탈퇴 하시겠어요?</p>
              
              <div className="flex space-x-4">
                <button
                  onClick={cancelWithdraw}
                  className="l1 flex-1 p-[13.5px] bg-component-gray-tertiary text-gray-neutral rounded-[12px]"
                >
                  닫기
                </button>
                <button
                  onClick={confirmWithdraw}
                  className="l1 flex-1 p-[13.5px] bg-component-accent-primary text-gray-strong rounded-[12px]"
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}