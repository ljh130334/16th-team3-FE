import Image from 'next/image';
import ActionRemindPageClient from './ActionRemindPageClient';
import { fetchTask } from '@/lib/task';
import { TaskResponse } from '@/types/task';
import { cookies } from 'next/headers';

export default async function Remind({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Access token is not found');
  }

  const task: TaskResponse = await fetchTask(taskId, accessToken);
  return (
    <div className="flex h-screen flex-col bg-background-primary">
      {/* TODO : 헤더 컴포넌트로 변경 예정 */}
      <div className="flex items-center px-5 py-[14px]">
        <Image src="/arrow-left.svg" alt="왼쪽 화살표" width={24} height={24} />
      </div>

      <ActionRemindPageClient initialTask={task} />
    </div>
  );
}
