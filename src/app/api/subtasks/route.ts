import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

// API 응답 타입 정의
interface ImmersionTask {
	taskId: number;
	name: string;
	subtasks?: Array<{
		id: number;
		name: string;
		isCompleted?: boolean;
		isDeleted?: boolean;
	}>;
}

interface ImmersionResponse {
	immersionTasks: ImmersionTask[];
}

// 서브태스크 타입 정의
interface Subtask {
	id: number;
	name: string;
	isCompleted: boolean;
	taskId: number;
}

// GET: 서브태스크 목록 조회
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const taskId = searchParams.get("taskId");

		if (!taskId) {
			return NextResponse.json(
				{ error: "taskId 파라미터가 필요합니다." },
				{ status: 400 },
			);
		}

		console.log(`[API] 서브태스크 조회 요청: taskId=${taskId}`);

		const response = await serverApi.get("v1/immersion-tasks/all");

		if (!response.ok) {
			throw new Error(`API 요청 실패: ${response.status}`);
		}

		const data = (await response.json()) as ImmersionResponse;

		// immersionTasks에서 해당 taskId의 subtasks만 필터링
		const targetTask = data.immersionTasks?.find(
			(task) => task.taskId === Number(taskId),
		);

		if (!targetTask || !targetTask.subtasks) {
			return NextResponse.json([]);
		}

		// isDeleted가 false인 서브태스크만 반환
		const subtasks = targetTask.subtasks
			.filter((subtask) => !subtask.isDeleted)
			.map((subtask) => ({
				id: subtask.id,
				name: subtask.name,
				isCompleted: subtask.isCompleted ?? false,
				taskId: Number(taskId),
			}));

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

// 서브태스크 생성 요청 타입
interface SubtaskCreateRequest {
	taskId: number;
	name: string;
}

// 서브태스크 응답 타입
interface SubtaskResponse {
	id: number;
	name: string;
	isCompleted: boolean;
	taskId: number;
}

// POST: 서브태스크 생성
export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as SubtaskCreateRequest;

		if (!body.taskId || !body.name) {
			return NextResponse.json(
				{ error: "taskId와 name은 필수 필드입니다." },
				{ status: 400 },
			);
		}

		console.log(
			`[API] 서브태스크 생성 요청: taskId=${body.taskId}, name=${body.name}`,
		);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const response = await serverApi.post("v1/subtasks", {
			json: body,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		const data = (await response.json()) as SubtaskResponse;
		return NextResponse.json(data);
	} catch (error) {
		console.error("[API] 서브태스크 생성 오류:", error);

		if (error instanceof Error && error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		return NextResponse.json(
			{
				error: "서브태스크 생성 중 오류가 발생했습니다.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
