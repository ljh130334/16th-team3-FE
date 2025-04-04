import { Button } from "@/components/ui/button";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";

type Props = {
	setOpenLeaveModal: (open: boolean) => void;
	router: AppRouterInstance;
};

const RetrospectLeaveModalContent = ({ setOpenLeaveModal, router }: Props) => {
	return (
		<div className="flex flex-col gap-5">
			{/* 상단 텍스트 */}
			<div className="flex flex-col gap-1 text-center">
				<p className="t3 text-normal">
					회고를 저장하지 않고 <br />
					나가시겠어요?
				</p>
				<p className="s2 text-neutral">작성한 회고는 저장되지 않아요.</p>
			</div>

			{/* 취소, 나가기 버튼 */}
			<div className="flex gap-2 justify-between">
				<Button variant="default" onClick={() => setOpenLeaveModal(false)}>
					취소
				</Button>
				<Link href="/" className="inline-block w-full">
					<Button variant="primary">
						나가기
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default RetrospectLeaveModalContent;
