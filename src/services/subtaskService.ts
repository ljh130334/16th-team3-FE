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
		return await fetchWithError<Subtask[]>(`/api/tasks/${taskId}/subtasks`);
	} catch (error) {
		console.error("서브태스크 조회 오류:", error);
		return [];
	}
};

// 서브태스크 생성
export const createSubtask = async (
	taskId: number,
	name: string,
): Promise<Subtask> => {
	const requestBody = {
		taskId,
		name,
	};

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestBody),
	};

	try {
		const result = await fetchWithError<Subtask>("/api/subtasks", options);
		return result;
	} catch (error) {
		console.error("[API] 서브태스크 생성 오류:", error);
		throw error;
	}
};

// 서브태스크 이름 수정
export const updateSubtaskName = async (
	id: number,
	taskId: number, // taskId 매개변수 추가
	name: string,
): Promise<Subtask> => {
	const requestBody = {
		id,
		taskId,
		name,
	};

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestBody),
	};

	try {
		const result = await fetchWithError<Subtask>("/api/subtasks", options);
		return result;
	} catch (error) {
		console.error("[API] 서브태스크 이름 수정 오류:", error);

		if (error instanceof Error) {
			console.error(`[API] 오류 메시지: ${error.message}`);
			console.error(`[API] 오류 스택: ${error.stack}`);
		}

		throw error;
	}
};

// 서브태스크 완료상태 업데이트 (PATCH 사용)
export const updateSubtaskCompletion = async (
	id: number,
	isCompleted: boolean,
): Promise<Subtask> => {
	const requestBody = {
		isCompleted,
	};

	const options = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestBody),
	};

	try {
		const result = await fetchWithError<Subtask>(
			`/api/subtasks/${id}`,
			options,
		);
		return result;
	} catch (error) {
		console.error("[API] 서브태스크 완료상태 업데이트 오류:", error);
		throw error;
	}
};

// 서브태스크 삭제
export const deleteSubtask = async (id: number): Promise<void> => {
	const options = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	};

	try {
		await fetchWithError(`/api/subtasks/${id}`, options);
	} catch (error) {
		console.error("[API] 서브태스크 삭제 오류:", error);
		throw error;
	}
};
