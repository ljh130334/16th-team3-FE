import {
	createSubtask,
	deleteSubtask,
	fetchSubtasks,
	updateSubtask,
} from "@/services/subtaskService";
import type { Subtask } from "@/types/subtask";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

	return useMutation({
		mutationFn: ({ taskId, name }: { taskId: number; name: string }) =>
			createSubtask(taskId, name),
		onSuccess: (data, variables) => {
			queryClient.setQueryData(
				["subtasks", variables.taskId],
				(oldData: Subtask[] | undefined) => [...(oldData || []), data],
			);

			queryClient.invalidateQueries({
				queryKey: ["subtasks", variables.taskId] as const,
				refetchActive: true,
			});
		},
		onError: (error) => {
			// 오류 핸들링
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
