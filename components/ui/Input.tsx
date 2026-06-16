import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[#1F2937]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2 text-sm border border-[#E8E9ED] bg-white text-[#1F2937] placeholder-[#6B7280]',
            'focus:outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937]',
            'disabled:bg-[#F5F6F8] disabled:cursor-not-allowed',
            error && 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]',
            className
          )}
          style={{ borderRadius: '2px' }}
          {...props}
        />
        {error && <span className="text-xs text-[#DC2626]">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export { Input };

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-[#1F2937]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2 text-sm border border-[#E8E9ED] bg-white text-[#1F2937] placeholder-[#6B7280]',
            'focus:outline-none focus:border-[#1F2937] focus:ring-1 focus:ring-[#1F2937]',
            'disabled:bg-[#F5F6F8] disabled:cursor-not-allowed resize-y min-h-[100px]',
            error && 'border-[#DC2626]',
            className
          )}
          style={{ borderRadius: '2px' }}
          {...props}
        />
        {error && <span className="text-xs text-[#DC2626]">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
