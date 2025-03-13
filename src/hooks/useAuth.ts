'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/ky';
import { User } from '@/types/user';
import { useUserStore } from '@/store/useUserStore';

// 인증 컨텍스트 타입 정의
type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

// 기본값 생성
const defaultValue: AuthContextType = {
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
};

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType>(defaultValue);

// 인증 제공자 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // useUserStore에서 사용자 정보 가져오기
  const { userData, clearUser } = useUserStore();
  const isAuthenticated = userData && userData.memberId !== -1;

  // 초기 로딩 상태 설정
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // 로그아웃 함수
  const logout = async () => {
    try {
      await api.post('v1/auth/logout');
      
      // 쿠키 삭제
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; httpOnly; secure; sameSite=none;";
      
      // 사용자 정보 초기화
      clearUser();
      
      // 로그인 페이지로 리다이렉트
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  // createElement를 사용하여 JSX 없이 구현
  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        isLoading,
        isAuthenticated,
        logout
      }
    },
    children
  );
}

// 인증 훅
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}