import { Badge } from '@/components/component/Badge';
import Image from 'next/image';
import ActionCard from '../action/start/[taskId]/_component/ActionCard';

export default function Immersion() {
  return (
    <div className="flex h-screen flex-col bg-background-primary">
      {/* TODO : 헤더 컴포넌트로 변경 예정 */}
      <div className="flex items-center px-5 py-[14px]">
        <Image src="/arrow-left.svg" alt="왼쪽 화살표" width={24} height={24} />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-s2">디프만 리서치 과제 마감까지</div>
        <div className="text-h2">02:24:00</div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-[#6B6BE1] px-[14px] py-2.5 text-s3">
          <Image
            src="/glasshour.svg"
            alt="경고 아이콘"
            width={20}
            height={20}
          />
          한줄만 써봐요! 표지만 완성은 안 돼요!
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/glasshour.svg"
            alt="경고 아이콘"
            width={140}
            height={140}
          />
        </div>
        <Badge>눈물의 과제 김디퍼</Badge>
      </div>

      <div className="mt-8 px-5">
        <div className="bg-gradient-component-01 rounded-2xl pb-4">
          <div className="flex items-center justify-between p-4">
            <p className="text-s1">세부목표</p>
            <Image src="/plus.png" alt="플러스 버튼" width={24} height={24} />
          </div>
          <div className="text-gray-disabled flex px-4 py-2 text-b2">
            세부 목표를 추가하세요
          </div>
        </div>
      </div>
    </div>
  );
}
