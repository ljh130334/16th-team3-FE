"use client";

import { useUserStore } from "@/store/useUserStore";
import type { Task } from "@/types/task";
import { calculateRemainingTime } from "@/utils/dateFormat";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";

import { Badge } from "@/components/component/Badge";
import { Button } from "@/components/ui/button";
import { useCompleteTask, useInProgressTasks } from "@/hooks/useTasks";

interface Props {
	initialTask: Task;
}

export default function ImmersionPageClient({ initialTask }: Props) {
	const router = useRouter();
	const [remainingTime, setRemainingTime] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const nickname = useUserStore((state) => state.userData.nickname);
	const { data: inProgressTasks = [] } = useInProgressTasks();

	const { mutate: completeTask } = useCompleteTask();

	// 남은 시간을 계산하고 상태 업데이트하는 함수
	useEffect(() => {
		const updateRemainingTime = () => {
			// dueDatetime 사용 (dueDate 대신)
			if (initialTask?.dueDatetime) {
				const targetDate = new Date(initialTask.dueDatetime);

				// 원래 계산된 시간 문자열을 가져옴
				const timeStr = calculateRemainingTime(targetDate);

				const formattedTime = timeStr.replace(" 남음", "");

				setRemainingTime(formattedTime);
			} else {
				// dueDatetime이 없는 경우 대체 메시지 표시
				setRemainingTime("시간 정보 없음");
			}
		};

		// 초기 업데이트
		updateRemainingTime();

		// 1초마다 업데이트
		const intervalId = setInterval(updateRemainingTime, 1000);

		// 컴포넌트 언마운트 시 인터벌 정리
		return () => clearInterval(intervalId);
	}, [initialTask?.dueDatetime]);

	const handleComplete = () => {
		completeTask(Number(initialTask.id));
		router.push("/immersion/complete");
	};

	// 텍스트 길이 제한 함수
	const truncateText = (text: string | undefined, maxLength = 9) => {
		if (!text) return "";
		return text.length > maxLength
			? `${text.substring(0, maxLength)}...`
			: text;
	};

	// 남은 시간 포맷팅 함수
	const formatTime = (task: Task) => {
		if (!task.dueDatetime) return "";

		const targetDate = new Date(task.dueDatetime);
		const timeStr = calculateRemainingTime(targetDate);

		let formattedTime = timeStr.replace(" 남음", "");

		if (isUrgent(task) && formattedTime.startsWith("00:")) {
			formattedTime = formattedTime.substring(3);
		}

		return formattedTime;
	};

	// 긴급 작업 판단 함수
	const isUrgent = (task: Task) => {
		if (!task.dueDatetime) return false;

		const now = new Date();
		const dueDate = new Date(task.dueDatetime);
		const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		// 마감이 1시간 미만으로 남은 경우 긴급으로 처리
		return diffInHours < 1 && diffInHours > 0;
	};

	// 전체 작업 중 긴급 작업이 있는지 확인하는 함수
	const hasUrgentTask = () => {
		return inProgressTasks.some((task) => isUrgent(task));
	};

	// 작업 클릭 핸들러
	const handleTaskClick = (taskId: number) => {
		router.push(`/immersion/${taskId}`);
		setIsDropdownOpen(false);
	};

	// 키보드 이벤트 핸들러
	const handleKeyDown = (
		e: KeyboardEvent<HTMLButtonElement>,
		callback: () => void,
	) => {
		if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
			e.preventDefault();
			callback();
		}
	};

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	// 화면 클릭 시 드롭다운 닫기
	useEffect(() => {
		if (!isDropdownOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			const dropdownContainer = document.getElementById("dropdown-container");
			if (dropdownContainer && !dropdownContainer.contains(e.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isDropdownOpen]);

	return (
		<div className="flex h-full flex-col bg-background-primary">
			{/* 상단 헤더 영역 */}
			<div className="flex items-center justify-between px-5 py-[14px]">
				{/* 이전 페이지 버튼 */}
				<Link href="/">
					<div className="flex items-center">
						<Image
							src="/arrow-left.svg"
							alt="왼쪽 화살표"
							width={24}
							height={24}
						/>
					</div>
				</Link>

				{/* 드롭다운 컨테이너 */}
				<div id="dropdown-container" className="relative">
					{/* 드롭다운 버튼 */}
					<div
						className={`bg-component-gray-tertiary rounded-t-[8px] ${!isDropdownOpen ? "rounded-b-[8px]" : "rounded-t-[8px]"} overflow-hidden`}
						style={{
							width: isDropdownOpen ? "243px" : "175px",
							transition: "width 0.3s ease-out",
						}}
					>
						<button
							className="flex w-full items-center justify-center px-[14px] py-[8px] cursor-pointer"
							onClick={toggleDropdown}
							onKeyDown={(e) => handleKeyDown(e, toggleDropdown)}
							aria-expanded={isDropdownOpen}
							aria-haspopup="menu"
							type="button"
							name="진행 중인 일 화살표"
							role="button"
						>
							<span className="text-center">
								<span className="l4 text-gray-strong">진행 중인 일</span>{" "}
								<span
									className={`l5 ${hasUrgentTask() ? "c1 text-component-accent-red" : "text-gray-neutral"}`}
								>
									총 {inProgressTasks.length}개
								</span>
							</span>
							{hasUrgentTask() && (
								<Image
									src="/icons/immersion/emergency.svg"
									alt="긴급"
									width={16}
									height={16}
									className="ml-1"
								/>
							)}
							<Image
								src={
									isDropdownOpen
										? "/icons/immersion/chevron-up.svg"
										: "/icons/immersion/chevron-down.svg"
								}
								alt="화살표"
								width={10}
								height={6}
								className="ml-2"
							/>
						</button>
					</div>

					{/* 드롭다운 리스트 */}
					{isDropdownOpen && (
						<div
							className="absolute bg-component-gray-tertiary rounded-b-[8px] overflow-hidden z-10"
							style={{
								width: "243px",
								left: "50%",
								transform: "translateX(-50%)",
								animation:
									"expandListWidth 0.3s ease-out forwards, expandDown 0.2s ease-out forwards",
							}}
						>
							<div className="max-h-[300px] overflow-y-auto">
								{inProgressTasks.map((task, index) => (
									<button
										key={task.id}
										className={`flex w-full items-center justify-between px-5 py-3 text-left ${
											task.id === initialTask.id
												? "bg-component-gray-secondary"
												: "hover:bg-component-gray-tertiary"
										} ${index !== inProgressTasks.length - 1 ? "" : ""}`}
										onClick={() => handleTaskClick(task.id)}
										onKeyDown={(e) =>
											handleKeyDown(e, () => handleTaskClick(task.id))
										}
										role="menuitem"
										type="button"
									>
										<span
											className={`${
												task.id === initialTask.id
													? "s3 text-gray-normal"
													: "b3 text-gray-normal"
											}`}
										>
											{truncateText(task.title)}
										</span>
										<div
											className={`flex items-center px-[9.5px] py-[3px] rounded-[8px] ml-2 ${
												isUrgent(task)
													? "c2 text-gray-strong"
													: "c2 bg-component-gray-primary text-gray-neutral"
											}`}
											style={
												isUrgent(task)
													? {
															background:
																"linear-gradient(180deg, #DD6875 0%, #ED98A2 100%)",
														}
													: {}
											}
										>
											{isUrgent(task) && (
												<Image
													src="/icons/immersion/emergency.svg"
													alt="긴급"
													width={11}
													height={11}
													className="mr-1"
												/>
											)}
											{formatTime(task)}
										</div>
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* 우측 여백 유지를 위한 빈 공간 */}
				<div className="w-[24px]" aria-hidden="true" />
			</div>

			<div className="mt-[120px] flex flex-col items-center justify-center">
				<div className="text-s2">{initialTask.title} 마감까지</div>
				<div className="whitespace-pre-line bg-hologram bg-clip-text text-center text-h2 text-transparent">
					{remainingTime}
				</div>
			</div>

			<div className="relative mt-5 flex flex-col items-center justify-center gap-4">
				<div className="fixed left-0 right-0 top-[290px] h-[190px] bg-[rgba(65,65,137,0.40)] blur-[75px]" />

				<div className="relative z-10 flex items-center gap-2">
					<Image
						src="/icons/immersion/study.png"
						alt="경고 아이콘"
						width={140}
						height={140}
					/>
				</div>
				<Badge>
					{initialTask.persona?.name} {nickname}
				</Badge>
			</div>

			<div className="relative mt-auto flex flex-col items-center px-5 py-6">
				<Button
					variant="primary"
					className="relative mb-4 w-full"
					onClick={handleComplete}
				>
					다했어요!
				</Button>
			</div>

			{/* CSS Animations */}
			<style jsx global>{`
				@keyframes expandDown {
					from {
						opacity: 0;
						max-height: 0;
					}
					to {
						opacity: 1;
						max-height: 300px;
					}
				}

				@keyframes expandListWidth {
					from {
						width: 172px;
					}
					to {
						width: 243px;
					}
				}
			`}</style>
		</div>
	);
}
