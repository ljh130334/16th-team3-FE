import type { TaskResponse } from "@/types/task";
import { serverApi } from "./serverKy";
import { HTTPError } from "ky";

export const fetchServerTask = async (
	taskId: string,
): Promise<TaskResponse> => {
	const response = await serverApi.get(`v1/tasks/${taskId}`)
		.json()
		.catch((error) => {
			if (error instanceof HTTPError) {
				console.log(error.response);
				error.response.json().then(data => {
					console.log('Error response: ', data);
				});
			} else {
				console.log('Error : ', error.message);
			}
		});
	return response as TaskResponse;
};
