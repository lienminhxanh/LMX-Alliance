import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[#1F2937]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2 text-sm border border-[#E8E9ED] bg-white text-[#1F2937]',
            'focus:outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937]',
            'disabled:bg-[#F5F6F8] disabled:cursor-not-allowed',
            error && 'border-[#DC2626]',
            className
          )}
          style={{ borderRadius: '2px' }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-[#DC2626]">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
export { Select };
