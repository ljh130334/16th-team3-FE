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
import { getPersonaImage } from "@/utils/getPersonaImage";

interface Props {
	initialTask: Task;
}

export default function ImmersionPageClient({ initialTask }: Props) {
	const router = useRouter();
	const [remainingTime, setRemainingTime] = useState("");
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const [showTimeExpiredSheet, setShowTimeExpiredSheet] = useState(false);
	const personaId = initialTask.persona?.id;
	const personaImageSrc = getPersonaImage(personaId);

	const nickname = useUserStore((state) => state.userData.nickname);
	const { data: inProgressTasks = [] } = useInProgressTasks();

	const { mutate: completeTask } = useCompleteTask();

	// 남은 시간을 계산하고 상태 업데이트하는 함수
	useEffect(() => {
		const updateRemainingTime = () => {
			if (initialTask?.dueDatetime) {
				const targetDate = new Date(initialTask.dueDatetime);
				const now = new Date();

				// 마감시간이 지났는지 확인
				if (now > targetDate && !showTimeExpiredSheet) {
					setShowTimeExpiredSheet(true);
				}

				const timeStr = calculateRemainingTime(targetDate);

				// 포맷 변경: n분 n초 남음, n시간 n분 남음, n일 n시간 n분 남음 형식 유지
				setRemainingTime(timeStr);
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
	}, [initialTask?.dueDatetime, showTimeExpiredSheet]);

	const handleComplete = () => {
		setShowBottomSheet(true);
	};

	const handleConfirmComplete = () => {
		completeTask(Number(initialTask.id));
		router.push(`/immersion/complete?taskId=${initialTask.id}`);
	};

	const handleReflection = () => {
		router.push(`/reflection?taskId=${initialTask.id}`);
	};

	// 마감 시간 지남 확인
	const isExpired = (task: Task) => {
		if (!task.dueDatetime) return false;

		const now = new Date();
		const dueDate = new Date(task.dueDatetime);

		return now > dueDate;
	};

	// 긴급 작업 판단 함수
	const isUrgent = (task: Task) => {
		if (!task.dueDatetime) return false;

		const now = new Date();
		const dueDate = new Date(task.dueDatetime);
		const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		// 마감이 1시간 미만으로 남았거나 이미 시간이 다 된 경우에도 긴급으로 처리
		return diffInHours <= 1;
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
				{isUrgent(initialTask) ? (
					<div className="fixed left-0 right-0 top-[160px] h-[400px] z-[1]">
						<Image
							src="/icons/immersion/redblur.png"
							alt="긴급 배경 효과"
							layout="fill"
							objectFit="cover"
						/>
					</div>
				) : (
					<div className="fixed left-0 right-0 top-[160px] h-[400px] z-[1]">
						<Image
							src="/icons/immersion/defaultblur.png"
							alt="기본 배경 효과"
							layout="fill"
							objectFit="cover"
						/>
					</div>
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
								src={personaImageSrc}
								alt="페르소나 이미지"
								width={165}
								height={165}
								className="floating-character"
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

			{/* 할일 완료 바텀시트 */}
			{showBottomSheet && (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
					<div className="flex w-full flex-col items-center rounded-t-[28px] bg-component-gray-secondary px-5 pt-10 pb-[34px]">
						<h2 className="t3 text-center text-gray-normal">
							{initialTask.name}
						</h2>
						<p className="t3 mb-2 text-center text-gray-normal">
							정말 다 끝내셨나요?
						</p>
						<p className="b3 text-text-neutral mb-7 text-center">
							마감까지 {remainingTime}
						</p>
						<button
							type="button"
							className="l2 w-full rounded-[16px] bg-component-accent-primary py-4 text-gray-strong"
							onClick={handleConfirmComplete}
						>
							할일 끝내기
						</button>

						<button
							type="button"
							className="b2 w-full pt-4 pb-2 text-text-neutral"
							onClick={() => setShowBottomSheet(false)}
						>
							몰입으로 돌아가기
						</button>
					</div>
				</div>
			)}

			{/* 시간 만료 바텀시트 */}
			{showTimeExpiredSheet && (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
					<div className="flex w-full flex-col items-center rounded-t-[28px] bg-component-gray-secondary px-5 pt-6 pb-[34px]">
						<h2 className="t3 mt-4 text-center text-gray-normal">
							{initialTask.name}
						</h2>
						<p className="t3 mb-4 text-center text-gray-normal">
							설정했던 마감일이 끝났어요!
						</p>
						<button
							type="button"
							className="l2 w-full rounded-[16px] bg-component-accent-primary py-4 my-3 text-gray-strong"
							onClick={handleReflection}
						>
							회고하기
						</button>
					</div>
				</div>
			)}

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

				@keyframes floating {
					0% {
						transform: translateY(8px);
					}
					50% {
						transform: translateY(-8px);
					}
					100% {
						transform: translateY(8px);
					}
					}

					.floating-character {
					animation: floating 3s ease-in-out infinite;
					}
			`}</style>
		</div>
	);
}
