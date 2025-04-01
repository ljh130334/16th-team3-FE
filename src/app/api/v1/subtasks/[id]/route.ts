import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

// PUT: 서브태스크 수정
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const id = params.id;
		const body = await request.json();

		const response = await serverApi.put(`v1/subtasks/${id}`, { json: body });

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
			{ error: "서브태스크 수정 중 오류가 발생했습니다." },
			{ status: 500 },
		);
	}
}

// DELETE: 서브태스크 삭제
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const id = params.id;

		const response = await serverApi.delete(`v1/subtasks/${id}`);

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`API 요청 실패: ${response.status}`);
		}

		// 성공적인 삭제 응답 (내용 없음)
		return new NextResponse(null, { status: 204 });
	} catch (error: any) {
		if (error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		return NextResponse.json(
			{ error: "서브태스크 삭제 중 오류가 발생했습니다." },
			{ status: 500 },
		);
	}
}
