import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { taskId: string } },
) {
	try {
		const taskId = params.taskId;

		// 실제 구현에서는 데이터베이스에서 해당 taskId의 서브태스크 목록을 조회
		// 여기서는 빈 배열 반환
		return NextResponse.json([]);
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "서브태스크 조회 실패" },
			{ status: 500 },
		);
	}
}
