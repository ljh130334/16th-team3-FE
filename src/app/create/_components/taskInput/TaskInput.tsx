import ClearableInput from '@/components/clearableInput/ClearableInput';
import { useEffect, useRef, useState } from 'react';

const WAITING_TIME = 300;
const MAX_TASK_LENGTH = 15;

interface TaskInputProps {
  onClick: (task: string) => void;
}

const TaskInput = ({ onClick }: TaskInputProps) => {
  const [task, setTask] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const isInvalid = task.length > MAX_TASK_LENGTH || task.length === 0;

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, WAITING_TIME);
    }
  }, []);

  return (
    <div>
      <ClearableInput ref={inputRef} value={task} onChange={handleTaskChange} />

      {task.length > MAX_TASK_LENGTH && (
        <p className="text-sm text-red-500">
          최대 16자 이내로 입력할 수 있어요.
        </p>
      )}

      <button
        className={`mt-5 w-full rounded-md px-4 py-2 font-semibold text-white transition ${
          isInvalid
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={() => onClick(task)}
        disabled={isInvalid}
      >
        다음
      </button>
    </div>
  );
};

export default TaskInput;
