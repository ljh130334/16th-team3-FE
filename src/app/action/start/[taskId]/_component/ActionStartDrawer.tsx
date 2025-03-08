import { useRouter } from 'next/navigation';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import ActionCard from './ActionCard';
import TimerBadge from './TimerBadge';

interface ActionStartDrawerProps {
  onTakePicture: () => void;
  smallActionTitle?: string;
  dueDate?: string;
}

export default function ActionStartDrawer({
  onTakePicture,
  smallActionTitle,
  dueDate,
}: ActionStartDrawerProps) {
  const router = useRouter();
  return (
    <div className="relative mt-auto flex flex-col items-center px-5 py-6">
      <div className="fixed bottom-0 left-0 right-0 h-[245px] bg-component-gray-secondary blur-[75px]" />
      <TimerBadge dueDate={dueDate} />
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="primary" className="relative mb-4 w-full">
            시작하기
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex flex-col gap-2">
              <p className="text-t3">작은 행동을 사진으로 찍어주세요</p>
              <p className="text-sm text-gray-neutral">
                <span className="font-semibold text-component-accent-primary">
                  59초
                </span>
                내에 사진 촬영을 하지 않으면
                <br />
                진동이 계속 울려요
              </p>
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-5">
            <ActionCard title={smallActionTitle} variant="gradient2" />

            <Button
              variant="primary"
              className="relative mb-[50px] mt-7 w-full"
              onClick={onTakePicture}
            >
              사진찍기
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      <button
        className="relative mb-[30px] text-gray-neutral"
        onClick={() => router.push('/action/remind')}
      >
        나중에 할래요
      </button>
    </div>
  );
}
