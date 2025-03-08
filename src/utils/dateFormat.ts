// ISO 문자열에서 '월 일 (요일)' 형식으로 변환
export function formatDateWithDay(isoString: string): string {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 요일 구하기
    const days = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)'];
    const dayOfWeek = days[date.getDay()];
    
    return `${month}월 ${day}일 ${dayOfWeek}`;
  }
  
  // ISO 문자열에서 '오전/오후 시:분' 형식으로 변환 (바텀시트용)
  export function formatTimeForDetail(isoString: string): string {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    
    const period = hours >= 12 ? '오후' : '오전';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    
    return `${period} ${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // ISO 문자열에서 '오전/오후 시시까지' 형식으로 변환 (리스트용)
  export function formatTimeForList(isoString: string, includeToday = true): string {
    const date = new Date(isoString);
    let hours = date.getHours();
    
    const period = hours >= 12 ? '오후' : '오전';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    
    // 자정인 경우 특별 처리
    if (hours === 12 && date.getMinutes() === 0 && period === '오전') {
      return includeToday ? '오늘 자정까지' : '자정까지';
    }
    
    return includeToday ? `오늘 ${period} ${hours}시까지` : `${period} ${hours}시까지`;
  }
  
  // 오늘인지 판별
  export function isToday(isoString: string): boolean {
    const date = new Date(isoString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  // 날짜 문자열 (YYYY-MM-DD) 및 시간 문자열에서 Date 객체 생성
  export function parseDateAndTime(dateStr: string, timeStr: string): Date {
    const date = new Date(dateStr);
    
    let hours = 0;
    if (timeStr.includes('오후')) {
      const match = timeStr.match(/오후\s*(\d+)시/);
      if (match && match[1]) {
        hours = parseInt(match[1]);
        if (hours !== 12) hours += 12;
      }
    } else if (timeStr.includes('오전')) {
      const match = timeStr.match(/오전\s*(\d+)시/);
      if (match && match[1]) {
        hours = parseInt(match[1]);
        if (hours === 12) hours = 0;
      }
    } else if (timeStr.includes('자정')) {
      hours = 0;
    }
    
    date.setHours(hours, 0, 0, 0);
    return date;
  }
  
  // 남은 시간 계산하여 문자열 반환
  export function calculateRemainingTime(targetDate: Date): string {
    const now = new Date().getTime();
    const timeLeft = targetDate.getTime() - now;
    
    if (timeLeft <= 0) return '00:00:00 남음';
    
    // 24시간(1일) 이상인 경우 일, 시간, 분 형식으로 표시
    if (timeLeft >= 24 * 60 * 60 * 1000) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const h = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days}일 ${h}시간 ${m}분 남음`;
    } else {
      // 24시간 미만인 경우 시:분:초 형식으로 표시
      const h = Math.floor(timeLeft / (1000 * 60 * 60));
      const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} 남음`;
    }
  }