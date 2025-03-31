"use client";

import { useUserStore } from "@/store/useUserStore";
import type { Task } from "@/types/task";
import { calculateRemainingTime } from "@/utils/dateFormat";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DetailGoals from "@/app/(protected)/immersion/_components/DetailGoals/DetailGoals";
import TasksDropdown from "@/app/(protected)/immersion/_components/TasksDropdown/TasksDropdown";
import { Badge } from "@/components/component/Badge";
import { Button } from "@/components/ui/button";
import { useCompleteTask, useInProgressTasks } from "@/hooks/useTasks";

interface Props {
	initialTask: Task;
}

export default function ImmersionPageClient({ initialTask }: Props) {
	const router = useRouter();
	const [remainingTime, setRemainingTime] = useState("");

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

	// 긴급 작업 판단 함수
	const isUrgent = (task: Task) => {
		if (!task.dueDatetime) return false;

		const now = new Date();
		const dueDate = new Date(task.dueDatetime);
		const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		// 마감이 1시간 미만으로 남은 경우 긴급으로 처리
		return diffInHours < 1 && diffInHours > 0;
	};

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

				{/* 드롭다운 컴포넌트 */}
				<TasksDropdown
					inProgressTasks={inProgressTasks}
					currentTaskId={initialTask.id}
				/>

				<div className="w-[24px]" aria-hidden="true" />
			</div>

			{/* 스크롤 영역이 될 중간 부분 */}
			<div className="flex-1 overflow-y-auto">
				{/* 배경 블러 효과들 */}
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

				<div className="relative z-10">
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

					<div className="px-5 mt-8 w-full max-w-lg mx-auto relative z-30">
						<DetailGoals taskId={initialTask.id} />
					</div>
				</div>
			</div>

			{/* 하단 영역 */}
			<div className="relative flex flex-col items-center px-5 py-3 mb-[37px] z-40">
				<Button
					variant={isUrgent(initialTask) ? "hologram" : "primary"}
					className={`relative w-full ${isUrgent(initialTask) ? "l2 h-[56px] rounded-[16px] px-[18.5px] text-center text-gray-inverse" : ""}`}
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
