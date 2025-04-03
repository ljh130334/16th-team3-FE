import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

interface OneButtonDialogProps {
  value: boolean;
  title: string;
  content1: string;
  content2: string;
  buttonName: string;
  onButtonClick: () => void;
}

export function OneButtonDialog({
  value,
  title,
  content1,
  content2,
  buttonName,
  onButtonClick,
}: OneButtonDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(value);
  }, [value]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[328px] rounded-[24px] border-none bg-component-gray-secondary px-4 py-6">
        <DialogHeader>
          <DialogTitle className="text-t3 text-gray-normal">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mb-2 text-center text-b3 text-gray-neutral">
          {content1} <br />
          {content2}
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
