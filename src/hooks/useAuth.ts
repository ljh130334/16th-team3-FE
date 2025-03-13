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
  loadUserProfile: () => Promise<void>;
};

const defaultValue: AuthContextType = {
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  loadUserProfile: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const userData = useUserStore((state) => state.userData);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  
  const isAuthenticated = userData && userData.memberId !== -1;

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('v1/members/me').json<User>();
      console.log('사용자 프로필 로드 성공:', response);
      
      setUser(response);
    } catch (error) {
      console.error('사용자 정보 로드 중 오류:', error);
      clearUser();
      // 인증 오류시 로그인 페이지로 리다이렉트
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 로드 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await loadUserProfile();
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        isLoading,
        isAuthenticated,
        logout,
        loadUserProfile
      }
    },
    children
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}