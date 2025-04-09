import { postFcmToken } from "@/lib/fcmToken";
import { useUserStore } from "@/store/useUserStore";
import { FcmDeviceType } from "@/types/create";
import { useMutation } from "@tanstack/react-query";
import type { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useWebViewMessage = (router?: ReturnType<typeof useRouter>) => {
	const setDeviceInfo = useUserStore((state) => state.setDeviceInfo);

	  const { mutate: postFcmTokenMutation } = useMutation({
    mutationFn: async (data: FcmDeviceType) => {
      const res = await postFcmToken(data);
      return res;
    },
    onSuccess: () => {
      console.log('FCM 토큰 전송 성공');
    },
    onError: (error) => {
      console.error('FCM 토큰 전송 실패:', error);
    },
  });


	const handleTakePicture = (action: string) => {
		try {
			const message = JSON.stringify({ type: "CAMERA_OPEN", action });
			window.ReactNativeWebView?.postMessage(message);
		} catch (error) {
			console.error("메시지 전송 에러:", error);
		}
	};

	const handleGetDeviceToken = () => {
		try {
			const message = JSON.stringify({ type: "GET_DEVICE_TOKEN" });
			window.ReactNativeWebView?.postMessage(message);
		} catch (error) {
			console.error("메시지 전송 에러:", error);
		}
	};

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			try {
				const data =
					typeof event.data === "string" ? JSON.parse(event.data) : event.data;

				if (data.type === "CAPTURED_IMAGE") {
					localStorage.setItem("capturedImage", data.payload.image);
					console.log("capturedImage", data.payload.image);
					console.log("data", data);
					console.log("이미지 받음");
					router?.push("/action/complete");
				}
				if (data.type === 'GET_DEVICE_TOKEN' && data.payload.fcmToken) {
					console.log("웹뷰 환경 토큰 전송");

					// 토큰 전송
					postFcmTokenMutation({
						fcmRegistrationToken: data.payload.fcmToken,
						deviceType: data.payload.deviceType,
					});
					console.log('토큰 전송 성공');
				}
			} catch (error) {
				console.error("메시지 파싱 에러:", error);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [router, postFcmTokenMutation]);

	return { handleTakePicture, handleGetDeviceToken };
};
