import { serverApi } from "@/lib/serverKy";
import type { FcmDeviceType } from "@/types/create";
import { type NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
	try {
		const data: FcmDeviceType = await req.json();

		const apiResponse = await serverApi.post("v1/fcm-devices", {
			body: JSON.stringify(data),
		});

		if (!apiResponse.ok) {
			const errorData = await apiResponse.json();
			return NextResponse.json(
				{ error: "Failed to POST request", details: errorData },
				{ status: apiResponse.status },
			);
		}

		const nextResponse = NextResponse.json({
			success: true,
		});

		return nextResponse;
	} catch (error) {
		return NextResponse.json(
			{ error: "Error creating scheduled task" },
			{ status: 500 },
		);
	}
}
