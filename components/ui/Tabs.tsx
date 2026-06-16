'use client';
import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext<{ active: string; setActive: (v: string) => void }>({
  active: '',
  setActive: () => {},
});

export function Tabs({ defaultValue, children, className }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex border-b border-[#E8E9ED] gap-0', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
        isActive
          ? 'border-[#1F2937] text-[#1F2937]'
          : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className="py-4">{children}</div>;
}
