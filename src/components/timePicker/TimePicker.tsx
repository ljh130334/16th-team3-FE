'use client';

import { TimePickerType } from '@/types/create';
import Wheel from './Wheel';

interface TimePickerProps {
  time: TimePickerType | undefined;
  handleTime: (time: TimePickerType) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, '0'),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);
const MERIDIEM = ['오전', '오후'];

const TimePicker = ({ time, handleTime }: TimePickerProps) => {
  const handleSelectedMeridiem = (deadlineTime: string) => {
    handleTime({
      meridiem: deadlineTime,
      hour: time?.hour || '01',
      minute: time?.minute || '00',
    });
  };

  const handleSelectedHour = (deadlineTime: string) => {
    handleTime({
      meridiem: time?.meridiem || '오전',
      hour: deadlineTime,
      minute: time?.minute || '00',
    });
  };

  const handleSelectedMinute = (deadlineTime: string) => {
    handleTime({
      meridiem: time?.meridiem || '오전',
      hour: time?.hour || '01',
      minute: deadlineTime,
    });
  };

  return (
    <div className="background-primary flex h-[180px] justify-center gap-6">
      <div className="h-[180px] w-[80px]">
        <Wheel
          length={2}
          width={80}
          setValue={(relative) => (relative % 2 === 0 ? '오전' : '오후')}
        />
      </div>
      <div className="h-[180px] w-[100px]">
        <Wheel initIdx={1} length={12} width={50} loop={true} />
      </div>
      <div className="h-[180px] w-[100px]">
        <Wheel initIdx={35} length={60} width={50} loop={true} />
      </div>
    </div>
  );
};

export default TimePicker;
