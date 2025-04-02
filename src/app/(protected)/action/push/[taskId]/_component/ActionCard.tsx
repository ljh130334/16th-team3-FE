import { Badge } from '@/components/component/Badge';

type ActionCardProps = {
  badgeText: string;
  actionText: string;
  variant?: 'default' | 'drawer';
};

export default function ActionCard({
  badgeText,
  actionText,
  variant = 'default',
}: ActionCardProps) {
  const cardContent = (
    <div className="flex flex-col gap-3 rounded-2xl bg-[#6B6BE1]/[0.16] py-4 pl-4">
      <Badge>{badgeText}</Badge>
      <p className="text-lg font-semibold text-gray-normal">{actionText}</p>
    </div>
  );

  return variant === 'default' ? (
    <div className="rounded-2xl bg-[#17191F]">{cardContent}</div>
  ) : (
    cardContent
  );
}
