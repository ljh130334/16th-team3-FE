import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { taskId, name } = body;

		if (!taskId || !name) {
			return NextResponse.json(
				{ error: "taskId와 name은 필수 필드입니다" },
				{ status: 400 },
			);
		}

		const createdSubtask = {
			id: Date.now(),
			taskId: Number(taskId),
			name: name,
			isCompleted: false,
		};

		return NextResponse.json(createdSubtask);
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "서브태스크 생성 실패" },
			{ status: 500 },
		);
	}
}
