import { User } from '@/types/user';
import { create } from 'zustand';

interface UserState {
  userData: User;
  deviceId: string;
  deviceType: string;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
  setDeviceInfo: (deviceId: string, deviceType: string) => void;
}

export const useUserStore = create<UserState>()((set) => ({
  userData: {
    memberId: -1,
    nickname: '',
    email: '',
    profileImageUrl: '',
    isNewUser: true,
  },
  deviceId: '',
  deviceType: '',

  setUser: (user) =>
    set((state) => ({ userData: { ...state.userData, ...user } })),

  clearUser: () =>
    set({
      userData: {
        memberId: -1,
        nickname: '',
        email: '',
        profileImageUrl: '',
        isNewUser: false,
      },
    }),
  setDeviceInfo: (deviceId: string, deviceType: string) =>
    set((state) => ({
      ...state,
      deviceId,
      deviceType,
    })),
}));
