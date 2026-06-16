import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export function Card({ className, padding = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-white border border-[#E8E9ED]', padding && 'p-6', className)}
      style={{ borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 pb-4 border-b border-[#E8E9ED]', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-[#1F2937]', className)} style={{ fontFamily: 'var(--font-display)' }} {...props}>
      {children}
    </h3>
  );
}
