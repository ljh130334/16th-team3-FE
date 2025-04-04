import { serverApi } from "@/lib/serverKy";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ personaId: string }> },
) {
	try {
		const { personaId } = await params;
		if (!personaId) {
			return NextResponse.json(
				{ error: "잘못된 요청입니다." },
				{ status: 400 },
			);
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);
		const response = await serverApi.get(`v1/persona/${personaId}/playlists`);

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
			{ error: "플레이리스트를 가져오는 중 오류가 발생했습니다." },
			{ status: 500 },
		);
	}
}
