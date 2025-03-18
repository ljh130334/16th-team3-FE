import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/serverKy';

export async function GET(request: NextRequest) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const mondayOfThisWeek = new Date(today);
    mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);
    mondayOfThisWeek.setHours(0, 0, 0, 0);
    
    const sundayOfThisWeek = new Date(mondayOfThisWeek);
    sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
    sundayOfThisWeek.setHours(23, 59, 59, 999);
    
    const searchParams = new URLSearchParams({
      startDate: mondayOfThisWeek.toISOString(),
      endDate: sundayOfThisWeek.toISOString()
    });
    
    const response = await serverApi.get(`v1/tasks/current-week?${searchParams}`);
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      
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
      { error: '이번주 할일을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}