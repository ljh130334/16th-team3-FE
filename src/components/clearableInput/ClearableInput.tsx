import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { useState, RefObject } from 'react';
import Image from 'next/image';

interface ClearableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  ref: RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClearableInput = ({
  className,
  value,
  ref,
  onChange,
  ...props
}: ClearableInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <span
        className={cn(
          'b3 transition-colors',
          isFocused ? 'text-primary' : 'text-neutral',
        )}
      >
        할 일 입력
      </span>

      <Input
        className={cn(
          'focus-within: t3 w-full border-0 border-b bg-transparent pl-0 pr-10 transition-colors focus:border-b-2 focus:border-b-component-accent-primary',
          className,
        )}
        value={value}
        ref={ref}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {value && isFocused && (
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
