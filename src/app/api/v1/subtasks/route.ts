import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

// GET: 서브태스크 목록 조회
export async function GET(request: NextRequest) {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		// URL 파라미터 추출
		const { searchParams } = new URL(request.url);
		const taskId = searchParams.get("taskId");

		// taskId 파라미터가 있으면 해당 taskId의 서브태스크만 조회
		const endpoint = taskId ? `v1/subtasks?taskId=${taskId}` : "v1/subtasks";

		const response = await serverApi.get(endpoint);

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`API 요청 실패: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error: any) {
		if (error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		return NextResponse.json(
			{ error: "서브태스크를 가져오는 중 오류가 발생했습니다." },
			{ status: 500 },
		);
	}
}

// POST: 서브태스크 생성
export async function POST(request: NextRequest) {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		// 요청 본문 추출
		const body = await request.json();

		// 필수 필드 확인
		if (!body.taskId || !body.name) {
			return NextResponse.json(
				{ error: "taskId와 name은 필수 필드입니다" },
				{ status: 400 },
			);
		}

		const response = await serverApi.post("v1/subtasks", { json: body });

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`API 요청 실패: ${response.status}`);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error: any) {
		if (error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		return NextResponse.json(
			{ error: "서브태스크 생성 중 오류가 발생했습니다." },
			{ status: 500 },
		);
	}
}
