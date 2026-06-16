'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={ref}
        className={cn('relative bg-white w-full border border-[#E8E9ED]', sizes[size])}
        style={{ borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E9ED]">
            <h2 className="text-lg font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
            <button onClick={onClose} className="text-[#6B7280] hover:text-[#1F2937] transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
