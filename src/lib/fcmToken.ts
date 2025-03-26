import { FcmDeviceType } from "@/types/create";

export const postFcmToken = async ({
	fcmRegistrationToken,
	deviceType,
}: FcmDeviceType): Promise<FcmDeviceType> => {
	const response = await fetch(`/api/fcm-devices`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ fcmRegistrationToken, deviceType }),
	});
	if (!response.ok) {
		const errorData = await response.json();
		console.error("API 에러:", errorData);
		throw errorData;
	}
	
	const text = await response.text();
	const result = text ? JSON.parse(text) : {};
    
	return result;
};