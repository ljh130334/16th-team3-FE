import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN_1! + process.env.NEXT_PUBLIC_TEST_TOKEN_2!;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const {taskId} = await params;

  try {
    const body = await request.json();
    
    // 백엔드 API 호출
    const response = await fetch(`${API_BASE_URL}/v1/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '해당 할일을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('할일 상태 변경 중 오류 발생:', error);
    return NextResponse.json(
      { error: '할일 상태를 변경하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}