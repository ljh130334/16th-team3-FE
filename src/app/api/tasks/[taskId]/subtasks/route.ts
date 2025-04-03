import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

// 서브태스크 타입 정의
interface Subtask {
	id: number;
	name: string;
	isCompleted: boolean;
	taskId: number;
}

// GET: 서브태스크 목록 조회
export async function GET(request: NextRequest, context: any) {
	try {
		const taskId = context.params.taskId;

		if (!taskId) {
			return NextResponse.json(
				{ error: "taskId 파라미터가 필요합니다." },
				{ status: 400 },
			);
		}

		const response = await serverApi.get(`v1/tasks/${taskId}/subtasks`);

		if (!response.ok) {
			throw new Error(`API 요청 실패: ${response.status}`);
		}

		const subtasks = await response.json();
		return NextResponse.json(subtasks);
	} catch (error) {
		console.error("[API] 서브태스크 조회 오류:", error);
		return NextResponse.json(
			{
				error: "서브태스크를 가져오는 중 오류가 발생했습니다.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
