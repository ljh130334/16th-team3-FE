"use client";

import Toast from "@/components/toast/Toast";
import {
	useCreateSubtask,
	useDeleteSubtask,
	useSubtasks,
	useUpdateSubtask,
} from "@/hooks/useSubtasks";
import type { Subtask } from "@/types/subtask";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface DetailGoalsProps {
	taskId: number;
}

const MAX_DETAIL_GOAL_LENGTH = 40;
const LINE_BREAK_AT = 20;
const MAX_DETAIL_GOALS_COUNT = 10;

export default function DetailGoals({ taskId }: DetailGoalsProps) {
	const [isAddingGoal, setIsAddingGoal] = useState(false);
	const [newGoalTitle, setNewGoalTitle] = useState("");
	const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
	const [showLengthWarning, setShowLengthWarning] = useState(false);
	const [editShowLengthWarning, setEditShowLengthWarning] = useState(false);
	const [showMaxCountWarning, setShowMaxCountWarning] = useState(false);
	const [editingText, setEditingText] = useState<string>("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const editInputRef = useRef<HTMLTextAreaElement>(null);
	const [submitting, setSubmitting] = useState(false);

	// API 연동 훅 사용
	const { data: subtasks = [], isLoading } = useSubtasks(taskId);
	const { mutate: createSubtaskMutation } = useCreateSubtask();
	const { mutate: updateSubtaskMutation } = useUpdateSubtask();
	const { mutate: deleteSubtaskMutation } = useDeleteSubtask();

	// 입력 필드 포커스 처리
	useEffect(() => {
		const timer = setTimeout(() => {
			if (isAddingGoal && inputRef.current) {
				inputRef.current.focus();
			} else if (editingGoalId !== null && editInputRef.current) {
				editInputRef.current.focus();
			}
		}, 0);

		return () => clearTimeout(timer);
	}, [isAddingGoal, editingGoalId]);

	// 글자수 경고 메시지 표시 관리
	useEffect(() => {
		setShowLengthWarning(newGoalTitle.length > MAX_DETAIL_GOAL_LENGTH);
	}, [newGoalTitle]);

	// 최대 개수 토스트 자동 닫기
	useEffect(() => {
		if (showMaxCountWarning) {
			const timer = setTimeout(() => {
				setShowMaxCountWarning(false);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [showMaxCountWarning]);

	// 세부 목표 추가 핸들러
	const handleAddGoal = () => {
		if (subtasks.length >= MAX_DETAIL_GOALS_COUNT) {
			setShowMaxCountWarning(true);
			return;
		}

		setIsAddingGoal(true);
	};

	// 새 목표 저장 핸들러
	const handleSaveGoal = () => {
		if (submitting) return; // 중복 제출 방지

		const trimmedTitle = newGoalTitle.trim();
		if (
			trimmedTitle.length >= 1 &&
			trimmedTitle.length <= MAX_DETAIL_GOAL_LENGTH
		) {
			// 저장 전에 입력 상태 초기화 (UX 개선)
			const titleToSave = trimmedTitle;
			setNewGoalTitle("");
			setIsAddingGoal(false);
			setSubmitting(true);

			// 저장 요청 전송
			createSubtaskMutation(
				{
					taskId,
					name: titleToSave,
				},
				{
					onSuccess: () => {
						setSubmitting(false);
					},
					onError: (error) => {
						console.error("Failed to create subtask:", error);
						// 오류 발생 시 다시 입력 상태로 복원
						setNewGoalTitle(titleToSave);
						setIsAddingGoal(true);
						setSubmitting(false);
					},
				},
			);
		}
	};

	// 텍스트 지우기 핸들러
	const handleClearText = () => {
		setNewGoalTitle("");
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	// 완료 상태 토글 핸들러
	const handleToggleComplete = (goalId: number) => {
		const goal = subtasks.find((subtask) => subtask.id === goalId);
		if (goal) {
			updateSubtaskMutation({
				id: goalId,
				taskId,
				isCompleted: !goal.isCompleted,
			});
		}
	};

	const handleUpdateGoalTitle = (goalId: number, newTitle: string) => {
		if (newTitle.length <= MAX_DETAIL_GOAL_LENGTH) {
			setEditingText(newTitle);
			setEditShowLengthWarning(false);
		} else {
			setEditShowLengthWarning(true);
		}
	};

	const handleStartEditing = (goalId: number, originalText: string) => {
		setEditingGoalId(goalId);
		setEditingText(originalText);
	};

	const handleEditTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setEditingText(value);

		// 글자 수 제한 경고 표시
		setEditShowLengthWarning(value.length > MAX_DETAIL_GOAL_LENGTH);

		// 자동 높이 조절
		e.target.style.height = "auto";
		e.target.style.height = `${e.target.scrollHeight}px`;
	};

	const handleFinishEditing = () => {
		if (submitting) return; // 중복 제출 방지

		if (
			editingGoalId !== null &&
			editingText.trim().length >= 1 &&
			editingText.length <= MAX_DETAIL_GOAL_LENGTH
		) {
			const goalId = editingGoalId;
			const newText = editingText.trim();

			// 먼저 UI 상태 업데이트
			setEditingGoalId(null);
			setSubmitting(true);

			// 그 다음 API 요청
			updateSubtaskMutation(
				{
					id: goalId,
					taskId,
					name: newText,
				},
				{
					onSuccess: () => {
						setSubmitting(false);
					},
					onError: () => {
						setSubmitting(false);
					},
				},
			);
		} else {
			// 유효하지 않은 상태이면 편집 모드만 종료
			setEditingGoalId(null);
		}
	};

	// 목표 삭제 핸들러
	const handleDeleteGoal = (goalId: number) => {
		deleteSubtaskMutation({
			id: goalId,
			taskId,
		});
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
		maxLength: number,
		setter: (value: string) => void,
	) => {
		const value = e.target.value;
		setter(value);

		// 자동 높이 조절
		e.target.style.height = "auto";
		e.target.style.height = `${e.target.scrollHeight}px`;
	};

	// 완료되지 않은 목표와 완료된 목표를 분리하여 정렬
	const sortedGoals = [...subtasks].sort((a, b) =>
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
					<input
						type="checkbox"
						checked={checked}
						onChange={onChange}
						className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
						aria-label="세부 목표 완료 체크"
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
				</div>
			) : (
				<>
					<input
						type="checkbox"
						checked={checked}
						onChange={onChange}
						className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
						aria-label="세부 목표 완료 체크"
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

	// 삭제 버튼 공통 스타일
	const deleteButtonStyles =
		"absolute right-0 top-1/2 transform -translate-y-1/2";

	if (isLoading) {
		return (
			<div
				className="w-full p-4"
				style={{
					borderRadius: "var(--16, 16px)",
					background:
						"linear-gradient(180deg, rgba(121, 121, 235, 0.30) 0%, rgba(121, 121, 235, 0.10) 29.17%, rgba(121, 121, 235, 0.00) 100%), var(--Component-Gray-Primary, #17191F)",
				}}
			>
				<div className="py-4 text-center text-gray-disabled">로딩 중...</div>
			</div>
		);
	}

	return (
		<div
			className="w-full p-4"
			style={{
				borderRadius: "var(--16, 16px)",
				background:
					"linear-gradient(180deg, rgba(121, 121, 235, 0.30) 0%, rgba(121, 121, 235, 0.10) 29.17%, rgba(121, 121, 235, 0.00) 100%), var(--Component-Gray-Primary, #17191F)",
			}}
		>
			<div className="flex items-center justify-between mb-4">
				<h2 className="s1 text-gray-strong">세부 목표</h2>
				<button
					onClick={handleAddGoal}
					aria-label="세부 목표 추가"
					className="flex items-center justify-center"
					type="button"
				>
					<Image
						src="/icons/immersion/plus.svg"
						alt="추가"
						width={24}
						height={24}
					/>
				</button>
			</div>
			{subtasks.length === 0 && !isAddingGoal ? (
				<button
					type="button"
					className="py-2 text-start text-gray-disabled cursor-pointer w-full"
					onClick={handleAddGoal}
					aria-label="세부 목표 추가하기"
				>
					<p className="text-b2">세부 목표를 추가하세요</p>
				</button>
			) : (
				<ul className="flex flex-col">
					{sortedGoals.map((goal) => (
						<li key={goal.id} className="flex items-start py-2 relative">
							<div className="mr-3">
								<CheckboxWithGradientBorder
									checked={goal.isCompleted}
									onChange={() => handleToggleComplete(goal.id)}
								/>
							</div>
							{editingGoalId === goal.id ? (
								<div className="relative flex-grow pr-8">
									<textarea
										value={editingText}
										onChange={(e) =>
											handleTextareaInput(
												e,
												MAX_DETAIL_GOAL_LENGTH,
												setEditingText,
											)
										}
										className={`text-b2 break-words w-full border-none bg-transparent p-0 outline-none resize-none overflow-hidden ${
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
										onKeyDown={(e) => {
											if (
												e.key === "Enter" &&
												editingText.trim().length >= 1 &&
												editingText.length <= MAX_DETAIL_GOAL_LENGTH
											) {
												e.preventDefault();
												handleFinishEditing();
											} else if (e.key === "Escape") {
												e.preventDefault();
												setEditingGoalId(null);
											}
										}}
										onBlur={() => {
											if (
												editingText.trim().length >= 1 &&
												editingText.length <= MAX_DETAIL_GOAL_LENGTH
											) {
												handleFinishEditing();
											} else {
												setEditingGoalId(null);
											}
										}}
										rows={1}
										autoComplete="off"
										autoCorrect="off"
										spellCheck="false"
									/>
									{editingText && (
										<button
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
												setEditingText("");
												if (editInputRef.current) {
													editInputRef.current.focus();
												}
											}}
											className={deleteButtonStyles}
											type="button"
											aria-label="텍스트 지우기"
										>
											<Image
												src="/icons/x-circle.svg"
												alt="제거"
												width={24}
												height={24}
											/>
										</button>
									)}
								</div>
							) : (
								<div className="flex items-start w-full">
									<div className="flex-grow overflow-hidden">
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
										>
											{formatGoalText(goal.name)}
										</button>
									</div>
									<button
										onClick={() => handleDeleteGoal(goal.id)}
										className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500"
										type="button"
										aria-label="목표 삭제"
									>
										<Image
											src="/icons/x-circle.svg"
											alt="삭제"
											width={20}
											height={20}
										/>
									</button>
								</div>
							)}
						</li>
					))}
				</ul>
			)}
			{isAddingGoal && (
				<div>
					<div className="flex items-start py-2">
						<div className="mr-3 mt-[1px]">
							<GradientCheckbox />
						</div>
						<div className="relative flex-grow pr-8">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									if (
										newGoalTitle.trim().length >= 1 &&
										newGoalTitle.length <= MAX_DETAIL_GOAL_LENGTH
									) {
										handleSaveGoal();
									}
								}}
							>
								<textarea
									value={newGoalTitle}
									onChange={(e) =>
										handleTextareaInput(
											e,
											MAX_DETAIL_GOAL_LENGTH + 1,
											setNewGoalTitle,
										)
									}
									onKeyDown={(e) => {
										if (
											e.key === "Enter" &&
											!e.shiftKey &&
											newGoalTitle.trim().length >= 1 &&
											newGoalTitle.length <= MAX_DETAIL_GOAL_LENGTH
										) {
											e.preventDefault();
											handleSaveGoal();
										} else if (e.key === "Escape") {
											e.preventDefault();
											setIsAddingGoal(false);
											setNewGoalTitle("");
										}
									}}
									placeholder="세부 목표를 입력하세요"
									className="b2 w-full rounded border-none bg-transparent p-0 text-gray-normal outline-none resize-none overflow-hidden"
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
								/>
								<input type="submit" hidden />
							</form>
							{newGoalTitle && (
								<button
									onClick={(e) => {
										e.preventDefault(); // 이벤트 버블링 방지
										e.stopPropagation(); // 이벤트 버블링 방지
										setNewGoalTitle(""); // 직접 상태 업데이트
										setTimeout(() => inputRef.current?.focus(), 0);
									}}
									className={deleteButtonStyles}
									type="button"
									aria-label="텍스트 지우기"
								>
									<Image
										src="/icons/x-circle.svg"
										alt="제거"
										width={24}
										height={24}
									/>
								</button>
							)}
						</div>
					</div>
				</div>
			)}
			{/* 토스트 경고 메시지 */}
			{showLengthWarning && (
				<Toast message="최대 40자까지만 입력할 수 있어요." />
			)}
			{editShowLengthWarning && (
				<Toast message="최대 40자까지만 입력할 수 있어요." />
			)}
			{showMaxCountWarning && (
				<Toast message="세부 목표는 10개까지만 입력할 수 있어요." />
			)}
		</div>
	);
}
