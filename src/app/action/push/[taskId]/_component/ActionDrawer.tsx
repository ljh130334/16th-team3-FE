import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import ActionCard from './ActionCard';
import { TaskResponse } from '@/types/task';
const PushScreenState = {
  INITIAL: 'initial',
  SECOND_CHANCE: 'second',
  FINAL_WARNING: 'final',
} as const;

type PushScreenStateType =
  (typeof PushScreenState)[keyof typeof PushScreenState];

export default function PushActionDrawer({
  screenState,
  task,
  onTakePicture,
}: {
  screenState: PushScreenStateType;
  task: TaskResponse;
  onTakePicture: () => void;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant={
            screenState === PushScreenState.FINAL_WARNING ? 'point' : 'primary'
          }
          className={`relative w-full ${
            screenState === PushScreenState.FINAL_WARNING ? 'mb-[34px]' : ''
          }`}
        >
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
          <ActionCard
            variant="drawer"
            badgeText="작은 행동"
            actionText={task.triggerAction}
          />
          <Button
            variant="primary"
            className="relative mb-4 mt-7 w-full"
            onClick={onTakePicture}
          >
            사진찍기
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
