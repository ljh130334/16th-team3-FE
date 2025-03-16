'use client';

import React, {
  useEffect,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/ky';
import { User } from '@/types/user';
import { useUserStore } from '@/store/useUserStore';
import Cookies from 'js-cookie';

type AuthContextType = {
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  withdraw: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
};

const defaultValue: AuthContextType = {
  isAuthenticated: false,
  logout: async () => {},
  withdraw: async () => {},
  loadUserProfile: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userData = useUserStore((state) => state.userData);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const token = Cookies.get('accessToken');

  const isAuthenticated = userData && userData.memberId !== -1;

  const loadUserProfile = useCallback(async () => {
    try {
      if (token) {
        const response = await api.get('v1/members/me').json<User>();
        setUser(response);
      }
    } catch (error) {
      clearUser();
    }
  }, [token, clearUser, setUser]);

  // 쿠키 및 사용자 정보 초기화 함수
  const clearAuthData = () => {
    // 쿠키 삭제
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; httpOnly; secure; sameSite=none;';

    clearUser();
  };

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await loadUserProfile();
      } catch (error) {
        console.error('인증 확인 중 오류:', error);
      } finally {
      }
    };

    checkAuth();
  }, [loadUserProfile]);

  const logout = async () => {
    try {
      // 로그아웃 API 호출
      const response = await api.post('v1/auth/logout');

      clearAuthData();

      // 로그인 페이지로 리다이렉트
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);

      // API 실패해도 로컬 로그아웃 처리
      clearAuthData();
      router.push('/login');
    }
  };

  const withdraw = async () => {
    try {
      // 회원 탈퇴 API 호출
      const response = await api.post('v1/auth/withdraw');

      clearAuthData();

      // 로그인 페이지로 리다이렉트
      router.push('/login');
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);

      // API 실패해도 로컬 로그아웃
      clearAuthData();
      router.push('/login');
    }
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        isAuthenticated,
        logout,
        withdraw,
        loadUserProfile,
      },
    },
    children,
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
