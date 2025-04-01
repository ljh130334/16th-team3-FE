import {
	createSubtask,
	deleteSubtask,
	fetchSubtasks,
	updateSubtask,
} from "@/services/subtaskService";
import type { Subtask } from "@/types/subtask";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

// 서브태스크 목록 조회 훅
export const useSubtasks = (taskId: number) => {
	return useQuery({
		queryKey: ["subtasks", taskId] as const,
		queryFn: () => fetchSubtasks(taskId),
		enabled: !!taskId,
		staleTime: 0,
	});
};

// 서브태스크 생성 훅
export const useCreateSubtask = () => {
	const queryClient = useQueryClient();
	const pendingRequestRef = useRef<Set<string>>(new Set());

	return useMutation({
		mutationFn: ({ taskId, name }: { taskId: number; name: string }) => {
			const requestKey = `${taskId}-${name}`;
			if (pendingRequestRef.current.has(requestKey)) {
				return Promise.resolve({ id: 0, taskId, name, isCompleted: false });
			}

			pendingRequestRef.current.add(requestKey);

			return createSubtask(taskId, name).finally(() => {
				pendingRequestRef.current.delete(requestKey);
			});
		},

		// 요청 성공 시 캐시 업데이트
		onSuccess: (data, variables) => {
			if (data.id === 0) return;

			// 캐시 무효화 방식으로 변경
			queryClient.invalidateQueries({
				queryKey: ["subtasks", variables.taskId] as const,
			});
		},

		onError: (error) => {
			console.error("서브태스크 생성 오류:", error);
		},
	});
};

// 서브태스크 수정 훅
export const useUpdateSubtask = () => {
	const queryClient = useQueryClient();

	return useMutation<
		Subtask,
		Error,
		{ id: number; taskId: number; name?: string; isCompleted?: boolean }
	>({
		mutationFn: ({ id, name, isCompleted }) =>
			updateSubtask(id, { name, isCompleted }),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["subtasks", variables.taskId] as const,
			});
		},
		onError: (error) => {
			// 오류 핸들링
		},
	});
};

// 서브태스크 삭제 훅
export const useDeleteSubtask = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, { id: number; taskId: number }>({
		mutationFn: ({ id }) => deleteSubtask(id),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["subtasks", variables.taskId] as const,
			});
		},
		onError: (error) => {
			// 오류 핸들링
		},
	});
};
