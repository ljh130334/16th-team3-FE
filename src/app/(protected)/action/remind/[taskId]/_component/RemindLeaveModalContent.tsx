import { Button } from "@/components/ui/button";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
	setOpenLeaveModal: (open: boolean) => void;
    taskId: number;
};

const RemindLeaveModalContent = ({ setOpenLeaveModal, taskId }: Props) => {
    const router = useRouter();

	return (
		<div className="flex flex-col gap-5">
			{/* 상단 텍스트 */}
			<div className="flex flex-col gap-1 text-center">
            <p className="t3 text-normal">
					리마인드 설정을 마치지 않고 <br />
					나가시겠어요?
				</p>
				<p className="b3 text-neutral">
					설정한 리마인드는 저장되지 않아요. <br />
					나가면 다시 알림이 시작돼요.
				</p>
			</div>

			{/* 취소, 나가기 버튼 */}
			<div className="flex gap-2 justify-between">
				<Button variant="default" onClick={() => setOpenLeaveModal(false)}>
					취소
				</Button>
				<Button variant="primary" onClick={() => router.push(`/action/start/${taskId}`)}>
                    나가기
                </Button>
			</div>
		</div>
	);
};

export default RemindLeaveModalContent;
