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
    if (!confirm('Are you sure you want to delete this sector?')) return;
    setLoading(true);
    try {
      await deleteSector(id);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to delete. It may be linked to other records.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="ghost" size="sm" loading={loading} onClick={handleDelete}>
      <Trash2 size={13} className="text-[#DC2626]" />
    </Button>
  );
}
