import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { RefObject } from 'react';
import Image from 'next/image';

interface ClearableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  ref: RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MAX_TASK_LENGTH = 15;

const ClearableInput = ({
  className,
  value,
  ref,
  onChange,
  ...props
}: ClearableInputProps) => {
  const isInvalid = value.length > MAX_TASK_LENGTH;

  return (
    <div className="relative w-full">
      <span className={cn(isInvalid ? 'text-red-500' : 'text-primary', 'b3')}>
        할 일 입력
      </span>
      <Input
        className={cn(
          't3 w-full border-0 border-b bg-transparent pl-0 pr-10 transition-colors focus:border-b-2',
          isInvalid
            ? 'border-red-500 focus:border-red-500'
            : 'focus:border-b-component-accent-primary',
          className,
        )}
        value={value}
        ref={ref}
        onChange={onChange}
        {...props}
      />

      {value && (
        <button
          type="button"
          className="absolute right-0 top-[24px] translate-y-1/4 text-black hover:text-gray-600"
          onClick={() =>
            onChange({
              target: { value: '' },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        >
          <Image src="icons/x-circle.svg" alt="제거" width={24} height={24} />
        </button>
      )}
    </div>
  );
};

export default ClearableInput;
