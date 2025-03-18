import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/serverKy';

export async function GET(request: NextRequest) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await serverApi.get('v1/tasks/today');
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response
        .text()
        .catch(() => '응답 내용을 읽을 수 없습니다');

      return NextResponse.json(
        {
          error: '오늘 할일을 가져오는 중 오류가 발생했습니다',
          status: response.status,
          message: response.statusText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '요청 시간이 초과되었습니다.' },
        { status: 408 },
      );
    }
    
    return NextResponse.json(
      { error: '오늘 할일을 가져오는 중 서버 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}