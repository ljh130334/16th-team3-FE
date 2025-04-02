type ScheduleCardProps = {
  task: string;
  deadline: string;
};

export default function ScheduleCard({ task, deadline }: ScheduleCardProps) {
  return (
    <div className="w-full rounded-2xl bg-[#17191F]">
      <div className="flex w-full flex-col gap-3 rounded-2xl bg-[#6B6BE1]/[0.16] py-4 pl-4">
        <div className="flex h-[26px] w-[37px] items-center justify-center overflow-hidden rounded-[8px] bg-component-accent-secondary py-[5px]">
          <div className="z-10 text-l6 font-semibold text-icon-accent">
            일정
          </div>
        </div>
        <div>
          <div className="flex gap-2.5">
            <div className="text-b2 text-gray-alternative">할일</div>
            <div className="text-s2 text-gray-normal">{task}</div>
          </div>
          <div className="flex gap-2.5">
            <div className="text-b2 text-gray-alternative">마감일</div>
            <div className="text-b2 text-gray-neutral">{deadline}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
