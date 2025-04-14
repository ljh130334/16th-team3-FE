"use client";

import {
	useCreateSubtask,
	useDeleteSubtask,
	useSubtasks,
	useUpdateSubtask,
} from "@/hooks/useSubtasks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface DetailGoalsProps {
	taskId: number;
	onError?: (type: "length" | "maxCount") => void;
}

const MAX_DETAIL_GOAL_LENGTH = 40;
const LINE_BREAK_AT = 20;
const MAX_DETAIL_GOALS_COUNT = 10;

export default function DetailGoals({ taskId, onError }: DetailGoalsProps) {
	const [isAddingGoal, setIsAddingGoal] = useState(false);
	const [newGoalTitle, setNewGoalTitle] = useState("");
	const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
	const [editingText, setEditingText] = useState<string>("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const editInputRef = useRef<HTMLTextAreaElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// API 연동 훅 사용
	const { data: subtasks = [], isLoading } = useSubtasks(taskId);
	const { mutate: createSubtaskMutation } = useCreateSubtask();
	const { mutate: updateSubtaskMutation } = useUpdateSubtask();
	const { mutate: deleteSubtaskMutation } = useDeleteSubtask();

	// 로컬 상태로 서브태스크 관리 (삭제 즉시 UI 반영)
	const [localSubtasks, setLocalSubtasks] = useState<typeof subtasks>([]);

	// subtasks가 업데이트되면 localSubtasks도 업데이트
	useEffect(() => {
		setLocalSubtasks(subtasks);
	}, [subtasks]);

	// 입력 필드 포커스 처리
	useEffect(() => {
		if (isAddingGoal && inputRef.current) {
			const timer = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}, 50);

			return () => clearTimeout(timer);
		}

		if (editingGoalId !== null && editInputRef.current) {
			const timer = setTimeout(() => {
				if (editInputRef.current) {
					editInputRef.current.focus();
				}
			}, 50);

			return () => clearTimeout(timer);
		}
	}, [isAddingGoal, editingGoalId]);

	// 글자수 경고 메시지 관리
	useEffect(() => {
		if (
			newGoalTitle.length > MAX_DETAIL_GOAL_LENGTH ||
			editingText.length > MAX_DETAIL_GOAL_LENGTH
		) {
			if (onError) {
				onError("length");
			}
		}
	}, [newGoalTitle, editingText, onError]);

	// 세부 목표 추가 핸들러
	const handleAddGoal = () => {
		if (subtasks.length >= MAX_DETAIL_GOALS_COUNT) {
			if (onError) {
				onError("maxCount");
			}
			return;
		}

		setIsAddingGoal(true);

		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}, 50);
	};

	// 새 목표 저장 핸들러
	const handleSaveGoal = () => {
		const trimmedTitle = newGoalTitle.trim();
		if (
			trimmedTitle.length >= 1 &&
			trimmedTitle.length <= MAX_DETAIL_GOAL_LENGTH &&
			!isSubmitting
		) {
			setIsSubmitting(true);

			createSubtaskMutation(
				{ taskId, name: trimmedTitle },
				{
					onSuccess: () => {
						setNewGoalTitle("");
						setIsAddingGoal(false);
						setIsSubmitting(false);
					},
					onError: () => {
						setIsSubmitting(false);
					},
				},
			);
		}
	};

	// 완료 상태 토글 핸들러
	const handleToggleComplete = (goalId: number) => {
		if (isSubmitting) return;

		const goal = subtasks.find((subtask) => subtask.id === goalId);
		if (goal) {
			setIsSubmitting(true);

			updateSubtaskMutation(
				{
					id: goalId,
					taskId,
					isCompleted: !goal.isCompleted,
				},
				{
					onSuccess: () => {
						setIsSubmitting(false);
					},
					onError: () => {
						setIsSubmitting(false);
					},
				},
			);
		}
	};

	// 편집 시작 핸들러
	const handleStartEditing = (goalId: number, originalText: string) => {
		if (isSubmitting) return;

		setEditingGoalId(goalId);
		setEditingText(originalText);
		setTimeout(() => {
			if (editInputRef.current) {
				editInputRef.current.focus();
				editInputRef.current.click();
			}
		}, 100);
	};

	// 편집 완료 핸들러
	const handleFinishEditing = () => {
		if (
			editingGoalId !== null &&
			editingText.trim().length >= 1 &&
			editingText.length <= MAX_DETAIL_GOAL_LENGTH &&
			!isSubmitting
		) {
			setIsSubmitting(true);

			updateSubtaskMutation(
				{
					id: editingGoalId,
					taskId,
					name: editingText,
				},
				{
					onSuccess: () => {
						setEditingGoalId(null);
						setIsSubmitting(false);
					},
					onError: () => {
						setIsSubmitting(false);
					},
				},
			);
		}
	};

	// 세부 목표 삭제 핸들러
	const handleDeleteSubtask = (goalId: number) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		// 편집 중이었다면 편집 모드 종료
		if (editingGoalId === goalId) {
			setEditingGoalId(null);
		}

		// UI에서 즉시 항목 제거 (낙관적 업데이트)
		setLocalSubtasks((prev) => prev.filter((goal) => goal.id !== goalId));

		deleteSubtaskMutation(
			{ id: goalId },
			{
				onSuccess: () => {
					setIsSubmitting(false);
				},
				onError: () => {
					setIsSubmitting(false);
					// 삭제 실패 시 다시 서버에서 데이터 가져오기
					// useSubtasks 훅 내부에 refetch 함수가 있다면 호출
					// 여기서는 API 호출이 실패해도 다음 데이터 새로고침에서 자동으로 동기화될 것임
				},
			},
		);
	};

	// 텍스트에 20자 이후 줄바꿈 적용하는 함수
	const formatGoalText = (text: string) => {
		if (text.length <= LINE_BREAK_AT) return text;

		const firstLine = text.slice(0, LINE_BREAK_AT);
		const secondLine = text.slice(LINE_BREAK_AT);

		return (
			<>
				<div className="w-full">{firstLine}</div>
				<div className="w-full">{secondLine}</div>
			</>
		);
	};

	// 텍스트 입력 시 자동 높이 조절 및 줄바꿈 처리
	const handleTextareaInput = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
		setter: (value: string) => void,
	) => {
		const value = e.target.value;

		// 최대 글자 수 제한
		if (value.length <= MAX_DETAIL_GOAL_LENGTH) {
			setter(value);

			// 자동 높이 조절
			e.target.style.height = "auto";
			e.target.style.height = `${e.target.scrollHeight}px`;
		} else {
			// 최대 글자 수 초과 시 이전 값 유지
			setter(value.slice(0, MAX_DETAIL_GOAL_LENGTH));

			// 경고 표시
			if (onError) {
				onError("length");
			}
		}
	};

	// 완료되지 않은 목표와 완료된 목표를 분리하여 정렬
	const sortedGoals = [...localSubtasks].sort((a, b) =>
		a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1,
	);

	// 체크박스 컴포넌트들
	const GradientCheckbox = () => (
		<div className="w-5 h-5 relative flex-shrink-0">
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<title>빈 체크박스</title>
				<rect
					x="0.5"
					y="0.5"
					width="19"
					height="19"
					rx="3.5"
					stroke="url(#paint0_linear_4484_9114)"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_4484_9114"
						x1="19.2739"
						y1="20.1709"
						x2="0.285921"
						y2="20.6621"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#DDD9F8" />
						<stop offset="0.273644" stopColor="#E4E4FF" />
						<stop offset="0.610199" stopColor="#CCE4FF" />
					</linearGradient>
				</defs>
			</svg>
		</div>
	);

	const CheckboxWithGradientBorder = ({
		checked,
		onChange,
	}: { checked?: boolean; onChange?: () => void }) => (
		<div className="w-5 h-5 relative flex-shrink-0">
			{checked ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<label className="w-5 h-5 relative flex-shrink-0 cursor-pointer">
						<input
							type="checkbox"
							checked={checked}
							onChange={onChange}
							className="absolute inset-0 w-full h-full opacity-0 z-10"
							aria-label="세부 목표 완료 체크"
							disabled={isSubmitting}
						/>

						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<title>완료된 체크박스</title>
							<rect
								width="20"
								height="20"
								rx="4"
								fill="url(#paint0_linear_completed)"
								style={{ opacity: 0.6 }}
							/>
							<path
								d="M6 10L9 13L14 7"
								stroke="#1F2127"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<defs>
								<linearGradient
									id="paint0_linear_completed"
									x1="19.2739"
									y1="20.1709"
									x2="0.285921"
									y2="20.6621"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#DDD9F8" />
									<stop offset="0.273644" stopColor="#E4E4FF" />
									<stop offset="0.610199" stopColor="#CCE4FF" />
								</linearGradient>
							</defs>
						</svg>
					</label>
				</div>
			) : (
				<>
					<input
						type="checkbox"
						checked={checked}
						onChange={onChange}
						className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
						aria-label="세부 목표 완료 체크"
						disabled={isSubmitting}
					/>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<title>체크되지 않은 체크박스</title>
						<rect
							x="0.5"
							y="0.5"
							width="19"
							height="19"
							rx="3.5"
							stroke="url(#paint0_linear_4484_9114)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_4484_9114"
								x1="19.2739"
								y1="20.1709"
								x2="0.285921"
								y2="20.6621"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#DDD9F8" />
								<stop offset="0.273644" stopColor="#E4E4FF" />
								<stop offset="0.610199" stopColor="#CCE4FF" />
							</linearGradient>
						</defs>
					</svg>
				</>
			)}
		</div>
	);

	const backgroundStyle = {
		borderRadius: "var(--16, 16px)",
		background:
			"linear-gradient(180deg, rgba(121, 121, 235, 0.30) 0%, rgba(121, 121, 235, 0.10) 29.17%, rgba(121, 121, 235, 0.00) 100%), var(--Component-Gray-Primary, #17191F)",
	};

	if (isLoading) {
		return (
			<div className="w-full p-4" style={backgroundStyle}>
				<div className="py-4 text-center text-gray-disabled">로딩 중...</div>
			</div>
		);
	}

	return (
		<div className="w-full p-4" style={backgroundStyle}>
			<div className="flex items-center justify-between mb-4">
				<h2 className="s1 text-gray-strong">세부 목표</h2>
				<button
					onClick={handleAddGoal}
					aria-label="세부 목표 추가"
					className="flex items-center justify-center"
					type="button"
					disabled={isSubmitting}
				>
					<Image
						src="/icons/immersion/plus.svg"
						alt="추가"
						width={24}
						height={24}
					/>
				</button>
			</div>

			{localSubtasks.length === 0 && !isAddingGoal ? (
				<button
					type="button"
					className="py-2 text-start text-gray-disabled cursor-pointer w-full"
					onClick={handleAddGoal}
					aria-label="세부 목표 추가하기"
					disabled={isSubmitting}
				>
					<p className="text-b2">세부 목표를 추가하세요</p>
				</button>
			) : (
				<ul className="flex flex-col">
					{sortedGoals.map((goal) => (
						<li key={goal.id} className="flex items-center py-2">
							<div className="mr-3">
								<CheckboxWithGradientBorder
									checked={goal.isCompleted}
									onChange={() => handleToggleComplete(goal.id)}
								/>
							</div>
							{editingGoalId === goal.id ? (
								<div className="relative flex-grow">
									<div className="relative w-full flex items-center min-w-0">
										<textarea
											value={editingText}
											onChange={(e) => handleTextareaInput(e, setEditingText)}
											className={`text-b2 flex-grow min-w-0 break-words border-none bg-transparent p-0 outline-none resize-none overflow-hidden ${
												goal.isCompleted
													? "text-gray-neutral"
													: "text-gray-normal"
											}`}
											style={{
												wordBreak: "break-word",
												display: "block",
												caretColor: "#5D6470",
												height: "auto",
												minHeight: "1.5rem",
											}}
											enterKeyHint="done"
											ref={editInputRef}
											aria-label="세부 목표 수정"
											rows={1}
											disabled={isSubmitting}
										/>
										{editingText && (
											<div className="flex-shrink-0 flex items-center pr-4">
												<button
													onClick={handleFinishEditing}
													disabled={
														editingText.trim().length === 0 ||
														editingText.length > MAX_DETAIL_GOAL_LENGTH ||
														isSubmitting
													}
													className="text-s2 text-[#8484E6] mr-4"
													type="button"
													aria-label="세부 목표 수정 완료"
												>
													완료
												</button>
												<button
													onMouseDown={(e) => {
														e.preventDefault();
														e.stopPropagation();
														handleDeleteSubtask(goal.id);
													}}
													className="flex-shrink-0"
													type="button"
													aria-label="세부 목표 삭제"
													disabled={isSubmitting}
												>
													<Image
														src="/icons/x-circle.svg"
														alt="삭제"
														width={24}
														height={24}
													/>
												</button>
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="relative flex-grow">
									<button
										type="button"
										className={`text-b2 break-words cursor-text text-left w-full ${goal.isCompleted ? "text-gray-neutral" : "text-gray-normal"}`}
										style={{
											wordBreak: "break-word",
											display: "block",
											background: "transparent",
											border: "none",
											padding: 0,
											margin: 0,
										}}
										onClick={() => handleStartEditing(goal.id, goal.name)}
										aria-label={`${goal.name} 편집하기`}
										disabled={isSubmitting}
									>
										{formatGoalText(goal.name)}
									</button>
								</div>
							)}
						</li>
					))}
				</ul>
			)}

			{isAddingGoal && (
				<div className="flex items-start py-2">
					<div className="mr-3 mt-[1px] items-center">
						<GradientCheckbox />
					</div>
					<div className="relative flex-grow">
						<div className="relative w-full flex items-center min-w-0">
							<textarea
								value={newGoalTitle}
								onChange={(e) => handleTextareaInput(e, setNewGoalTitle)}
								placeholder="세부 목표를 적어주세요"
								className="b2 flex-grow min-w-0 rounded border-none bg-transparent p-0 text-gray-normal outline-none resize-none overflow-hidden"
								style={{
									caretColor: "#5D6470",
									height: "auto",
									minHeight: "1.5rem",
								}}
								ref={inputRef}
								enterKeyHint="done"
								aria-label="세부 목표 입력"
								rows={1}
								autoComplete="off"
								autoCorrect="off"
								spellCheck="false"
								disabled={isSubmitting}
							/>
							{newGoalTitle && (
								<div className="flex-shrink-0 flex items-center pr-4">
									<button
										onClick={handleSaveGoal}
										disabled={
											newGoalTitle.trim().length === 0 ||
											newGoalTitle.length > MAX_DETAIL_GOAL_LENGTH ||
											isSubmitting
										}
										className="text-s2 text-[#8484E6] mr-4"
										type="button"
										aria-label="세부 목표 생성"
									>
										완료
									</button>
									<button
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setNewGoalTitle("");
											setIsAddingGoal(false);
										}}
										className="flex-shrink-0"
										type="button"
										aria-label="추가 취소"
										disabled={isSubmitting}
									>
										<Image
											src="/icons/immersion/delete.svg"
											alt="취소"
											width={24}
											height={24}
										/>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
