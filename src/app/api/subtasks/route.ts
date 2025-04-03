import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

// 서브태스크 생성/수정 요청 타입
interface SubtaskRequest {
	taskId?: number | string;
	id?: number | string;
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
		const isCreating = body.taskId !== undefined && body.id === undefined;
		const isUpdating = body.id !== undefined && body.taskId !== undefined;

		if (!isCreating && !isUpdating) {
			return NextResponse.json(
				{
					error:
						"생성 시에는 taskId만 필요하고 id가 없어야 합니다. 수정 시에는 id와 taskId가 모두 필요합니다.",
					receivedBody: body,
				},
				{ status: 400 },
			);
		}

		const controller = new AbortController();
		let response: Response;

		if (isCreating) {
			const taskId =
				typeof body.taskId === "string"
					? Number.parseInt(body.taskId, 10)
					: body.taskId;

			response = await serverApi.post("v1/subtasks", {
				json: {
					taskId,
					name: body.name,
				},
				signal: controller.signal,
			});
		} else {
			const id =
				typeof body.id === "string" ? Number.parseInt(body.id, 10) : body.id;

			const taskId =
				typeof body.taskId === "string"
					? Number.parseInt(body.taskId, 10)
					: body.taskId;

			response = await serverApi.post("v1/subtasks", {
				json: {
					id,
					taskId,
					name: body.name,
				},
				signal: controller.signal,
			});
		}

		if (!response.ok) {
			console.error(
				`[API] 서버 응답 오류: ${response.status} ${response.statusText}`,
			);
			const errorText: string = await response
				.text()
				.catch(() => "응답 텍스트를 읽을 수 없음");
			throw new Error(`API 오류 (${response.status}): ${errorText}`);
		}

		const data = (await response.json()) as SubtaskResponse;
		return NextResponse.json(data);
	} catch (error) {
		console.error("[API] 서브태스크 생성/수정 오류:", error);

		const errorDetail =
			error instanceof Error
				? { message: error.message, stack: error.stack }
				: String(error);

		return NextResponse.json(
			{
				error: "서브태스크 생성/수정 중 오류가 발생했습니다.",
				details: errorDetail,
			},
			{ status: 500 },
		);
	}
}
