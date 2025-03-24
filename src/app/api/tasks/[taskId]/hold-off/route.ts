import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ taskId: string }> },
) {
	try {
		const data = await request.json();
		const { taskId } = await params;

		const response = await serverApi.patch(`v1/tasks/${taskId}/hold-off`, {
			json: data,
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(
				{ error: "Failed to PATCH request", details: errorData },
				{ status: response.status },
			);
		}

		const result = await response.json();
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{
				error: "서버 내부 오류가 발생했습니다.",
				details: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			},
			{ status: 500 },
		);
	}
}
