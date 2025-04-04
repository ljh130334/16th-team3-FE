import { useUserStore } from "@/store/useUserStore";
import Cookies from "js-cookie";
import type { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useWebViewMessage = (router?: ReturnType<typeof useRouter>) => {
	const setDeviceInfo = useUserStore((state) => state.setDeviceInfo);

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
				// if (data.type === "GET_DEVICE_TOKEN") {
				// 	alert(
				// 		`rn으로부터 수신한 메세지: ${data.payload.message}${data.payload.fcmToken}`,
				// 	);
				// 	localStorage.setItem("deviceToken", data.payload.fcmToken);
				// 	console.log("data.payload.message", data.payload.message);
				// 	console.log("data.payload.fcmToken", data.payload.fcmToken);

				// 	if (data.payload.fcmToken) {
				// 		Cookies.set("deviceId", data.payload.fcmToken, {
				// 			expires: 30, // 30일
				// 			path: "/",
				// 			secure: false,
				// 		});

				// 		Cookies.set("deviceType", data.payload.deviceType, {
				// 			expires: 30,
				// 			path: "/",
				// 			secure: false,
				// 		});
				// 	}
				// }
			} catch (error) {
				console.error("메시지 파싱 에러:", error);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [router]);

	return { handleTakePicture, handleGetDeviceToken };
};
