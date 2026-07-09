import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ eyebrow, title, align = 'left', className }: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div className={cn(isCenter ? 'text-center' : 'text-left', className)}>
      <p
        className="text-xs uppercase tracking-widest font-semibold mb-2"
        style={{ color: 'var(--color-primary-dark)' }}
      >
        {eyebrow}
      </p>
      <div
        className={cn('h-[3px] w-10 mb-4', isCenter && 'mx-auto')}
        style={{ background: 'var(--color-primary)', borderRadius: '4px' }}
      />
      <h2 style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
    </div>
  );
}
