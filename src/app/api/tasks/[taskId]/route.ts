import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/serverKy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await serverApi.get(`v1/tasks/${taskId}`);

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '해당 할일을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '요청 시간이 초과되었습니다.' },
        { status: 408 },
      );
    }
    
    return NextResponse.json(
      { error: '할일을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);    
    const response = await serverApi.delete(`v1/tasks/${taskId}`);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '응답 내용 없음');

      if (response.status === 404) {
        return NextResponse.json(
          { error: '해당 할일을 찾을 수 없습니다.' },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: `할일 삭제 실패 (${response.status}): ${response.statusText}`,
          details: errorBody,
        },
        { status: response.status },
      );
    }

    console.log(`할일 삭제 성공: ${taskId}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '요청 시간이 초과되었습니다.' },
        { status: 408 },
      );
    }

    return NextResponse.json(
      {
        error: `할일을 삭제하는 중 서버 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      },
      { status: 500 },
    );
  }
}