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
    if (!confirm('Delete this article?')) return;
    setLoading(true);
    await deleteArticle(id);
    router.refresh();
    setLoading(false);
  };
  return <Button variant="ghost" size="sm" loading={loading} onClick={handle}><Trash2 size={13} className="text-[#DC2626]" /></Button>;
}
