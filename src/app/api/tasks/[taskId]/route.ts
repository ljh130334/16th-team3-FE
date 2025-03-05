import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN_1! + process.env.NEXT_PUBLIC_TEST_TOKEN_2!;

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;

  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      next: { 
        revalidate: 60 
      }
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
    console.error('할일 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '할일을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;

  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('할일 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { error: '할일을 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}