import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { taskId: string } },
) {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const taskId = params.taskId;
		console.log(`서브태스크 조회 요청 시작: taskId=${taskId}`);

		// 성공했던 엔드포인트인 v1/subtasks?taskId= 사용
		console.log(`API 호출: v1/subtasks?taskId=${taskId}`);
		const response = await serverApi.get(`v1/subtasks?taskId=${taskId}`, {
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		const data = await response.json();
		console.log(`서브태스크 데이터 수신 성공: ${data.length}개 항목`);
		return NextResponse.json(data);
	} catch (error: any) {
		console.error("서브태스크 조회 세부 오류:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		});

		if (error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		// 상세한 오류 정보 포함
		return NextResponse.json(
			{
				error: "작업의 서브태스크를 가져오는 중 오류가 발생했습니다.",
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
