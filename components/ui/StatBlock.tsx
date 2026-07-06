import { cn } from '@/lib/utils';
import { CountUp } from '@/components/ui/CountUp';

interface StatBlockProps {
  value: string;
  label: string;
  className?: string;
}

export function StatBlock({ value, label, className }: StatBlockProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <CountUp value={value} label={label} />
    </div>
  );
}
