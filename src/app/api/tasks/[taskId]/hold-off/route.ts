import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/serverKy';

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
      return NextResponse.json(
        { error: '작업 업데이트에 실패했습니다.' },
        { status: response.status },
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
