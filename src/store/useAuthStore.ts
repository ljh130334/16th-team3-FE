import { create } from "zustand";

type AuthState = {
	isUserProfileLoaded: boolean; // /v1/members/me API 호출 완료 여부
	isUserProfileLoading: boolean; // /v1/members/me API 호출 중 여부
	setIsUserProfileLoaded: (value: boolean) => void;
	setIsUserProfileLoading: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	isUserProfileLoaded: false,
	isUserProfileLoading: false,

	setIsUserProfileLoaded: (value) => set({ isUserProfileLoaded: value }),
	setIsUserProfileLoading: (value) => set({ isUserProfileLoading: value }),
}));
