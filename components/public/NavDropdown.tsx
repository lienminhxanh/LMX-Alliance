'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResolvedNavChild {
  key: string;
  label: string;
  type: 'anchor' | 'route';
  target: string;
}

interface NavDropdownProps {
  href: string;
  label: string;
  active: boolean;
  children: ResolvedNavChild[];
  onAnchorClick: (target: string) => void;
}

export function NavDropdown({ href, label, active, children, onAnchorClick }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <Link
        ref={triggerRef}
        href={href}
        className={cn(
          'flex items-center gap-1 px-3 py-5 text-sm transition-colors border-b-2',
          active
            ? 'border-[#8ec63f] text-[var(--color-primary-dark)] font-semibold'
            : 'border-transparent text-[#374151] hover:text-[var(--color-primary-dark)]'
        )}
      >
        {label}
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </Link>

      {open && (
        <div
          className="absolute left-0 top-full bg-white z-50 min-w-[220px] py-2"
          style={{ borderRadius: '4px', border: '1px solid #defbbc', boxShadow: '0 8px 24px rgba(1,82,49,0.1)' }}
        >
          {children.map((child) =>
            child.type === 'anchor' ? (
              <button
                key={child.key}
                onClick={() => { setOpen(false); onAnchorClick(child.target); }}
                className="block w-full text-left px-4 py-2 text-sm text-[#374151] hover:text-[var(--color-primary-dark)] hover:bg-[#f8fbf2] transition-colors"
              >
                {child.label}
              </button>
            ) : (
              <Link
                key={child.key}
                href={child.target}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-[#374151] hover:text-[var(--color-primary-dark)] hover:bg-[#f8fbf2] transition-colors"
              >
                {child.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
