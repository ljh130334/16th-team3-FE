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

	const handleGetDeviceType = () => {
		try {
			const message = JSON.stringify({ type: "GET_DEVICE_TYPE" });
			window.ReactNativeWebView?.postMessage(message);
		} catch (error) {
			console.error("메시지 전송 에러:", error);
		}
	};

	useEffect(() => {
		console.log("useWebViewMessage useEffect 실행됨");
		const handleMessage = (event: MessageEvent) => {
			try {
				console.log('메시지 이벤트 발생:', event);
				console.log('메시지 데이터 원본:', event.data);
				
				const data =
					typeof event.data === "string" ? JSON.parse(event.data) : event.data;
				
				console.log('파싱된 데이터:', data);
				console.log('메시지 타입:', data.type);
				
				if (data.payload) {
					console.log('페이로드 확인:', data.payload);
				}

				if (data.type === "CAPTURED_IMAGE") {
					localStorage.setItem("capturedImage", data.payload.image);
					console.log("capturedImage", data.payload.image);
					console.log("data", data);
					console.log("이미지 받음");
					router?.push("/action/complete");
				}
				
				if (data.type === 'GET_DEVICE_TOKEN') {
					console.log("GET_DEVICE_TOKEN 타입 메시지 감지됨");
					
					if (data.payload && data.payload.fcmToken) {
						console.log("토큰 존재 확인:", data.payload.fcmToken);
						console.log("디바이스 타입:", data.payload.deviceType);
						
						// 토큰 전송
						postFcmTokenMutation({
							fcmRegistrationToken: data.payload.fcmToken,
							deviceType: data.payload.deviceType,
						});
						console.log('토큰 전송 요청 완료');
					} else {
						console.error('페이로드에 fcmToken이 없음:', data.payload);
					}
				}

				if (data.type === 'GET_DEVICE_TYPE') {
					console.log("GET_DEVICE_TYPE 타입 메시지 감지됨");
					console.log("디바이스 타입:", data.payload.deviceType);
					setDeviceInfo(data.payload.deviceId || "", data.payload.deviceType);
				}
			} catch (error) {
				console.error("메시지 파싱 에러:", error);
			}
		};

		console.log("message 이벤트 리스너 등록됨");
		window.addEventListener("message", handleMessage);
		
		// Android 웹뷰 지원 - 타입 안전하게 핸들러 작성
		const documentMessageHandler = (event: Event) => {
			// 수동으로 MessageEvent로 변환하여 처리
			if (event instanceof Event && 'data' in event) {
				handleMessage(event as unknown as MessageEvent);
			}
		};
		document.addEventListener("message", documentMessageHandler);

		return () => {
			console.log("message 이벤트 리스너 제거됨");
			window.removeEventListener("message", handleMessage);
			document.removeEventListener("message", documentMessageHandler);
		};
	}, [router, postFcmTokenMutation, setDeviceInfo]);

	return { handleTakePicture, handleGetDeviceToken, handleGetDeviceType };
};
