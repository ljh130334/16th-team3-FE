import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

// 서브태스크 생성/수정 요청 타입
interface SubtaskRequest {
	taskId?: number;
	id?: number;
	name: string;
}

// 서브태스크 응답 타입
interface SubtaskResponse {
	id: number;
	name: string;
	isCompleted: boolean;
	taskId: number;
}

// POST: 서브태스크 생성 또는 수정
export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as SubtaskRequest;

		// 유효성 검사
		if (!body.name) {
			return NextResponse.json(
				{ error: "name은 필수 필드입니다." },
				{ status: 400 },
			);
		}

		// 생성 또는 수정 구분
		const isCreating = body.taskId && !body.id;
		const isUpdating = body.id && !body.taskId;

		if (!isCreating && !isUpdating) {
			return NextResponse.json(
				{ error: "생성 시에는 taskId가, 수정 시에는 id가 필요합니다." },
				{ status: 400 },
			);
		}

		const controller = new AbortController();
		let response;

		if (isCreating) {
			// 서브태스크 생성
			console.log(
				`[API] 서브태스크 생성 요청: taskId=${body.taskId}, name=${body.name}`,
			);

			response = await serverApi.post("v1/subtasks", {
				json: {
					taskId: body.taskId,
					name: body.name,
				},
				signal: controller.signal,
			});
		} else {
			// 서브태스크 수정 (이름 변경)
			console.log(
				`[API] 서브태스크 수정 요청: id=${body.id}, name=${body.name}`,
			);

			response = await serverApi.post("v1/subtasks", {
				json: {
					id: body.id,
					name: body.name,
				},
				signal: controller.signal,
			});
		}

		const data = (await response.json()) as SubtaskResponse;
		return NextResponse.json(data);
	} catch (error) {
		console.error("[API] 서브태스크 생성/수정 오류:", error);
		return NextResponse.json(
			{
				error: "서브태스크 생성/수정 중 오류가 발생했습니다.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
