import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#F5F6F8] text-[#6B7280]',
  success: 'bg-green-50 text-[#059669]',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-[#DC2626]',
  info: 'bg-blue-50 text-blue-700',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
