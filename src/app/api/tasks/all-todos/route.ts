// 전체 할일 GET 처리

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN_1! + process.env.NEXT_PUBLIC_TEST_TOKEN_2!;

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/tasks/all-todos`, {
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
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('전체 할일 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '전체 할일을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}