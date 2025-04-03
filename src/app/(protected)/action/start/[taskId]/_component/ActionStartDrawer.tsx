import { OneButtonDialog } from "@/components/dialog/OneButtonDialog";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ActionCard from "./ActionCard";
import TimerBadge from "./TimerBadge";
interface ActionStartDrawerProps {
	onTakePicture: () => void;
	smallActionTitle?: string;
	dueDate?: string;
	taskId?: string;
}

export default function ActionStartDrawer({
	onTakePicture,
	smallActionTitle,
	dueDate,
	taskId,
}: ActionStartDrawerProps) {
	const router = useRouter();
	const [countdown, setCountdown] = useState(60);
	const [open, setOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	// 타이머 ID를 저장할 ref
	const intervalRef = useRef<number | null>(null);

	// 카운트다운을 시작하는 함수
	const startCountdown = () => {
		// 혹시 기존에 동작 중이던 타이머가 있다면 먼저 해제
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		// 새로운 타이머 생성
		intervalRef.current = window.setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(intervalRef.current!);
					intervalRef.current = null;
					setDialogOpen(true); // 다이얼로그 열기
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	// 컴포넌트가 마운트되면 자동으로 카운트다운 시작
	useEffect(() => {
		startCountdown();
		return () => {
			// 언마운트 시 타이머 해제
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	// "다시 도전하기" 버튼을 누르면
	// 1) 다이얼로그를 닫고
	// 2) countdown을 다시 60으로 설정하고
	// 3) 카운트다운을 재시작
	const handleStartAgainButtonClick = () => {
		setDialogOpen(false);
		setCountdown(60);
		startCountdown();
	};

	return (
		<div className="relative mt-auto flex flex-col items-center px-5 py-6">
			<div className="fixed bottom-0 left-0 right-0 h-[245px] bg-component-gray-secondary blur-[75px]" />
			<TimerBadge dueDate={dueDate ?? ""} />
			<>
				<Drawer open={open} onOpenChange={setOpen} modal={false}>
					<DrawerTrigger asChild>
						<Button
							variant="primary"
							className="relative mb-4 w-full"
							onClick={() => setOpen(true)}
						>
							시작하기
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle className="flex flex-col gap-2">
								<p className="mt-[30px] text-t3">
									작은 행동을 사진으로 찍어주세요
								</p>
								<p className="text-sm text-gray-neutral">
									<span
										className={`mr-1 font-semibold ${
											countdown < 10
												? "text-component-accent-red"
												: "text-component-accent-primary"
										}`}
									>
										{countdown}초
									</span>
									내에 사진 촬영을 하지 않으면
									<br />
									진동이 계속 울려요
								</p>
							</DrawerTitle>
						</DrawerHeader>
						<div className="px-5">
							<ActionCard title={smallActionTitle} variant="gradient2" />
							<Button
								variant="primary"
								className="relative mb-[50px] mt-7 w-full"
								onClick={onTakePicture}
							>
								사진찍기
							</Button>
						</div>
					</DrawerContent>
				</Drawer>
				{/* Drawer가 열릴 때 오버레이 렌더링 */}
				{open && (
					<div
						className="fixed inset-0 z-40 bg-black/80"
						onClick={() => setOpen(false)}
					/>
				)}
			</>
			<Link
				href={`/action/remind/${taskId}`}
				className="relative mb-[30px] text-gray-neutral"
			>
				나중에 할래요
			</Link>
			<OneButtonDialog
				value={dialogOpen}
				title="1분을 초과했어요!"
				content1="여기서 더 미루실 건가요?"
				content2="지금해야 빨리 할일을 시작할 수 있어요!"
				buttonName="다시 도전하기"
				onButtonClick={handleStartAgainButtonClick}
			/>
		</div>
	);
}
