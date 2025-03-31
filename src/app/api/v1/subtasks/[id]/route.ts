import { NextResponse } from "next/server";

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const id = params.id;
		const body = await request.json();

		return NextResponse.json({
			id: Number(id),
			taskId: body.taskId || 0,
			name: body.name || "string",
			isCompleted: body.isCompleted ?? true,
		});
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "서브태스크 수정 실패" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		return new NextResponse(null, { status: 204 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message || "서브태스크 삭제 실패" },
			{ status: 500 },
		);
	}
}
