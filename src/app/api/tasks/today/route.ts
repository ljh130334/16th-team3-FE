import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN_1 && process.env.NEXT_PUBLIC_TEST_TOKEN_2 
  ? process.env.NEXT_PUBLIC_TEST_TOKEN_1 + process.env.NEXT_PUBLIC_TEST_TOKEN_2
  : '';

export async function GET(request: NextRequest) {
  try {
    // 토큰이 없는 경우 처리
    if (!AUTH_TOKEN) {
      console.error('인증 토큰이 없습니다');
      return NextResponse.json(
        { error: '서버 구성 오류: 인증 정보가 없습니다' },
        { status: 500 }
      );
    }

    // API 요청
    const response = await fetch(`${API_BASE_URL}/v1/tasks/today`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      cache: 'no-store' // 항상 최신 데이터를 가져오기 위해 캐시 비활성화
    });

    // 오류 응답 상세 처리
    if (!response.ok) {
      const errorText = await response.text().catch(() => '응답 내용을 읽을 수 없습니다');
      
      console.error('API 응답 오류:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { 
          error: '오늘 할일을 가져오는 중 오류가 발생했습니다',
          status: response.status,
          message: response.statusText
        },
        { status: response.status }
      );
    }

    // 성공 응답 처리
    const data = await response.json();
    
    // 응답 기록 (디버깅용)
    console.log('오늘 할일 API 응답 성공, 항목 수:', Array.isArray(data) ? data.length : '데이터가 배열이 아님');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'private, max-age=60' // 클라이언트 측 캐싱 60초
      }
    });
  } catch (error) {
    console.error('오늘 할일 조회 중 예외 발생:', error);
    return NextResponse.json(
      { error: '오늘 할일을 가져오는 중 서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}