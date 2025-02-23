import { Button } from '@/components/ui/button';

export default function StartPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button> 다음</Button>
      <Button variant="primary"> 다음</Button>
      <Button variant="point"> 다음</Button>
      <Button variant="hologram">다음</Button>
      <Button size="sm">다음</Button>
    </div>
  );
}
