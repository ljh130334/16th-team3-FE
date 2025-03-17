// app/Immersion/page.tsx (Server Component)
import { fetchTask } from '@/lib/task';
import { cookies } from 'next/headers';
import ImmersionPageClient from './ImmersionPageClient';
import { CurrentTimeProvider } from '@/provider/CurrentTimeProvider';

export default async function Immersion({
  params,
}: {
  params: { taskId: string };
}) {
  const { taskId } = await params;

  // 쿠키 확인
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <CurrentTimeProvider>
        <ImmersionPageClient
          initialTask={null}
          errorMessage="Access token is not found"
        />
      </CurrentTimeProvider>
    );
  }

  // 토큰이 있는 경우
  const task = await fetchTask(taskId, accessToken).catch((error) => {
    // 예: API 호출 실패 시 에러 메시지 전달
    return null; // 혹은 다른 방식으로 처리
  });

  // task가 null이면 API 실패로 가정
  if (!task) {
    return (
      <CurrentTimeProvider>
        <ImmersionPageClient
          initialTask={null}
          errorMessage="Failed to fetch task data."
        />
      </CurrentTimeProvider>
    );
  }

  // 정상적으로 데이터를 받았을 경우
  return (
    <CurrentTimeProvider>
      <ImmersionPageClient initialTask={task} errorMessage="" />
    </CurrentTimeProvider>
  );
}
