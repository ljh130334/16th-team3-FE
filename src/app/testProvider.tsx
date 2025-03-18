'use client';

import { useEffect } from 'react';

import { api } from '@/lib/ky';
import { useUserStore } from '@/store';
import { User } from '@/types/user';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get('v1/members/me');
        if (!res.ok) {
          setUser({});
          return;
        }
        const data = await res.json<User>();
        setUser(data);
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        setUser({});
      }
    }

    fetchUser();
  }, [setUser]);

  return <>{children}</>;
}
