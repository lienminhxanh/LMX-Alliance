import { cn } from '@/lib/utils';
import { CountUp } from '@/components/ui/CountUp';

// Not yet wired into any page — intentionally deferred past Phase 3 (see docs/superpowers/plans/2026-07-06-phase3-featured-projects.md, "Deferred scope"), not dead by oversight.
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
