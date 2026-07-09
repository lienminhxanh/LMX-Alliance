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
    if (!confirm('Are you sure you want to delete this article?')) return;
    setLoading(true);
    try {
      await deleteArticle(id);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to delete. It may be linked to other records.');
    } finally {
      setLoading(false);
    }
  };
  return <Button variant="ghost" size="sm" loading={loading} onClick={handle}><Trash2 size={13} className="text-[#DC2626]" /></Button>;
}
