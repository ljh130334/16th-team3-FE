import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, context: any) {
	const { id } = context.params;
	try {
		const body = await request.json();
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const response = await serverApi.patch(`v1/subtasks/${id}`, {
			json: body,
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error: unknown) {
		console.error("[API] 서브태스크 수정 오류:", error);

		if (error instanceof Error && error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		return NextResponse.json(
			{
				error: "서브태스크 수정 중 오류가 발생했습니다.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest, context: any) {
	const { id } = context.params;
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const response = await serverApi.delete(`v1/subtasks/${id}`, {
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		console.error("[API] 서브태스크 삭제 오류:", error);

		if (error instanceof Error && error.name === "AbortError") {
			return NextResponse.json(
				{ error: "요청 시간이 초과되었습니다." },
				{ status: 408 },
			);
		}

		return NextResponse.json(
			{
				error: "서브태스크 삭제 중 오류가 발생했습니다.",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
