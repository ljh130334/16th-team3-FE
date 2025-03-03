'use client';

import { TimePickerType } from '@/types/create';
import Wheel from './Wheel';

interface TimePickerProps {
  time: TimePickerType | undefined;
  handleTime: (time: TimePickerType) => void;
}

const TimePicker = ({ time, handleTime }: TimePickerProps) => {
  const meridiemInitIdx = time ? (time.meridiem === '오후' ? 1 : 0) : 0;
  const hourInitIdx = time ? Number(time.hour) - 1 : 0;
  const minuteInitIdx = time ? Number(time.minute) : 0;

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
      <div className="h-[180px] w-[100px]">
        <Wheel
          initIdx={meridiemInitIdx}
          length={2}
          width={50}
          setValue={(relative) => (relative % 2 === 0 ? '오전' : '오후')}
          onChange={(selected) => handleSelectedMeridiem(selected as string)}
        />
      </div>
      <div className="h-[180px] w-[100px]">
        <Wheel
          initIdx={hourInitIdx}
          length={12}
          width={50}
          loop={true}
          setValue={(relative) => {
            const hour = ((relative % 12) + 1).toString().padStart(2, '0');
            return hour;
          }}
          onChange={(selected) => handleSelectedHour(selected as string)}
        />
      </div>
      <div className="h-[180px] w-[100px]">
        <Wheel
          initIdx={minuteInitIdx}
          length={60}
          width={50}
          loop={true}
          setValue={(relative) => {
            const minute = String(relative % 60).padStart(2, '0');
            return minute;
          }}
          onChange={(selected) => handleSelectedMinute(selected as string)}
        />
      </div>
    </div>
  );
};

export default TimePicker;
