// import { serverApi } from "@/lib/serverKy";
// import { NextResponse } from "next/server";

// export async function GET() {
// 	try {
// 		console.log("[API] 몰입화면 API 요청 시작");

// 		const response = await serverApi.get("v1/immersion-tasks/all");
// 		console.log(`[API] 응답 상태: ${response.status}`);

// 		if (!response.ok) {
// 			console.error(`[API] 응답 오류: ${response.status}`);
// 			throw new Error(`API 요청 실패: ${response.status}`);
// 		}

// 		const data = await response.json();
// 		console.log(`[API] 응답 데이터: ${JSON.stringify(data).slice(0, 100)}...`);

// 		return NextResponse.json(data);
// 	} catch (error) {
// 		console.error("[API] 몰입화면 데이터 조회 오류:", error);

// 		if (error instanceof Error) {
// 			console.error("[API] 상세 오류 정보:", {
// 				name: error.name,
// 				message: error.message,
// 				stack: error.stack,
// 			});
// 		}

// 		return NextResponse.json(
// 			{
// 				error: "서버 오류가 발생했습니다.",
// 				details: error instanceof Error ? error.message : String(error),
// 			},
// 			{ status: 500 },
// 		);
// 	}
// }
