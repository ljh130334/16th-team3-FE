import { Badge } from '@/components/component/Badge';

interface ActionCardProps {
  title?: string;
  isCompleted?: boolean;
  onClick?: () => void;
  variant?: 'gradient1' | 'gradient2';
}

export default function ActionCard({
  title,
  isCompleted = false,
  onClick,
  variant = 'gradient1',
}: ActionCardProps) {
  return (
    <div
      className={`cursor-pointer rounded-2xl bg-[#17191F]`}
      onClick={onClick}
    >
      <div className="relative flex flex-col gap-3 rounded-2xl bg-[#6B6BE1]/[0.16] py-4 pl-4">
        <Badge>작은 행동</Badge>
        <p
          className={`text-lg font-semibold ${isCompleted ? 'text-gray-light' : 'text-gray-normal'}`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
