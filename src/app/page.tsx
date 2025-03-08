'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-4">
      {/* 1. 홈 화면 섹션 */}
      <section>
        <h2 className="mb-4 text-lg font-bold">홈</h2>
        <Link href="/home-page">
          <Button variant="hologram" className="w-full">
            홈 화면
          </Button>
        </Link>
      </section>

      {/* 2. 할일 추가 섹션 */}
      <section>
        <h2 className="mb-4 text-lg font-bold">할일 추가</h2>
        <div className="flex flex-col gap-2">
          <Link href="/instant-create">
            <Button variant="primary" className="w-full">
              즉시 할일 시작하기
            </Button>
          </Link>
          <Link href="/scheduled-create">
            <Button variant="primary" className="w-full">
              여유있게 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. 작은행동 섹션 */}
      <section>
        <h2 className="mb-4 text-lg font-bold">작은행동</h2>
        <div className="flex flex-col gap-2">
          <Link href="/action/start/203">
            <Button variant="hologram" className="w-full">
              작은행동 시작하기
            </Button>
          </Link>
          <Link href="/action/remind/203">
            <Button variant="hologram" className="w-full">
              리마인더 설정
            </Button>
          </Link>
          <Link href="/action/push/203">
            <Button variant="hologram" className="w-full">
              푸시알림 수신 페이지
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
