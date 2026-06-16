'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { deleteSector } from '@/actions/sectors';
import { useRouter } from 'next/navigation';

export function DeleteSectorButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this sector?')) return;
    setLoading(true);
    await deleteSector(id);
    router.refresh();
    setLoading(false);
  };

  return (
    <Button variant="ghost" size="sm" loading={loading} onClick={handleDelete}>
      <Trash2 size={13} className="text-[#DC2626]" />
    </Button>
  );
}
