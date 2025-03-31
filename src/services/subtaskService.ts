import type { Subtask } from "@/types/subtask";

// 기본 fetch 래퍼 함수
const fetchWithError = async <T>(
	url: string,
	options?: RequestInit,
): Promise<T> => {
	const response = await fetch(url, options);

	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		throw new Error(
			errorData?.error ||
				`API 요청 실패 (${response.status}): ${response.statusText}`,
		);
	}

	return response.json();
};

// 서브태스크 목록 조회
export const fetchSubtasks = async (taskId: number): Promise<Subtask[]> => {
	try {
		const data = await fetchWithError<Subtask[]>(
			`/api/tasks/${taskId}/subtasks`,
		);
		return data;
	} catch (error) {
		return [];
	}
};

// 서브태스크 생성
export const createSubtask = async (
	taskId: number,
	name: string,
): Promise<Subtask> => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			taskId,
			name,
		}),
	};

	return fetchWithError<Subtask>("/api/v1/subtasks", options);
};

// 서브태스크 수정
export const updateSubtask = async (
	id: number,
	data: { name?: string; isCompleted?: boolean },
): Promise<Subtask> => {
	const options = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};

	return fetchWithError<Subtask>(`/api/v1/subtasks/${id}`, options);
};

// 서브태스크 삭제
export const deleteSubtask = async (id: number): Promise<void> => {
	const options = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	};

	await fetchWithError(`/api/v1/subtasks/${id}`, options);
};
