import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 디버깅 로그 추가
    console.log("API 호출 시작");
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const AUTH_TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN_1! + process.env.NEXT_PUBLIC_TEST_TOKEN_2!;
    
    // URL 변경: /v1/tasks -> /v1/tasks/all-todos
    const fullUrl = `${API_BASE_URL}/v1/tasks/all-todos`;
    console.log("요청 URL:", fullUrl);
    
    // 명시적 AbortController 사용
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // 응답 정보 상세 로깅
    console.log("응답 상태:", response.status, response.statusText);
    console.log("응답 헤더:", Object.fromEntries([...response.headers]));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API 오류 응답:", errorText);
      
      return NextResponse.json(
        { error: `API 요청 실패 (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log("응답 데이터 받음:", !!data);
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('API 요청 오류:', error);
    console.error('오류 메시지:', error.message);
    console.error('스택 트레이스:', error.stack);
    
    // AbortError 처리
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: '요청 시간이 초과되었습니다.' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: `할일 목록을 가져오는 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}