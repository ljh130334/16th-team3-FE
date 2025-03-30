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
			if (initialTask?.dueDatetime) {
				const targetDate = new Date(initialTask.dueDatetime);
				const timeStr = calculateRemainingTime(targetDate);
				const formattedTime = timeStr.replace(" 남음", "");

				setRemainingTime(formattedTime);
			} else {
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

				<div className="w-[24px]" aria-hidden="true" />
			</div>

			{/* 스크롤 영역이 될 중간 부분 */}
			<div className="flex-1 overflow-y-auto">
				<div className="mt-5 flex flex-col items-center justify-center">
					<div className="text-s2">{initialTask.name} 마감까지</div>
					<div
						className={`whitespace-pre-line text-center ${isUrgent(initialTask) ? "text-h2" : "text-h3"} ${!isUrgent(initialTask) ? "bg-hologram bg-clip-text text-transparent" : ""}`}
						style={
							isUrgent(initialTask)
								? {
										background:
											"var(--Error, linear-gradient(180deg, var(--Red-400, #DD6875) 0%, var(--Red-200, #ED98A2) 100%))",
										backgroundClip: "text",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
									}
								: {}
						}
					>
						{remainingTime}
					</div>
				</div>

				<div className="relative mt-4 flex flex-col items-center justify-center gap-4">
					<div
						className="fixed left-0 right-0 top-[280px] h-[200px] z-[1]"
						style={{
							opacity: 0.3,
							background: "rgba(65, 65, 137, 0.40)",
							filter: "blur(75px)",
						}}
					/>

					<div
						className="fixed left-0 right-0 top-[295px] h-[185px] z-[2]"
						style={{
							opacity: 0.4,
							background:
								"conic-gradient(from 210deg at 50% 50%, #CCE4FF 0deg, #C1A4E8 50.05deg, #B8E2FB 85.93deg, #F2EFE8 134.97deg, #CCE4FF 172.04deg, #BDAFE3 224.67deg, #C7EDEB 259.35deg, #E7F5EB 298.82deg, #F2F0E7 328.72deg)",
							mixBlendMode: "color-dodge",
							filter: "blur(62px)",
						}}
					/>

					{isUrgent(initialTask) && (
						<div
							className="fixed left-0 right-0 top-[285px] h-[195px] z-[3]"
							style={{
								opacity: 0.25,
								background: "#DD6875",
								mixBlendMode: "color-dodge",
								filter: "blur(62px)",
							}}
						/>
					)}

					<div className="z-20">
						<div
							className="s3 flex items-center justify-center whitespace-nowrap rounded-[999px] px-[14px] py-[10px] text-[#BDBDF5]"
							style={{
								background:
									"var(--Elevated-PointPriamry, rgba(107, 107, 225, 0.20))",
								backdropFilter: "blur(30px)",
							}}
						>
							<Image
								src="/icons/onboarding/clap.svg"
								alt="박수"
								width={16}
								height={15}
								className="mr-1"
								priority
							/>
							<span>
								{isUrgent(initialTask)
									? "마지막 1시간! 스퍼트 올려서 눈물 닦고 끝까지!"
									: "한 줄만 써봐요! 표지만 완성은 안 돼요!"}
							</span>
						</div>
					</div>

					<div className="relative z-10 flex items-center gap-2">
						<Image
							src="/icons/immersion/study.png"
							alt="페르소나 이미지"
							width={165}
							height={165}
						/>
					</div>
					<Badge>
						{initialTask.persona?.name} {nickname}
					</Badge>
				</div>
			</div>

			{/* 하단 영역 */}
			<div className="relative flex flex-col items-center px-5 py-3 mb-[37px]">
				<Button
					variant="primary"
					className="relative w-full"
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
