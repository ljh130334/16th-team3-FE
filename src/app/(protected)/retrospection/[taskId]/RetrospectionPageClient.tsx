"use client";

import Modal from "@/components/modal/Modal";
import { Button } from "@/components/ui/button";
import { createRetrospect } from "@/services/taskService";
import { TaskResponse } from "@/types/task";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RetrospectCommentContent from "./_components/RetrospectCommentContent";
import RetrospectFocusContent from "./_components/RetrospectFocusContent";
import RetrospectItem from "./_components/RetrospectItem";
import RetrospectLeaveModalContent from "./_components/RetrospectLeaveModalContent";
import RetrospectResultContent from "./_components/RetrospectResultContent";

type Props = {
	task: TaskResponse;
};

export default function RetrospectionPageClient({ task }: Props) {
	const NOT_SELECTED = -1;

	const router = useRouter();
	const [retrospectContent, setRetrospectContent] = useState<RetrospectContent>(
		{
			result: NOT_SELECTED,
			focus: 0,
			comment: "",
		},
	);

	const [openLeaveModal, setOpenLeaveModal] = useState(false);

	const hasSelectedResult = () => {
		return retrospectContent.result !== -1;
	};

	const hasRequiredContent =
		hasSelectedResult() && retrospectContent.focus !== undefined;

	const handleComplete = async () => {
		await createRetrospect(task.id, retrospectContent);
		router.push("/retrospection/complete");
	};

	const retrospectItems: RetrospectItems = {
		result: {
			title: "몰입한 결과에 얼마나 만족하시나요?",
			required: true,
		},
		focus: {
			title: "몰입하는 동안 나의 집중력은?",
			required: true,
		},
		keepAndTry: {
			title: "이번 몰입의 좋았던 점과 개선할 점은?",
			required: false,
		},
	};

	return (
		<div className="flex h-full flex-col bg-background-primary">
			{/* ===================== [START] 상단 헤더 ===================== */}
			<div className="fixed left-0 right-0 top-0 z-10 mt-[44px] mx-5 flex items-center bg-background-primary py-[14.5px]">
				<button
					className="absolute left-0"
					onClick={() => setOpenLeaveModal(true)}
				>
					<Image
						src="/icons/home/arrow-left.svg"
						alt="Back"
						width={18}
						height={16}
					/>
				</button>
				<h1 className="s2 w-full text-center text-lg font-semibold text-text-normal">
					{task.name}
				</h1>
			</div>
			{/* --------------------- [END] 상단 헤더 ---------------------*/}

			{/* ===================== [START] 저장하지 않고 떠나기 모달 ===================== */}
			{openLeaveModal && (
				<Modal isOpen={openLeaveModal} onClose={() => setOpenLeaveModal(false)}>
					<RetrospectLeaveModalContent
						setOpenLeaveModal={setOpenLeaveModal}
						router={router}
					/>
				</Modal>
			)}
			{/* --------------------- [END] 저장하지 않고 떠나기 모달 ---------------------*/}

			{/* ===================== [START] Content ===================== */}
			<div className="mt-[44px] flex-1 overflow-y-auto px-5">
				<div className="flex flex-col">
					{" "}
					{/* 회고 내용 */}
					<div className="flex flex-col gap-3 pt-5 pb-8">
						{" "}
						{/* 상단 텍스트 */}
						<p className="t2 text-strong">이번 몰입은 어떠셨나요?</p>
						<p className="b2 text-neutral">
							몰입했던 순간을 돌아보고 기록해보세요.
						</p>
					</div>
					<div className="flex flex-col gap-3">
						{" "}
						{/* 실제 유저 회고 부분 */}
						{/* 몰입 결과 회고 */}
						<RetrospectItem
							title={retrospectItems.result.title}
							required={retrospectItems.result.required}
						>
							<RetrospectResultContent
								retrospectContent={retrospectContent}
								setRetrospectContent={setRetrospectContent}
							/>
						</RetrospectItem>
						{/* 몰입하는 동안 나의 집중력 */}
						<RetrospectItem
							title={retrospectItems.focus.title}
							required={retrospectItems.focus.required}
						>
							<RetrospectFocusContent
								retrospectContent={retrospectContent}
								setRetrospectContent={setRetrospectContent}
							/>
						</RetrospectItem>
						{/* 몰입 회고 텍스트 */}
						<RetrospectItem
							title={retrospectItems.keepAndTry.title}
							required={retrospectItems.keepAndTry.required}
						>
							<RetrospectCommentContent
								retrospectContent={retrospectContent}
								setRetrospectContent={setRetrospectContent}
							/>
						</RetrospectItem>
					</div>
				</div>
			</div>
			{/* --------------------- [END] Content --------------------- */}

			{/* 하단 버튼 영역 */}
			<div className="relative flex flex-col items-center px-5 py-3 mb-[37px] z-40">
				<Button
					variant="primary"
					className="w-full"
					onClick={handleComplete}
					disabled={!hasRequiredContent}
				>
					완료
				</Button>
			</div>
		</div>
	);
}
