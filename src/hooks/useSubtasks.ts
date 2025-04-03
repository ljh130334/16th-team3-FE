import {
	createSubtask,
	deleteSubtask,
	fetchSubtasks,
	updateSubtaskCompletion,
	updateSubtaskName,
} from "@/services/subtaskService";
import type { Subtask } from "@/types/subtask";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 서브태스크 목록 조회 훅
export const useSubtasks = (taskId: number) => {
	return useQuery<Subtask[]>({
		queryKey: ["subtasks", taskId],
		queryFn: () => fetchSubtasks(taskId),
		// 오류 발생 시 빈 배열로 기본값 처리
		select: (data) => data ?? [],
	});
};

// 서브태스크 생성 훅
export const useCreateSubtask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ taskId, name }: { taskId: number; name: string }) =>
			createSubtask(taskId, name),
		onSuccess: (newSubtask, variables) => {
			// 새로 생성된 항목을 추가하는 방식으로 캐시 업데이트
			queryClient.setQueryData<Subtask[]>(
				["subtasks", variables.taskId],
				(old = []) => {
					return [...old, newSubtask];
				},
			);
		},
	});
};

// 서브태스크 수정 훅
export const useUpdateSubtask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			taskId,
			name,
			isCompleted,
		}: {
			id: number;
			taskId: number;
			name?: string;
			isCompleted?: boolean;
		}) => {
			if (name !== undefined) {
				// 이름 수정 - POST 메서드 사용
				return updateSubtaskName(id, taskId, name);
			}

			if (isCompleted !== undefined) {
				// 완료 상태 수정 - PATCH 메서드 사용
				return updateSubtaskCompletion(id, isCompleted);
			}

			throw new Error("name 또는 isCompleted 중 하나는 제공되어야 합니다");
		},

		// 낙관적 업데이트: UI를 먼저 업데이트하고 나중에 서버 응답이 오면 조정
		onMutate: async (variables) => {
			// 진행 중인 쿼리 취소
			await queryClient.cancelQueries({
				queryKey: ["subtasks", variables.taskId],
			});

			// 기존 데이터 백업
			const previousData =
				queryClient.getQueryData<Subtask[]>(["subtasks", variables.taskId]) ||
				[];

			// 캐시 데이터 직접 업데이트
			queryClient.setQueryData<Subtask[]>(
				["subtasks", variables.taskId],
				(old = []) => {
					// 기존 항목만 업데이트
					return old.map((subtask) => {
						if (subtask.id === variables.id) {
							const updated = {
								...subtask,
								...(variables.name !== undefined
									? { name: variables.name }
									: {}),
								...(variables.isCompleted !== undefined
									? { isCompleted: variables.isCompleted }
									: {}),
							};
							return updated;
						}
						return subtask;
					});
				},
			);

			return { previousData };
		},

		// 오류 발생 시 이전 데이터로 복원
		onError: (error, variables, context) => {
			console.error("[Client] 서브태스크 수정 오류:", error);

			if (context?.previousData) {
				queryClient.setQueryData(
					["subtasks", variables.taskId],
					context.previousData,
				);
			}
		},

		// 서버에서 응답이 오면 캐시 업데이트 (중복 방지)
		onSuccess: (updatedSubtask, variables) => {
			queryClient.setQueryData<Subtask[]>(
				["subtasks", variables.taskId],
				(old = []) => {
					// 중복 방지를 위해 ID 기반으로 업데이트
					const updatedList = old.map((subtask) =>
						subtask.id === updatedSubtask.id ? updatedSubtask : subtask,
					);

					// 캐시에 항목이 없는 경우를 확인
					if (!old.some((item) => item.id === updatedSubtask.id)) {
						console.warn(
							`[Cache] 항목 ${updatedSubtask.id}가 캐시에 없었습니다.`,
						);
						// 항목이 없으면 추가하지 않고 기존 목록 유지
						return updatedList;
					}

					return updatedList;
				},
			);
		},
	});
};

// 서브태스크 삭제 훅
export const useDeleteSubtask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, taskId }: { id: number; taskId: number }) =>
			deleteSubtask(id),
		onSuccess: (_, variables) => {
			// 캐시에서 삭제된 항목 제거
			queryClient.setQueryData<Subtask[]>(
				["subtasks", variables.taskId],
				(old = []) => old.filter((item) => item.id !== variables.id),
			);
		},
	});
};
