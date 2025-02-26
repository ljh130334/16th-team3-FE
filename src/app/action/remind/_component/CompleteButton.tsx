import { Button } from '@/components/ui/button';

export default function CompleteButton() {
  return (
    <div className="relative mt-auto flex flex-col items-center px-5 py-6">
      <Button variant="primary" className="relative mb-4 w-full">
        완료
      </Button>
    </div>
  );
}
