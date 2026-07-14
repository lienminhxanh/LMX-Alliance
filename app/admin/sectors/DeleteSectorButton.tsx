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
    if (!confirm('Bạn có chắc muốn xóa lĩnh vực này?')) return;
    setLoading(true);
    try {
      await deleteSector(id);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Xóa thất bại. Lĩnh vực có thể đang liên kết với dữ liệu khác.');
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
