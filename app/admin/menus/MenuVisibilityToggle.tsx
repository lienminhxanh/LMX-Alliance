'use client';
import { useState, useTransition } from 'react';
import { toggleMenuItemVisibility } from '@/actions/menus';

export function MenuVisibilityToggle({ itemKey, initialVisible }: { itemKey: string; initialVisible: boolean }) {
  const [visible, setVisible] = useState(initialVisible);
  const [isPending, startTransition] = useTransition();

  const handleChange = (checked: boolean) => {
    const previous = visible;
    setVisible(checked);
    startTransition(async () => {
      try {
        await toggleMenuItemVisibility(itemKey, checked);
      } catch {
        setVisible(previous);
        alert('Failed to update visibility.');
      }
    });
  };

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={visible}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.checked)}
        className="h-4 w-4 border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
        style={{ borderRadius: 0 }}
      />
      <span className="text-xs text-[#6B7280]">{visible ? 'Visible' : 'Hidden'}</span>
    </label>
  );
}
