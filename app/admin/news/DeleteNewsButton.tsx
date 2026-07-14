'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { deleteArticle } from '@/actions/news';
import { useRouter } from 'next/navigation';

export function DeleteNewsButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handle = async () => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    setLoading(true);
    try {
      await deleteArticle(id);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Xóa thất bại. Bài viết có thể đang liên kết với dữ liệu khác.');
    } finally {
      setLoading(false);
    }
  };
  return <Button variant="ghost" size="sm" loading={loading} onClick={handle}><Trash2 size={13} className="text-[#DC2626]" /></Button>;
}
