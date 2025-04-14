"use client";

import { useUserStore } from "@/store/useUserStore";
import type { Task } from "@/types/task";
import { calculateRemainingTime } from "@/utils/dateFormat";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import DetailGoals from "@/app/(protected)/immersion/_components/DetailGoals/DetailGoals";
import PersonaMessage from "@/app/(protected)/immersion/_components/PersonaMessage";
import TasksDropdown from "@/app/(protected)/immersion/_components/TasksDropdown/TasksDropdown";
import { Badge } from "@/components/component/Badge";
import Toast from "@/components/toast/Toast";
import { Button } from "@/components/ui/button";
import { useCompleteTask, useInProgressTasks } from "@/hooks/useTasks";
import { getPersonaImage } from "@/utils/getPersonaImage";
import { Playlist } from "../_components/Playlist";

// 페르소나와 dueDatetime이 모두 필수인 Task 타입 정의
interface TaskWithPersona extends Omit<Task, "persona" | "dueDatetime"> {
	persona: NonNullable<Task["persona"]>;
	dueDatetime: string;
	// 예상 소요시간 필드 추가
	estimatedHours: number;
}

interface Props {
	initialTask: TaskWithPersona;
}

export default function ImmersionPageClient({ initialTask }: Props) {
	const router = useRouter();
	const [remainingTime, setRemainingTime] = useState("");
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const [showTimeExpiredSheet, setShowTimeExpiredSheet] = useState(false);
	const [showLengthWarning, setShowLengthWarning] = useState(false);
	const [showMaxCountWarning, setShowMaxCountWarning] = useState(false);
	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
	const originalWindowHeight = useRef(0);

	const personaId = initialTask.persona.id;
	const personaImageSrc = getPersonaImage(personaId);
	const personaTaskType =
		initialTask.persona.taskKeywordsCombination.taskType.name;
	const personaTaskMode =
		initialTask.persona.taskKeywordsCombination.taskMode.name;

	const nickname = useUserStore((state) => state.userData.nickname);
	const { data: inProgressTasks = [] } = useInProgressTasks();

	const { mutate: completeTask } = useCompleteTask();

	// 초기 화면 높이 저장 및 키보드 상태 감지
	useEffect(() => {
		const timer = setTimeout(() => {
			if (typeof window !== "undefined") {
				originalWindowHeight.current = window.innerHeight;
			}
		}, 300);

		// resize 이벤트 핸들러 - 주로 키보드 올라오고 내려갈 때 발생
		const handleResize = () => {
			if (originalWindowHeight.current === 0 || typeof window === "undefined")
				return;

			const currentHeight = window.innerHeight;
			const heightDifference = originalWindowHeight.current - currentHeight;

			// 화면 높이가 원래 높이보다 20% 이상 작아지면 키보드가 열린 것으로 간주
			if (heightDifference > originalWindowHeight.current * 0.2) {
				setIsKeyboardVisible(true);
			} else {
				if (currentHeight >= originalWindowHeight.current * 0.95) {
					setIsKeyboardVisible(false);
				}
			}
		};

		// 입력 요소에 대한 포커스 이벤트
		const handleFocusIn = (e: FocusEvent) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				setIsKeyboardVisible(true);
			}
		};

		// 입력 요소에서 포커스가 빠졌을 때 이벤트
		const handleFocusOut = (e: FocusEvent) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				// 포커스 아웃 직후 바로 상태를 변경하지 않고,
				// resize 이벤트가 발생하길 기다림
				setTimeout(() => {
					if (
						typeof window !== "undefined" &&
						originalWindowHeight.current > 0
					) {
						// 현재 열려있는 input/textarea가 없는지 확인
						const activeElement = document.activeElement;
						const isInputActive =
							activeElement instanceof HTMLInputElement ||
							activeElement instanceof HTMLTextAreaElement;

						// 현재 화면 높이가 원래 높이와 거의 같아졌고,
						// 현재 포커스된 입력 요소가 없으면 키보드가 닫힌 것으로 간주
						if (
							!isInputActive &&
							window.innerHeight >= originalWindowHeight.current * 0.95
						) {
							setIsKeyboardVisible(false);
						}
					}
				}, 300);
			}
		};

		// 이벤트 리스너 등록
		if (typeof window !== "undefined") {
			window.addEventListener("resize", handleResize);
		}

		document.addEventListener("focusin", handleFocusIn);
		document.addEventListener("focusout", handleFocusOut);

		// 클린업 함수
		return () => {
			clearTimeout(timer);
			if (typeof window !== "undefined") {
				window.removeEventListener("resize", handleResize);
			}
			document.removeEventListener("focusin", handleFocusIn);
			document.removeEventListener("focusout", handleFocusOut);
		};
	}, []);

	// 남은 시간을 계산하고 상태 업데이트하는 함수
	useEffect(() => {
		const updateRemainingTime = () => {
			const targetDate = new Date(initialTask.dueDatetime);
			const now = new Date();

			// 마감시간이 지났는지 확인
			if (now > targetDate && !showTimeExpiredSheet) {
				setShowTimeExpiredSheet(true);
			}

			const timeStr = calculateRemainingTime(targetDate);

			// '남음' 문자열 제거
			const timeStrWithoutSuffix = timeStr.replace(/ 남음$/, "");

			setRemainingTime(timeStrWithoutSuffix);
		};

		// 초기 업데이트
		updateRemainingTime();

		// 1초마다 업데이트
		const intervalId = setInterval(updateRemainingTime, 1000);

		// 컴포넌트 언마운트 시 인터벌 정리
		return () => clearInterval(intervalId);
	}, [initialTask.dueDatetime, showTimeExpiredSheet]);

	const handleComplete = () => {
		setShowBottomSheet(true);
	};

	const handleConfirmComplete = () => {
		completeTask(Number(initialTask.id));
		router.push(`/immersion/complete?taskId=${initialTask.id}`);
	};

	const handleReflection = () => {
		router.push(`/retrospection/${initialTask.id}`);
	};

	// 마감 시간 지남 확인
	const isExpired = (task: TaskWithPersona) => {
		const now = new Date();
		const dueDate = new Date(task.dueDatetime);

		return now > dueDate;
	};

	// 긴급 작업 판단 함수
	const isUrgent = (task: TaskWithPersona) => {
		const now = new Date();
		const dueDate = new Date(task.dueDatetime);
		const diffInHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

		// 마감이 1시간 미만으로 남았거나 이미 시간이 다 된 경우에도 긴급으로 처리
		return diffInHours <= 1;
	};

	// DetailGoals에서 경고 토스트를 표시하기 위한 핸들러
	const handleSubtaskError = (type: "length" | "maxCount") => {
		if (type === "length") {
			setShowLengthWarning(true);
			setTimeout(() => setShowLengthWarning(false), 3000);
		} else if (type === "maxCount") {
			setShowMaxCountWarning(true);
			setTimeout(() => setShowMaxCountWarning(false), 3000);
		}
	};

	return (
		<div className="flex h-full flex-col bg-background-primary">
			{/* 상단 헤더 영역 */}
			<div
				className="fixed top-[44px] left-0 w-full z-50 flex items-center justify-between px-5 py-[14px]"
				style={{
					background:
						"linear-gradient(180deg, #0F1114 20%, rgba(15, 17, 20, 0.00) 70%)",
				}}
			>
				{/* 이전 페이지 버튼 */}
				<Link href="/">
					<div className="flex items-center">
						<Image
							src="/icons/common/arrow-left.svg"
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
			<div className="flex-1 overflow-y-auto pt-[65px]">
				<div className="relative z-10">
					<div className="relative">
						<div className="absolute inset-0 -top-5 h-[500px]">
							<Image
								src={
									isUrgent(initialTask)
										? "/icons/immersion/redblur2.png"
										: "/icons/immersion/defaultblur2.png"
								}
								alt={
									isUrgent(initialTask) ? "긴급 배경 효과" : "기본 배경 효과"
								}
								layout="fill"
								objectFit="cover"
							/>
						</div>

						{/* 시간 정보 */}
						<div className="relative z-10 mt-[6px] flex flex-col items-center justify-center">
							<div className="text-s2">{initialTask.title} 마감까지</div>
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

						{/* 캐릭터 및 배지 영역 */}
						<div className="relative mt-4 flex flex-col items-center justify-center gap-4">
							<div className="z-20 flex flex-col items-center gap-4">
								{/* PersonaMessage 컴포넌트로 교체 */}
								<PersonaMessage
									personaId={String(personaId)}
									dueDatetime={initialTask.dueDatetime}
									estimatedHours={initialTask.estimatedHours}
								/>

								<div className="relative z-10">
									{/* 페르소나 이미지에만 floating 클래스 적용 */}
									<div className="floating-persona">
										<Image
											src={personaImageSrc}
											alt="페르소나 이미지"
											width={165}
											height={165}
										/>
									</div>
									<div className="mt-2 flex justify-center">
										<Badge>
											{initialTask.persona.name} {nickname}
										</Badge>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 디테일 목표 영역 */}
					<div className="relative z-30 mx-auto mt-8 w-full max-w-lg px-5">
						<DetailGoals taskId={initialTask.id} onError={handleSubtaskError} />
					</div>

					{/* 플레이리스트 */}
					<div className="px-5 pt-7">
						<Suspense>
							<Playlist
								personaId={personaId}
								personaTaskMode={personaTaskMode}
								personaTaskType={personaTaskType}
							/>
						</Suspense>
					</div>
				</div>
			</div>

			{/* 토스트 메시지 컨테이너 */}
			<div className="relative z-50">
				{showLengthWarning && (
					<div className="fixed bottom-[10px] left-0 w-full px-4">
						<Toast message="최대 40자까지만 입력할 수 있어요." />
					</div>
				)}
				{showMaxCountWarning && (
					<div className="fixed bottom-[10px] left-0 w-full px-4">
						<Toast message="세부 목표는 10개까지만 입력할 수 있어요." />
					</div>
				)}
			</div>

			{!isKeyboardVisible && (
				<div className="relative z-40 mb-[37px] flex flex-col items-center px-5 py-3">
					<Button
						variant={isUrgent(initialTask) ? "hologram" : "primary"}
						className={`relative w-full ${isUrgent(initialTask) ? "l2 h-[56px] rounded-[16px] px-[18.5px] text-center text-gray-inverse" : ""}`}
						onClick={handleComplete}
					>
						다했어요!
					</Button>
				</div>
			)}

			{/* 할일 완료 바텀시트 */}
			{showBottomSheet && (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
					<div className="flex w-full flex-col items-center rounded-t-[28px] bg-component-gray-secondary px-5 pb-[34px] pt-10">
						<h2 className="t3 text-center text-gray-normal">
							{initialTask.title}
						</h2>
						<p className="t3 mb-2 text-center text-gray-normal">
							정말 다 끝내셨나요?
						</p>
						<p className="b3 mb-7 text-center text-text-neutral">
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
							className="b2 w-full pb-2 pt-4 text-text-neutral"
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
					<div className="flex w-full flex-col items-center rounded-t-[28px] bg-component-gray-secondary px-5 pb-[34px] pt-6">
						<h2 className="t3 mt-4 text-center text-gray-normal">
							{initialTask.title}
						</h2>
						<p className="t3 mb-4 text-center text-gray-normal">
							설정했던 마감일이 끝났어요!
						</p>
						<button
							type="button"
							className="l2 my-3 w-full rounded-[16px] bg-component-accent-primary py-4 text-gray-strong"
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

			.floating-persona {
			animation: floating 3s ease-in-out infinite;
			display: flex;
			justify-content: center;
			}
		`}</style>
		</div>
	);
}
