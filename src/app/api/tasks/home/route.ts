import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const AUTH_TOKEN = accessToken;

    const fullUrl = `${API_BASE_URL}/v1/tasks/home`;
    console.log('요청 URL:', fullUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('응답 상태:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 오류 응답:', errorText);

      return NextResponse.json(
        { error: `API 요청 실패 (${response.status}): ${errorText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log('홈 데이터 응답 받음');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('홈 API 요청 오류:', error);
    console.error('오류 메시지:', error.message);

    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '요청 시간이 초과되었습니다.' },
        { status: 408 },
      );
    }

    return NextResponse.json(
      {
        error: `홈 화면 데이터를 가져오는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
      },
      { status: 500 },
    );
  }
}
