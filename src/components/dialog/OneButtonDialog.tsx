import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState, ReactNode } from 'react';

interface OneButtonDialogProps {
  value: boolean;
  title: string;
  content: ReactNode;
  buttonName: string;
  onButtonClick: () => void;
}

export function OneButtonDialog({
  value,
  title,
  content,
  buttonName,
  onButtonClick,
}: OneButtonDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(value);
  }, [value]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-component-gray-secondary">
        <DialogHeader>
          <DialogTitle className="text-t3 text-gray-normal">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-b3 text-gray-neutral">{content}</div>
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
