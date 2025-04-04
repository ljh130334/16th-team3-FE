import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from "next/image";
import { useEffect, useState } from 'react';

interface OneButtonDialogProps {
  value: boolean;
  title: string;
  content1: string;
  content2: string;
  buttonName: string;
  icon?: string;
  onButtonClick: () => void;
}

export function OneButtonDialog({
  value,
  title,
  content1,
  content2,
  buttonName,
  icon,
  onButtonClick,
}: OneButtonDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(value);
  }, [value]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[328px] rounded-[24px] border-none bg-component-gray-secondary px-4 pt-6 pb-4">
        <div className='flex flex-col gap-4 items-center justify-center'>
          {icon && (
            <Image
              src={icon}
              alt={icon}
              width={24}
              height={24}
            />
          )}
        </div>
        <div>
          <DialogHeader>
            <DialogTitle className="text-t3 text-gray-normal">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-center text-b3 text-gray-neutral">
            {content1} <br />
            {content2}
          </div>
        </div>
        <Button
          size="md"
          variant="primary"
          className="w-full"
          onClick={onButtonClick}
        >
          {buttonName}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
